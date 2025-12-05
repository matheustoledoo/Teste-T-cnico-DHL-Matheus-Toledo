
const express = require("express");
const cors = require("cors");
const path = require("path");

const repo = require("./operationsRepository");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos(Cors e Express)
app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, "..", "public")));

// Saúde da aplicação (útil em ambiente real)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Listar operações (com filtro opcional por status: ?status=Entregue)
app.get("/api/operations", (req, res) => {
  const { status } = req.query;
  const result = repo.filterByStatus(status);
  res.json(result);
});

// Criar nova operação
app.post("/api/operations", (req, res) => {
  const { client, origin, destination, code, status } = req.body;

  if (!client || !origin || !destination) {
    return res.status(400).json({
      message: "Campos obrigatórios: client, origin, destination."
    });
  }

  const created = repo.createOperation({ client, origin, destination, code, status });
  res.status(201).json(created);
});

// Atualizar status de uma operação
app.patch("/api/operations/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Campo 'status' é obrigatório." });
  }

  const updated = repo.updateStatus(id, status);

  if (!updated) {
    return res.status(404).json({ message: "Operação não encontrada." });
  }

  res.json(updated);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
