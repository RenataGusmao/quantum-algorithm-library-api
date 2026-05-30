import { Router } from "express";
import { prisma } from "../lib/prisma";

export const tiposProblemaRouter = Router();

tiposProblemaRouter.get("/", async (_req, res, next) => {
  try {
    const tipos = await prisma.tipoProblema.findMany({
      orderBy: { nome: "asc" },
      include: { algoritmos: true },
    });

    res.json(tipos);
  } catch (error) {
    next(error);
  }
});

tiposProblemaRouter.get("/:id", async (req, res, next) => {
  try {
    const tipo = await prisma.tipoProblema.findUnique({
      where: { id: req.params.id },
      include: { algoritmos: true },
    });

    if (!tipo) {
      res.status(404).json({ message: "Tipo de problema nao encontrado" });
      return;
    }

    res.json(tipo);
  } catch (error) {
    next(error);
  }
});

tiposProblemaRouter.post("/", async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      res.status(400).json({ message: "O campo nome e obrigatorio" });
      return;
    }

    const tipo = await prisma.tipoProblema.create({
      data: { nome, descricao },
    });

    res.status(201).json(tipo);
  } catch (error) {
    next(error);
  }
});

tiposProblemaRouter.put("/:id", async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;

    const tipo = await prisma.tipoProblema.update({
      where: { id: req.params.id },
      data: { nome, descricao },
    });

    res.json(tipo);
  } catch (error) {
    next(error);
  }
});

tiposProblemaRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.tipoProblema.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
