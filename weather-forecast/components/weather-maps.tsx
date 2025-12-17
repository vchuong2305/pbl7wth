"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Layers, Satellite, CloudRain, Thermometer, Wind, Zap } from "lucide-react"
import type { Location } from "@/lib/types"

interface WeatherMapsProps {
  location: Location
  isLoading: boolean
}

export function WeatherMaps({ location, isLoading }: WeatherMapsProps) {
  const [activeLayer, setActiveLayer] = useState("temperature")

  const mapLayers = [
    { id: "temperature", label: "Nhiệt độ", icon: Thermometer, color: "from-blue-500 to-red-500" },
    { id: "precipitation", label: "Lượng mưa", icon: CloudRain, color: "from-green-500 to-blue-500" },
    { id: "wind", label: "Gió", icon: Wind, color: "from-gray-300 to-gray-600" },
    { id: "pressure", label: "Áp suất", icon: Layers, color: "from-purple-500 to-pink-500" },
    { id: "satellite", label: "Vệ tinh", icon: Satellite, color: "from-gray-800 to-gray-400" },
    { id: "lightning", label: "Sét", icon: Zap, color: "from-yellow-400 to-orange-500" },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bản đồ thời tiết</h2>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-sky-500" />
          <span className="text-sm text-muted-foreground">{location.name}</span>
        </div>
      </div>

      <Tabs value={activeLayer} onValueChange={setActiveLayer}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {mapLayers.map((layer) => {
            const Icon = layer.icon
            return (
              <TabsTrigger key={layer.id} value={layer.id} className="flex items-center space-x-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{layer.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {mapLayers.map((layer) => (
          <TabsContent key={layer.id} value={layer.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <layer.icon className="h-5 w-5" />
                  <span>Bản đồ {layer.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
                  {/* Map visualization */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${layer.color} opacity-30`} />

                  {/* Location marker */}
                  <div
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                  />

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">{layer.label}</div>
                    <div className={`h-4 w-32 bg-gradient-to-r ${layer.color} rounded`} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Thấp</span>
                      <span>Cao</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button size="sm" variant="secondary">
                      <Layers className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      +
                    </Button>
                    <Button size="sm" variant="secondary">
                      -
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
