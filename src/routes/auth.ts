import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ message: "email e senha são obrigatórios" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "Email ou senha inválidos" });
      return;
    }

    const senhaValida = await bcrypt.compare(senha, user.senhaHash);

    if (!senhaValida) {
      res.status(400).json({ message: "Email ou senha inválidos" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, perfil: user.perfil },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
});
