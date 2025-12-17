"use client"

import { useState, useEffect } from "react"
import { WeatherHeader } from "@/components/weather-header"
import { WeatherNavigation } from "@/components/weather-navigation"
import { CurrentWeatherCard } from "@/components/current-weather-card"
import { HourlyForecast } from "@/components/hourly-forecast"
import { DailyForecast } from "@/components/daily-forecast"
import { WeatherMaps } from "@/components/weather-maps"
import { AirQuality } from "@/components/air-quality"
import { WeatherAlerts } from "@/components/weather-alerts"
import { WeatherNews } from "@/components/weather-news"
import { WeatherDetails } from "@/components/weather-details"
import { HistoricalWeather } from "@/components/historical-weather"
import { SunMoonInfo } from "@/components/sun-moon-info"
import { WeatherRadar } from "@/components/weather-radar"
import { LocationManager } from "@/components/location-manager"
import { WeatherWidgets } from "@/components/weather-widgets"
import { DailyCharts } from "@/components/daily-charts"
import { NASAPowerDashboard } from "@/components/nasa-power-dashboard"
import { fetchWeatherData, fetchAirQuality, fetchWeatherAlerts, fetchWeatherNews } from "@/lib/weather-service"
import type { WeatherData, Location, AirQualityData, WeatherAlert, WeatherNews as WeatherNewsType, ForecastDay } from "@/lib/types"
import { vietnamProvinces } from "@/lib/constants"

export function WeatherApp() {
  const [activeTab, setActiveTab] = useState("current")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [news, setNews] = useState<WeatherNewsType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<Location>(vietnamProvinces[0])
  const [favoriteLocations, setFavoriteLocations] = useState<Location[]>([vietnamProvinces[0]])
  const [selectedDayForecast, setSelectedDayForecast] = useState<ForecastDay | undefined>(undefined);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true)
      try {
        const [weatherResult, airQualityResult, alertsResult, newsResult] = await Promise.all([
          fetchWeatherData(selectedLocation),
          fetchAirQuality(selectedLocation),
          fetchWeatherAlerts(selectedLocation),
          fetchWeatherNews(),
        ])

        setWeatherData(weatherResult)
        setAirQuality(airQualityResult)
        setAlerts(alertsResult)
        setNews(newsResult)
        if (weatherResult?.forecast && weatherResult.forecast.length > 0) {
            setSelectedDayForecast(weatherResult.forecast[0]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAllData()
  }, [selectedLocation])

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location)
  }

  const handleAddFavorite = (location: Location) => {
    if (!favoriteLocations.find((loc) => loc.id === location.id)) {
      setFavoriteLocations([...favoriteLocations, location])
    }
  }

  const handleRemoveFavorite = (locationId: string) => {
    setFavoriteLocations(favoriteLocations.filter((loc) => loc.id !== locationId))
  }

  const handleDaySelect = (day: ForecastDay) => {
      setSelectedDayForecast(day);
      setActiveTab('hourly');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "current":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CurrentWeatherCard weather={weatherData} location={selectedLocation} isLoading={isLoading} />
                <DailyForecast forecast={weatherData?.forecast} isLoading={isLoading} onDaySelect={handleDaySelect} />
              </div>
              <div className="space-y-6">
                <WeatherAlerts alerts={alerts} isLoading={isLoading} />
                <AirQuality data={airQuality} isLoading={isLoading} />
                <SunMoonInfo location={selectedLocation} isLoading={isLoading} />
                <WeatherWidgets weather={weatherData} isLoading={isLoading} />
              </div>
            </div>
          </div>
        )
      case "hourly":
        return <HourlyForecast forecast={selectedDayForecast} isLoading={isLoading} detailed={true} />
      case "daily":
        return <DailyForecast forecast={weatherData?.forecast} isLoading={isLoading} onDaySelect={handleDaySelect} />
      case "charts":
        return <DailyCharts weatherData={weatherData} isLoading={isLoading} />
      case "maps":
        return <WeatherMaps location={selectedLocation} isLoading={isLoading} />
      case "radar":
        return <WeatherRadar location={selectedLocation} isLoading={isLoading} />
      case "air-quality":
        return <AirQuality data={airQuality} isLoading={isLoading} detailed={true} />
      case "details":
        return <WeatherDetails details={weatherData?.details} location={selectedLocation} isLoading={isLoading} />
      case "historical":
        return <HistoricalWeather location={selectedLocation} isLoading={isLoading} />
      case "nasa-power":
        return <NASAPowerDashboard location={selectedLocation} isLoading={isLoading} />
      case "news":
        return <WeatherNews news={news} isLoading={isLoading} />
      case "locations":
        return (
          <LocationManager
            favoriteLocations={favoriteLocations}
            onLocationSelect={handleLocationChange}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      <WeatherHeader
        location={selectedLocation}
        onLocationChange={handleLocationChange}
        favoriteLocations={favoriteLocations}
        onAddFavorite={handleAddFavorite}
      />
      <WeatherNavigation activeTab={activeTab} onTabChange={setActiveTab} alertCount={alerts.length} />
      <div className="container mx-auto px-4 py-6">{renderContent()}</div>
    </div>
  )
}
