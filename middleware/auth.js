// middleware/auth.js
import { getAuth } from "firebase-admin/auth";

export async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).json({ erro: "Token inválido" });
  }
}
