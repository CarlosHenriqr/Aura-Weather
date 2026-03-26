const { Router } = require("express");
const citiesController = require("../controllers/cities.controller");
const { authenticate } = require("../middlewares/authenticate");

const router = Router();

// Todas as rotas de cidades exigem login
router.use(authenticate);

router.get("/", citiesController.getCities);
router.post("/", citiesController.addCity);
router.delete("/:id", citiesController.removeCity);
router.get("/weather-all", citiesController.getAllCitiesWeather);

module.exports = router;