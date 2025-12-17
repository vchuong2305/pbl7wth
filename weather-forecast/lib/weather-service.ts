import type { WeatherData, Location, AirQualityData, WeatherAlert, WeatherNews, HourlyForecast, ForecastDay } from "./types"

// Enhanced weather service with all features
export async function fetchWeatherData(location: Location): Promise<WeatherData> {
  try {
    const response = await fetch(`http://localhost:8000/api/weather/forecast/${encodeURIComponent(location.name)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    // Get current weather from the first hour of the first day
    const currentHour = data.forecast[0].hourly[0];
    const currentWeather = {
      temperature: currentHour.temperature,
      condition: determineWeatherCondition(currentHour),
      icon: getIconForCondition(determineWeatherCondition(currentHour)),
      timestamp: currentHour.datetime,
    };

    // Calculate feels like temperature using humidity and wind speed
    const feelsLike = calculateFeelsLike(currentHour.temperature, currentHour.humidity, currentHour.wind_speed);

    // Transform the API response to match our WeatherData type
    return {
      location: {
        name: data.location.name,
        latitude: data.location.latitude,
        longitude: data.location.longitude
      },
      current: currentWeather,
      details: {
        humidity: currentHour.humidity,
        windSpeed: currentHour.wind_speed,
        windDirection: 0, // Not provided by API
        pressure: currentHour.pressure,
        feelsLike: feelsLike,
        uvIndex: 0, // Not provided by API
        visibility: 10, // Default value
        precipitation: currentHour.precipitation
      },
      forecast: data.forecast.map((day: any) => ({
        date: day.date,
        hourly: day.hourly.map((hour: any) => ({
          datetime: hour.datetime,
          hour: hour.hour,
          temperature: hour.temperature,
          condition: determineWeatherCondition(hour),
          precipitation: hour.precipitation,
          wind_speed: hour.wind_speed,
          humidity: hour.humidity,
          pressure: hour.pressure,
          description: hour.description,
          icon: getIconForCondition(determineWeatherCondition(hour)),
          source: hour.source
        }))
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

function calculateFeelsLike(temperature: number, humidity: number, windSpeed: number): number {
  // Heat index calculation for high temperatures
  if (temperature >= 27) {
    const heatIndex = temperature + 0.348 * humidity - 0.7 * windSpeed + 0.7 * (humidity / 100) * temperature - 0.002 * temperature * temperature;
    return Math.round(heatIndex * 10) / 10;
  }
  // Wind chill calculation for low temperatures
  else if (temperature <= 10) {
    const windChill = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16);
    return Math.round(windChill * 10) / 10;
  }
  // For moderate temperatures, use a simple adjustment
  else {
    return temperature;
  }
}

function determineWeatherCondition(hour: any): string {
  // Determine weather condition based on precipitation and other factors
  if (hour.precipitation > 0.5) {
    return "rain";
  } else if (hour.precipitation > 0.1) {
    return "partly cloudy";
  } else if (hour.humidity > 80) {
    return "cloudy";
  } else {
    return "clear";
  }
}

function getIconForCondition(condition: string): string {
  switch (condition) {
    case "clear":
      return "sun";
    case "partly cloudy":
      return "cloud-sun";
    case "cloudy":
      return "cloud";
    case "rain":
      return "cloud-rain";
    case "snow":
      return "cloud-snow";
    default:
      return "sun";
  }
}

export async function fetchAirQuality(location: Location): Promise<AirQualityData> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const aqi = Math.round(30 + Math.random() * 120)

  return {
    aqi,
    pm25: Math.round(10 + Math.random() * 40),
    pm10: Math.round(20 + Math.random() * 60),
    o3: Math.round(50 + Math.random() * 100),
    no2: Math.round(20 + Math.random() * 80),
    so2: Math.round(5 + Math.random() * 30),
    co: Math.round(0.5 + Math.random() * 2),
    category: aqi <= 50 ? "good" : aqi <= 100 ? "moderate" : aqi <= 150 ? "unhealthy_sensitive" : "unhealthy",
    healthAdvice: aqi <= 50 ? "Chất lượng không khí tốt" : "Nên hạn chế hoạt động ngoài trời",
  }
}

export async function fetchWeatherAlerts(location: Location): Promise<WeatherAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const alerts: WeatherAlert[] = []

  if (Math.random() > 0.7) {
    alerts.push({
      id: "alert-1",
      title: "Cảnh báo mưa lớn",
      description: "Dự báo có mưa lớn đến rất lớn trong 6-12 giờ tới. Người dân cần đề phòng ngập úng.",
      severity: "moderate",
      type: "rain",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      areas: [location.name],
    })
  }

  if (Math.random() > 0.8) {
    alerts.push({
      id: "alert-2",
      title: "Cảnh báo gió mạnh",
      description: "Gió mạnh cấp 6-7, giật cấp 8-9. Cần chú ý an toàn khi di chuyển.",
      severity: "minor",
      type: "wind",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      areas: [location.name],
    })
  }

  return alerts
}

export async function fetchWeatherNews(): Promise<WeatherNews[]> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return [
    {
      id: "news-1",
      title: "Bão số 4 đang tiến vào Biển Đông, dự báo ảnh hưởng đến miền Trung",
      summary:
        "Cơn bão mới hình thành trên Biển Đông với sức gió mạnh cấp 8-9, dự báo sẽ ảnh hưởng đến các tỉnh miền Trung trong tuần tới.",
      content: "Nội dung chi tiết về cơn bão...",
      image: "/placeholder.svg?height=200&width=300",
      category: "Cảnh báo",
      publishedAt: new Date().toISOString(),
      source: "Trung tâm Dự báo Khí tượng",
      url: "#",
    },
    {
      id: "news-2",
      title: "Thời tiết miền Bắc chuyển lạnh, nhiệt độ giảm 5-7 độ C",
      summary: "Không khí lạnh tăng cường khiến nhiệt độ miền Bắc giảm mạnh, có nơi dưới 15 độ C.",
      content: "Chi tiết về đợt lạnh...",
      image: "/placeholder.svg?height=200&width=300",
      category: "Dự báo",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: "VTV",
      url: "#",
    },
    {
      id: "news-3",
      title: "Hạn hán kéo dài ở miền Nam, cần tiết kiệm nước",
      summary: "Tình trạng hạn hán kéo dài tại các tỉnh miền Nam, người dân cần sử dụng nước tiết kiệm.",
      content: "Thông tin về tình hình hạn hán...",
      image: "/placeholder.svg?height=200&width=300",
      category: "Môi trường",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: "Báo Tuổi Trẻ",
      url: "#",
    },
  ]
}
