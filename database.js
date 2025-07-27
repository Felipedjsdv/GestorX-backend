import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./usuarios.db",
  driver: sqlite3.Database
});

async function init() {
  const db = await dbPromise;
  await db.exec(\`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      sobrenome TEXT,
      whatsapp TEXT,
      email TEXT
    );
  \`);
}

async function listarUsuarios() {
  const db = await dbPromise;
  return db.all("SELECT * FROM usuarios");
}

export { init, listarUsuarios };
