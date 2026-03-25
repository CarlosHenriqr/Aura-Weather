const prisma = require("../config/prisma");

async function findAllByUser(userId) {
  return prisma.savedCity.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

async function findById(id) {
  return prisma.savedCity.findUnique({ where: { id } });
}

async function create({ cityName, country, userId }) {
  return prisma.savedCity.create({
    data: { cityName, country, userId },
  });
}

async function remove(id) {
  return prisma.savedCity.delete({ where: { id } });
}

module.exports = { findAllByUser, findById, create, remove };