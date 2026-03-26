const { z } = require("zod");
const cityRepository = require("../repositories/city.repository");
const weatherService = require("./weather.service");
const { createError } = require("../middlewares/errorHandler");

const citySchema = z.object({
  cityName: z.string().min(1, "Nome da cidade é obrigatório."),
  country: z.string().min(2, "País é obrigatório."),
});

async function getCities(userId) {
  return cityRepository.findAllByUser(userId);
}

async function addCity(userId, data) {
  const { cityName, country } = citySchema.parse(data);

  // Valida se a cidade existe na OpenWeatherMap antes de salvar
  await weatherService.getCurrentWeather(cityName);

  try {
    return await cityRepository.create({ cityName, country, userId });
  } catch (err) {
    // Erro de unique constraint — cidade já salva pelo usuário
    if (err.code === "P2002") {
      throw createError("Cidade já está na sua lista.", 409);
    }
    throw err;
  }
}

async function removeCity(userId, cityId) {
  const city = await cityRepository.findById(cityId);

  if (!city) throw createError("Cidade não encontrada.", 404);
  if (city.userId !== userId) throw createError("Não autorizado.", 403);

  return cityRepository.remove(cityId);
}

async function getAllCitiesWeather(userId) {
  const cities = await cityRepository.findAllByUser(userId);

  // Busca o clima de todas as cidades em paralelo
  const weatherPromises = cities.map((city) =>
    weatherService.getCurrentWeather(city.cityName).then((weather) => ({
      id: city.id,
      ...weather,
    }))
  );

  return Promise.all(weatherPromises);
}

module.exports = { getCities, addCity, removeCity, getAllCitiesWeather };