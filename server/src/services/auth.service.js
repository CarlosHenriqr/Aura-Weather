const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const userRepository = require("../repositories/user.repository");
const { createError } = require("../middlewares/errorHandler");
const sanitizeHtml = require("sanitize-html");

// Sanitização básica
function sanitize(value) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}

// =========================
// Schemas
// =========================
const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

// =========================
// TOKENS
// =========================
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

// =========================
// REGISTER
// =========================
async function register(data) {
  const clean = {
    name: sanitize(data.name),
    email: sanitize(data.email),
    password: data.password,
  };

  const { name, email, password } = registerSchema.parse(clean);

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw createError("E-mail já cadastrado.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
}

// =========================
// LOGIN
// =========================
async function login(data) {
  const clean = {
    email: sanitize(data.email),
    password: data.password,
  };

  const { email, password } = loginSchema.parse(clean);

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw createError("E-mail ou senha incorretos.", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createError("E-mail ou senha incorretos.", 401);
  }

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user: userWithoutPassword, accessToken, refreshToken };
}

// =========================
// GET ME
// =========================
async function getMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw createError("Usuário não encontrado.", 404);

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// =========================
// REFRESH TOKEN
// =========================
async function refreshToken(token) {
  if (!token) {
    throw createError("Refresh token não fornecido.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    return { accessToken: newAccessToken };
  } catch (err) {
    throw createError("Refresh token inválido ou expirado.", 403);
  }
}

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
};