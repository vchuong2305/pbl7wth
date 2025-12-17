"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Layers } from "lucide-react"
import type { Location } from "@/lib/types"

interface WeatherRadarProps {
  location: Location
  isLoading: boolean
}

export function WeatherRadar({ location, isLoading }: WeatherRadarProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeIndex, setTimeIndex] = useState([0])
  const [radarType, setRadarType] = useState("precipitation")

  const radarTypes = [
    { id: "precipitation", label: "Lượng mưa", color: "from-green-400 to-blue-600" },
    { id: "temperature", label: "Nhiệt độ", color: "from-blue-400 to-red-600" },
    { id: "wind", label: "Gió", color: "from-gray-400 to-gray-700" },
  ]

  const timeLabels = ["2 giờ trước", "1 giờ trước", "Hiện tại", "1 giờ tới", "2 giờ tới"]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Radar thời tiết</h2>
        <Card>
          <CardContent className="p-6">
            <div className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Radar thời tiết</h2>
        <div className="flex items-center space-x-2">
          {radarTypes.map((type) => (
            <Button
              key={type.id}
              variant={radarType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setRadarType(type.id)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Radar {radarTypes.find((t) => t.id === radarType)?.label}</span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Radar Display */}
            <div className="relative h-[500px] bg-slate-900 rounded-lg overflow-hidden">
              {/* Base map */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />

              {/* Radar overlay */}
              <div
                className={`absolute inset-0 bg-gradient-radial ${radarTypes.find((t) => t.id === radarType)?.color} opacity-60`}
                style={{
                  background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(59, 130, 246, 0.3) 40%, rgba(34, 197, 94, 0.5) 60%, rgba(239, 68, 68, 0.7) 80%)`,
                }}
              />

              {/* Location marker */}
              <div
                className="absolute w-3 h-3 bg-red-500 rounded-full border border-white transform -translate-x-1.5 -translate-y-1.5"
                style={{ left: "50%", top: "50%" }}
              />

              {/* Range circles */}
              {[100, 200, 300].map((radius, i) => (
                <div
                  key={i}
                  className="absolute border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: `${radius}px`,
                    height: `${radius}px`,
                  }}
                />
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                <div className="text-sm font-medium mb-2">{radarTypes.find((t) => t.id === radarType)?.label}</div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded" />
                  <span className="text-xs">Nhẹ</span>
                  <div className="w-4 h-4 bg-yellow-400 rounded" />
                  <span className="text-xs">Vừa</span>
                  <div className="w-4 h-4 bg-red-400 rounded" />
                  <span className="text-xs">Mạnh</span>
                </div>
              </div>

              {/* Time indicator */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
                {timeLabels[timeIndex[0]]}
              </div>
            </div>

            {/* Time slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Thời gian</span>
                <span>{timeLabels[timeIndex[0]]}</span>
              </div>
              <Slider
                value={timeIndex}
                onValueChange={setTimeIndex}
                max={timeLabels.length - 1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2h trước</span>
                <span>Hiện tại</span>
                <span>2h tới</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
