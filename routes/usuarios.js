import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const router = express.Router();

const dbPromise = open({
  filename: "./db/database.sqlite",
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      uid TEXT PRIMARY KEY,
      nome TEXT,
      sobrenome TEXT,
      whatsapp TEXT,
      email TEXT,
      role TEXT DEFAULT 'user'
    );
  `);
})();

router.post("/", async (req, res) => {
  const { uid, nome, sobrenome, whatsapp, email, role } = req.body;

  if (!uid || !nome || !sobrenome || !whatsapp || !email) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  try {
    const db = await dbPromise;
    await db.run(
      "INSERT INTO usuarios (uid, nome, sobrenome, whatsapp, email, role) VALUES (?, ?, ?, ?, ?, ?)",
      [uid, nome, sobrenome, whatsapp, email, role || "user"]
    );
    res.json({ msg: "Usuário salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar usuário:", err);
    res.status(500).json({ erro: "Erro interno ao salvar usuário" });
  }
});

export default router;
