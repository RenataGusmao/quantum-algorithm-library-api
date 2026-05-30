import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { autenticar, exigirPerfil } from "../middlewares/auth";

export const usersRouter = Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ message: "nome, email e senha são obrigatórios" });
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

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil,
      },
    });

    const { senhaHash: _, ...userSemSenha } = user;

    res.status(201).json(userSemSenha);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", autenticar, exigirPerfil("admin"), async (_req, res, next) => {
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
});

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

usersRouter.put("/:id", autenticar, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email, perfil, status, senha } = req.body;

    const data: Record<string, unknown> = {};
    if (nome !== undefined) data.nome = nome;
    if (email !== undefined) data.email = email;
    if (perfil !== undefined) data.perfil = perfil;
    if (status !== undefined) data.status = status;
    if (senha !== undefined) data.senhaHash = await bcrypt.hash(senha, 10);

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

usersRouter.delete("/:id", autenticar, exigirPerfil("admin"), async (req, res, next) => {
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
});
