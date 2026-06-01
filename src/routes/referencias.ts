import { Router } from "express";
import { prisma } from "../lib/prisma";
import { autenticar, exigirPerfil } from "../middlewares/auth";

export const referenciasRouter = Router();

referenciasRouter.get("/", autenticar, async (req, res, next) => {
  try {
    const { algoritmoId } = req.query;

    const referencias = await prisma.referencia.findMany({
      where:
        typeof algoritmoId === "string" ? { algoritmoId } : undefined,
      orderBy: { criadoEm: "desc" },
      include: { algoritmo: true },
    });

    res.json(referencias);
  } catch (error) {
    next(error);
  }
});

referenciasRouter.get("/:id", autenticar, async (req, res, next) => {
  try {
    const referencia = await prisma.referencia.findUnique({
      where: { id: req.params.id },
      include: { algoritmo: true },
    });

    if (!referencia) {
      res.status(404).json({ message: "Referencia nao encontrada" });
      return;
    }

    res.json(referencia);
  } catch (error) {
    next(error);
  }
});

referenciasRouter.post("/", autenticar, exigirPerfil("admin"), async (req, res, next) => {
  try {
    const { titulo, autores, ano, tipoReferencia, link, algoritmoId } = req.body;

    if (!titulo || !algoritmoId) {
      res.status(400).json({ message: "titulo e algoritmoId sao obrigatorios" });
      return;
    }

    const referencia = await prisma.referencia.create({
      data: {
        titulo,
        autores,
        ano: ano ? Number(ano) : undefined,
        tipoReferencia,
        link,
        algoritmoId,
      },
      include: { algoritmo: true },
    });

    res.status(201).json(referencia);
  } catch (error) {
    next(error);
  }
});

referenciasRouter.put("/:id", autenticar, exigirPerfil("admin"), async (req, res, next) => {
  try {
    const { titulo, autores, ano, tipoReferencia, link, algoritmoId } = req.body;

    const referencia = await prisma.referencia.update({
      where: { id: req.params.id },
      data: {
        titulo,
        autores,
        ano: ano === undefined ? undefined : Number(ano),
        tipoReferencia,
        link,
        algoritmoId,
      },
      include: { algoritmo: true },
    });

    res.json(referencia);
  } catch (error) {
    next(error);
  }
});

referenciasRouter.delete("/:id", autenticar, exigirPerfil("admin"), async (req, res, next) => {
  try {
    await prisma.referencia.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
