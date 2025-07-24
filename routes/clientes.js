// routes/clientes.js
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

// Cria tabela automaticamente se não existir
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT,
      nome TEXT,
      sobrenome TEXT,
      whatsapp TEXT,
      vencimento TEXT,
      status TEXT
    );
  `);
})();

// 🔹 Listar clientes do usuário logado
router.get("/", verificarToken, async (req, res) => {
  const db = await dbPromise;
  const clientes = await db.all("SELECT * FROM clientes WHERE uid = ?", req.uid);
  res.json(clientes);
});

// 🔹 Criar cliente (com validação)
router.post("/", verificarToken, async (req, res) => {
  const { nome, sobrenome, whatsapp, vencimento, status } = req.body;

  if (!nome || !sobrenome || !/^\d+$/.test(whatsapp) || !vencimento || !status) {
    return res.status(400).json({ erro: "Preencha todos os campos corretamente." });
  }

  const db = await dbPromise;
  await db.run(
    `INSERT INTO clientes (uid, nome, sobrenome, whatsapp, vencimento, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.uid, nome, sobrenome, whatsapp, vencimento, status]
  );

  res.status(201).json({ msg: "Cliente criado com sucesso" });
});

// 🔹 Atualizar cliente (com validação)
router.put("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, whatsapp, vencimento, status } = req.body;

  if (!nome || !sobrenome || !/^\d+$/.test(whatsapp) || !vencimento || !status) {
    return res.status(400).json({ erro: "Preencha todos os campos corretamente." });
  }

  const db = await dbPromise;
  await db.run(
    `UPDATE clientes SET nome=?, sobrenome=?, whatsapp=?, vencimento=?, status=? WHERE id=? AND uid=?`,
    [nome, sobrenome, whatsapp, vencimento, status, id, req.uid]
  );

  res.json({ msg: "Cliente atualizado com sucesso" });
});

// 🔹 Excluir cliente
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const db = await dbPromise;
  await db.run(`DELETE FROM clientes WHERE id = ? AND uid = ?`, [id, req.uid]);
  res.json({ msg: "Cliente excluído com sucesso" });
});

export default router;
