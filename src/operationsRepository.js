
// Simula uma base de dados em memória
let operations = [
  {
    id: 1,
    code: "OP-2025-0001",
    client: "Cliente Alfa",
    origin: "Campinas/SP",
    destination: "Jundiaí/SP",
    status: "Em trânsito",
    lastUpdate: new Date().toISOString()
  },
  {
    id: 2,
    code: "OP-2025-0002",
    client: "Cliente Beta",
    origin: "São Paulo/SP",
    destination: "Cubatão/SP",
    status: "Pendente coleta",
    lastUpdate: new Date().toISOString()
  },
  {
    id: 3,
    code: "OP-2025-0003",
    client: "Cliente Gama",
    origin: "Guarulhos/SP",
    destination: "Curitiba/PR",
    status: "Entregue",
    lastUpdate: new Date().toISOString()
  }
];

function listAll() {
  return operations;
}

function filterByStatus(status) {
  if (!status) return operations;
  return operations.filter(op => op.status.toLowerCase() === status.toLowerCase());
}

function findById(id) {
  return operations.find(op => op.id === id);
}

function updateStatus(id, newStatus) {
  const op = findById(id);
  if (!op) return null;

  op.status = newStatus;
  op.lastUpdate = new Date().toISOString();
  return op;
}

function createOperation(data) {
  const nextId = operations.length ? Math.max(...operations.map(o => o.id)) + 1 : 1;

  const newOperation = {
    id: nextId,
    code: data.code || `OP-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`,
    client: data.client,
    origin: data.origin,
    destination: data.destination,
    status: data.status || "Pendente coleta",
    lastUpdate: new Date().toISOString()
  };

  operations.push(newOperation);
  return newOperation;
}

module.exports = {
  listAll,
  filterByStatus,
  findById,
  updateStatus,
  createOperation
};
