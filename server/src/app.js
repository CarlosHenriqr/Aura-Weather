require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const weatherRoutes = require("./routes/weather.routes");
const citiesRoutes = require("./routes/cities.routes");
const alertsRoutes = require("./routes/alerts.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Segurança — adiciona headers HTTP de proteção
app.use(helmet());

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rate limit para rotas de autenticação — máximo 10 tentativas a cada 15 minutos por IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Muitas tentativas. Tente novamente em 15 minutos." },
});

// Rate limit geral — 100 requisições por minuto por IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições. Tente novamente em instantes." },
});

// Rotas
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/weather", generalLimiter, weatherRoutes);
app.use("/api/cities", generalLimiter, citiesRoutes);
app.use("/api/alerts", generalLimiter, alertsRoutes);

// Rota de health check — útil para saber se o servidor está no ar
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Aura Weather API running!" });
});

// Middleware de erro — deve ser o último sempre
app.use(errorHandler);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});