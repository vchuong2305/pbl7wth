"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { Location } from "@/lib/types"

interface HistoricalWeatherProps {
  location: Location
  isLoading: boolean
}

export function HistoricalWeather({ location, isLoading }: HistoricalWeatherProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewType, setViewType] = useState<"daily" | "monthly" | "yearly">("daily")

  // Mock historical data
  const historicalData = {
    temperature: {
      current: 28,
      average: 26,
      record: { high: 35, low: 18 },
      trend: "up",
    },
    precipitation: {
      current: 2.5,
      average: 3.2,
      record: { high: 15.8, low: 0 },
      trend: "down",
    },
    humidity: {
      current: 75,
      average: 72,
      record: { high: 95, low: 45 },
      trend: "up",
    },
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dữ liệu lịch sử</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dữ liệu lịch sử - {location.name}</h2>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-1">
            {["daily", "monthly", "yearly"].map((type) => (
              <Button
                key={type}
                variant={viewType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType(type as any)}
              >
                {type === "daily" && "Ngày"}
                {type === "monthly" && "Tháng"}
                {type === "yearly" && "Năm"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(historicalData).map(([key, data]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {key === "temperature" && "Nhiệt độ"}
                  {key === "precipitation" && "Lượng mưa"}
                  {key === "humidity" && "Độ ẩm"}
                </span>
                {data.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {data.current}
                  {key === "temperature" && "°C"}
                  {key === "precipitation" && "mm"}
                  {key === "humidity" && "%"}
                </div>
                <div className="text-sm text-muted-foreground">Hôm nay</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Trung bình:</span>
                  <span>
                    {data.average}
                    {key === "temperature" && "°C"}
                    {key === "precipitation" && "mm"}
                    {key === "humidity" && "%"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cao nhất:</span>
                  <span className="text-red-500">
                    {data.record.high}
                    {key === "temperature" && "°C"}
                    {key === "precipitation" && "mm"}
                    {key === "humidity" && "%"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thấp nhất:</span>
                  <span className="text-blue-500">
                    {data.record.low}
                    {key === "temperature" && "°C"}
                    {key === "precipitation" && "mm"}
                    {key === "humidity" && "%"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ lịch sử 30 ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Biểu đồ dữ liệu lịch sử sẽ hiển thị ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
