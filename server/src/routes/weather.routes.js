const { Router } = require("express");
const weatherController = require("../controllers/weather.controller");

const router = Router();

// Sem authenticate aqui — rotas públicas
router.get("/current", weatherController.getCurrentWeather);
router.get("/forecast", weatherController.getForecast);
router.get("/hourly", weatherController.getHourlyData);
router.get("/details", weatherController.getDetails);

module.exports = router;
