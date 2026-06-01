import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { autenticar, exigirPerfil } from "../middlewares/auth";

export const usersRouter = Router();

// ─── Cadastro de super_admin ──────────────────────────────────────────────────
// Só é permitido quando ainda não existe nenhum super_admin no banco.
usersRouter.post("/super-admin", async (_req, res, next) => {
  try {
    const superAdminExistente = await prisma.user.findFirst({
      where: { perfil: "super_admin" },
    });

    if (superAdminExistente) {
      res.status(403).json({
        message: "Já existe um super_admin cadastrado. Operação não permitida.",
      });
      return;
    }

    const { nome, email, senha } = _req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ message: "nome, email e senha são obrigatórios" });
      return;
    }

    const emailEmUso = await prisma.user.findUnique({ where: { email } });
    if (emailEmUso) {
      res.status(400).json({ message: "Usuário já existe" });
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: { nome, email, senhaHash, perfil: "super_admin" },
    });

    const { senhaHash: _, ...userSemSenha } = user;
    res.status(201).json(userSemSenha);
  } catch (error) {
    next(error);
  }
});

// ─── Cadastro de admin (somente super_admin pode criar) ───────────────────────
usersRouter.post(
  "/",
  autenticar,
  exigirPerfil("super_admin"),
  async (req, res, next) => {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        res
          .status(400)
          .json({ message: "nome, email e senha são obrigatórios" });
        return;
      }

      const userExistente = await prisma.user.findUnique({
        where: { email },
      });

      if (userExistente) {
        res.status(400).json({ message: "Usuário já existe" });
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      // Admins criados por esta rota sempre terão perfil "admin"
      const user = await prisma.user.create({
        data: { nome, email, senhaHash, perfil: "admin" },
      });

      const { senhaHash: _, ...userSemSenha } = user;
      res.status(201).json(userSemSenha);
    } catch (error) {
      next(error);
    }
  }
);

// ─── Listagem de usuários (admin e super_admin) ───────────────────────────────
usersRouter.get(
  "/",
  autenticar,
  exigirPerfil("admin", "super_admin"),
  async (_req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true,
          status: true,
          criadoEm: true,
          atualizadoEm: true,
        },
        orderBy: { nome: "asc" },
      });

      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

// ─── Buscar usuário por ID ────────────────────────────────────────────────────
usersRouter.get("/:id", autenticar, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        status: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ─── Atualizar usuário ────────────────────────────────────────────────────────
// super_admin pode atualizar qualquer campo de qualquer usuário.
// admin só pode atualizar os próprios dados (sem alterar perfil).
usersRouter.put("/:id", autenticar, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email, perfil, status, senha } = req.body;
    const solicitante = req.usuario!;

    // Admins só podem editar a si mesmos e não podem mudar perfil
    if (solicitante.perfil === "admin") {
      if (solicitante.id !== id) {
        res.status(403).json({
          message: "Acesso negado: admins só podem editar o próprio perfil.",
        });
        return;
      }
      if (perfil !== undefined) {
        res.status(403).json({
          message: "Acesso negado: admins não podem alterar o perfil.",
        });
        return;
      }
    }

    const data: Record<string, unknown> = {};
    if (nome !== undefined) data.nome = nome;
    if (email !== undefined) data.email = email;
    if (senha !== undefined) data.senhaHash = await bcrypt.hash(senha, 10);

    // Somente super_admin pode alterar perfil e status
    if (solicitante.perfil === "super_admin") {
      if (perfil !== undefined) data.perfil = perfil;
      if (status !== undefined) data.status = status;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        status: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ─── Deletar usuário (somente super_admin) ────────────────────────────────────
usersRouter.delete(
  "/:id",
  autenticar,
  exigirPerfil("super_admin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      await prisma.user.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);
