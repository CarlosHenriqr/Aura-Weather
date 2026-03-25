const { PrismaClient } = require("@prisma/client");

// Garante que só existe uma instância do Prisma rodando
const prisma = new PrismaClient();

module.exports = prisma;