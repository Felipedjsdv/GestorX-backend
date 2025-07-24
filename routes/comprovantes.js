// routes/comprovantes.js
import express from "express";
import multer from "multer";
import path from "path";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|pdf/;
    const isValid = types.test(path.extname(file.originalname).toLowerCase());
    cb(null, isValid);
  },
});

// 🔹 Upload de comprovante
router.post("/", verificarToken, upload.single("comprovante"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: "Arquivo inválido" });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ msg: "Upload realizado", url });
});

export default router;
