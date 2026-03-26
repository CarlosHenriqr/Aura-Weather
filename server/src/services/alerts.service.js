const weatherService = require("./weather.service");

// A OpenWeatherMap gratuita não tem alertas nativos,
// então geramos alertas inteligentes a partir dos dados do clima
async function getAlerts(city) {
  const [current, forecast] = await Promise.all([
    weatherService.getCurrentWeather(city),
    weatherService.getForecast(city),
  ]);

  const alerts = [];

  // Alerta de calor extremo
  if (current.temperature >= 35) {
    alerts.push({
      type: "heat",
      severity: "severe",
      title: "Calor Extremo",
      message: `Temperatura de ${current.temperature}°C. Evite exposição ao sol entre 11h e 16h. Hidrate-se bem.`,
    });
  }

  // Alerta de frio
  if (current.temperature <= 5) {
    alerts.push({
      type: "cold",
      severity: "moderate",
      title: "Temperatura Baixa",
      message: `Temperatura de ${current.temperature}°C. Agasalhe-se bem ao sair.`,
    });
  }

  // Alerta de umidade alta
  if (current.humidity >= 85) {
    alerts.push({
      type: "humidity",
      severity: "low",
      title: "Umidade Alta",
      message: `Umidade relativa em ${current.humidity}%. Pode causar desconforto e sensação de abafamento.`,
    });
  }

  // Alerta de chuva nos próximos dias
  const rainyDay = forecast.find((day) =>
    day.description.includes("chuva")
  );
  if (rainyDay) {
    alerts.push({
      type: "rain",
      severity: "low",
      title: "Chuva Prevista",
      message: `Chuva esperada para ${rainyDay.date}. Leve um guarda-chuva!`,
    });
  }

  return {
    city,
    alerts,
    hasAlerts: alerts.length > 0,
  };
}

module.exports = { getAlerts };