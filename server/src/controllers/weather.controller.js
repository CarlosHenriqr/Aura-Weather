const weatherService = require("../services/weather.service");
const { createError } = require("../middlewares/errorHandler");

async function getCurrentWeather(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) throw createError("Parâmetro 'city' é obrigatório.", 400);

    const data = await weatherService.getCurrentWeather(city);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getForecast(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) throw createError("Parâmetro 'city' é obrigatório.", 400);

    const data = await weatherService.getForecast(city);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getHourlyData(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) throw createError("Parâmetro 'city' é obrigatório.", 400);

    const data = await weatherService.getHourlyData(city);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getDetails(req, res, next) {
  try {
    const { city } = req.query;
    if (!city) throw createError("Parâmetro 'city' é obrigatório.", 400);

    const data = await weatherService.getDetails(city);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrentWeather, getForecast, getHourlyData, getDetails };