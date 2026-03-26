const citiesService = require("../services/cities.service");

async function getCities(req, res, next) {
  try {
    const cities = await citiesService.getCities(req.user.id);
    return res.json({ cities });
  } catch (err) {
    next(err);
  }
}

async function addCity(req, res, next) {
  try {
    const city = await citiesService.addCity(req.user.id, req.body);
    return res.status(201).json({ city });
  } catch (err) {
    next(err);
  }
}

async function removeCity(req, res, next) {
  try {
    await citiesService.removeCity(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getAllCitiesWeather(req, res, next) {
  try {
    const data = await citiesService.getAllCitiesWeather(req.user.id);
    return res.json({ cities: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCities, addCity, removeCity, getAllCitiesWeather };