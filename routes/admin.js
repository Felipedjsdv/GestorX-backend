// routes/admin.js
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// Banco de dados
const dbPromise = open({
  filename: "./db/database.sqlite",
  driver: sqlite3.Database,
});

// 🔐 Lista de administradores autorizados
const UIDS_ADMINS = [
  "uid_admin_1",
  "uid_admin_2"
];

// 🔹 Listar todos os clientes do sistema (apenas admin)
router.get("/clientes", verificarToken, async (req, res) => {
  if (!UIDS_ADMINS.includes(req.uid)) {
    return res.status(403).json({ erro: "Acesso negado: usuário sem permissão de administrador." });
  }

  try {
    const db = await dbPromise;
    const clientes = await db.all("SELECT * FROM clientes");
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ erro: "Erro interno ao buscar clientes." });
  }
});

export default router;
