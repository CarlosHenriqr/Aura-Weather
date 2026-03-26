const alertsService = require("../services/alerts.service");
const { createError } = require("../middlewares/errorHandler");

async function getAlerts(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) throw createError("Parâmetro 'city' é obrigatório.", 400);

    const data = await alertsService.getAlerts(city);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAlerts };