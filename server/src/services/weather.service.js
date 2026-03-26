const axios = require("axios");
const { createError } = require("../middlewares/errorHandler");

const BASE_URL = process.env.OPENWEATHER_BASE_URL;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Parâmetros padrão
const defaultParams = {
  appid: API_KEY,
  units: "metric",
  lang: "pt_br",
};

// =========================
// CORE REQUEST
// =========================
async function fetchFromOpenWeather(endpoint, params) {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      timeout: 5000,
      params: { ...defaultParams, ...params },
    });

    return response.data;
  } catch (err) {
    console.error("===== ERRO OPENWEATHER =====");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Mensagem:", err.message);
    }

    if (err.response?.status === 404) {
      throw createError("Cidade não encontrada.", 404);
    }

    if (err.response?.status === 401) {
      throw createError("API Key inválida ou não autorizada.", 401);
    }

    throw createError("Erro ao buscar dados do clima.", 502);
  }
}

// =========================
// CURRENT WEATHER
// =========================
async function getCurrentWeather(city) {
  const data = await fetchFromOpenWeather("weather", { q: city });

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    uvIndex: null,
  };
}

// =========================
// FORECAST (5 DIAS)
// =========================
async function getForecast(city) {
  const data = await fetchFromOpenWeather("forecast", { q: city, cnt: 40 });

  const dailyMap = {};

  data.list.forEach((item) => {
    const [date, hour] = item.dt_txt.split(" ");

    if (!dailyMap[date] && hour === "12:00:00") {
      dailyMap[date] = {
        date,
        tempMax: Math.round(item.main.temp_max),
        tempMin: Math.round(item.main.temp_min),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
      };
    }
  });

  return Object.values(dailyMap).slice(0, 5);
}

// =========================
// HOURLY (24H)
// =========================
async function getHourlyData(city) {
  const data = await fetchFromOpenWeather("forecast", { q: city, cnt: 8 });

  return data.list.map((item) => ({
    time: item.dt_txt,
    temperature: Math.round(item.main.temp),
    humidity: item.main.humidity,
    precipitation: item.pop ? Math.round(item.pop * 100) : 0,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
  }));
}

// =========================
// DETAILS
// =========================
async function getDetails(city) {
  const data = await fetchFromOpenWeather("weather", { q: city });

  return {
    city: data.name,
    country: data.sys.country,
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
    pressure: data.main.pressure,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    cloudiness: data.clouds.all,
  };
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getHourlyData,
  getDetails,
};