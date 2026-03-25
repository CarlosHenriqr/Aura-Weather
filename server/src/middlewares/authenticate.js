const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // O token vem no header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // disponibiliza o userId para os controllers
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = { authenticate };