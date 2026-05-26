import express from "express";
import cors from "cors";
import "dotenv/config";
import { algoritmosRouter } from "./routes/algoritmos";
import { tiposProblemaRouter } from "./routes/tipos-problema";
import { referenciasRouter } from "./routes/referencias";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Quantum Algorithm Library API rodando" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/algoritmos", algoritmosRouter);
app.use("/tipos-problema", tiposProblemaRouter);
app.use("/referencias", referenciasRouter);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  },
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
