import { Router } from "express";
import { prisma } from "../lib/prisma";
import { isObjectId, toStringArray } from "../lib/request";

export const algoritmosRouter = Router();

algoritmosRouter.get("/", async (req, res, next) => {
  try {
    const { busca, status, tipoProblemaId } = req.query;

    const algoritmos = await prisma.algoritmo.findMany({
      where: {
        ...(typeof status === "string" ? { statusPublicacao: status } : {}),
        ...(typeof tipoProblemaId === "string"
          ? { idTipoProblema: tipoProblemaId }
          : {}),
        ...(typeof busca === "string" && busca.trim()
          ? {
              OR: [
                { nome: { contains: busca, mode: "insensitive" } },
                { slug: { contains: busca, mode: "insensitive" } },
                { descricaoCurta: { contains: busca, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { nome: "asc" },
      include: {
        tipoProblema: true,
        referencias: true,
      },
    });

    res.json(algoritmos);
  } catch (error) {
    next(error);
  }
});

algoritmosRouter.get("/:idOuSlug", async (req, res, next) => {
  try {
    const { idOuSlug } = req.params;

    const algoritmo = await prisma.algoritmo.findFirst({
      where: isObjectId(idOuSlug) ? { id: idOuSlug } : { slug: idOuSlug },
      include: {
        tipoProblema: true,
        referencias: true,
      },
    });

    if (!algoritmo) {
      res.status(404).json({ message: "Algoritmo nao encontrado" });
      return;
    }

    res.json(algoritmo);
  } catch (error) {
    next(error);
  }
});

algoritmosRouter.post("/", async (req, res, next) => {
  try {
    const {
      nome,
      slug,
      categoria,
      descricaoCurta,
      descricaoCompleta,
      complexidade,
      speedup,
      implementacoes,
      nivelDificuldade,
      maturidade,
      statusPublicacao,
      aplicacoes,
      caracteristicas,
      vantagens,
      limitacoes,
      tags,
      linkOrigem,
      idTipoProblema,
    } = req.body;

    if (!nome || !slug || !descricaoCurta) {
      res.status(400).json({
        message: "nome, slug e descricaoCurta sao obrigatorios",
      });
      return;
    }

    const algoritmo = await prisma.algoritmo.create({
      data: {
        nome,
        slug,
        categoria,
        descricaoCurta,
        descricaoCompleta,
        complexidade,
        speedup,
        implementacoes: toStringArray(implementacoes),
        nivelDificuldade,
        maturidade,
        statusPublicacao,
        aplicacoes: toStringArray(aplicacoes),
        caracteristicas: toStringArray(caracteristicas),
        vantagens: toStringArray(vantagens),
        limitacoes: toStringArray(limitacoes),
        tags: toStringArray(tags),
        linkOrigem,
        idTipoProblema,
      },
      include: {
        tipoProblema: true,
        referencias: true,
      },
    });

    res.status(201).json(algoritmo);
  } catch (error) {
    next(error);
  }
});

algoritmosRouter.put("/:id", async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      ...(req.body.implementacoes
        ? { implementacoes: toStringArray(req.body.implementacoes) }
        : {}),
      ...(req.body.aplicacoes
        ? { aplicacoes: toStringArray(req.body.aplicacoes) }
        : {}),
      ...(req.body.caracteristicas
        ? { caracteristicas: toStringArray(req.body.caracteristicas) }
        : {}),
      ...(req.body.vantagens
        ? { vantagens: toStringArray(req.body.vantagens) }
        : {}),
      ...(req.body.limitacoes
        ? { limitacoes: toStringArray(req.body.limitacoes) }
        : {}),
      ...(req.body.tags ? { tags: toStringArray(req.body.tags) } : {}),
    };

    const algoritmo = await prisma.algoritmo.update({
      where: { id: req.params.id },
      data,
      include: {
        tipoProblema: true,
        referencias: true,
      },
    });

    res.json(algoritmo);
  } catch (error) {
    next(error);
  }
});

algoritmosRouter.delete("/:id", async (req, res, next) => {
  try {
    const algoritmo = await prisma.algoritmo.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { slug: req.params.id },
        ],
      },
    });

    if (!algoritmo) {
      res.status(404).json({ message: "Algoritmo nao encontrado" });
      return;
    }

    await prisma.referencia.deleteMany({
      where: { algoritmoId: algoritmo.id },
    });

    await prisma.algoritmo.delete({
      where: { id: algoritmo.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
