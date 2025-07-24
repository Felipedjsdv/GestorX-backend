import express from "express";
import cors from "cors";
import clientesRoutes from "./routes/clientes.js";
import adminRoutes from "./routes/admin.js";
import comprovantesRoutes from "./routes/comprovantes.js";
import usuariosRoutes from "./routes/usuarios.js";
import { initializeApp, cert } from "firebase-admin/app";
import * as dotenv from "dotenv";
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };
import fs from "fs";

dotenv.config();

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/clientes", clientesRoutes);
app.use("/admin", adminRoutes);
app.use("/comprovantes", comprovantesRoutes);
app.use("/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
  res.send("API GestorX está ativa!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
