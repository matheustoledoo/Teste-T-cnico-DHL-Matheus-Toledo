// src/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const repo = require("./operationsRepository");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (index.html, styles.css, etc.)
app.use(express.static(path.join(__dirname, "..", "public")));

// Endpoint de saúde (opcional, só pra teste)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Listar operações (com filtro opcional por status: ?status=Em%20trânsito)
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

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
