"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Location, WeatherData } from "@/lib/types"

interface WeatherMapProps {
  location: Location
  weatherData: WeatherData | null
  isLoading: boolean
}

export function WeatherMap({ location, weatherData, isLoading }: WeatherMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isLoading || !weatherData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a simple map visualization
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2)

    // Set gradient colors based on weather condition
    const condition = weatherData.current?.condition?.toLowerCase() || "clear"

    if (condition.includes("rain") || condition.includes("shower")) {
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)") // blue-500
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.8)")
    } else if (condition.includes("cloud")) {
      gradient.addColorStop(0, "rgba(148, 163, 184, 0.2)") // slate-400
      gradient.addColorStop(1, "rgba(148, 163, 184, 0.8)")
    } else if (condition.includes("snow")) {
      gradient.addColorStop(0, "rgba(203, 213, 225, 0.2)") // slate-300
      gradient.addColorStop(1, "rgba(203, 213, 225, 0.8)")
    } else {
      gradient.addColorStop(0, "rgba(251, 191, 36, 0.2)") // amber-400
      gradient.addColorStop(1, "rgba(251, 191, 36, 0.8)")
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw location marker
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444" // red-500
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw location name
    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.textAlign = "center"
    ctx.fillText(location.name, centerX, centerY + 30)

    // Draw coordinates
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b" // slate-500
    ctx.fillText(`Lat: ${location.lat.toFixed(2)}, Lon: ${location.lon.toFixed(2)}`, centerX, centerY + 50)

    // Draw compass
    const compassRadius = 30
    const compassX = canvas.width - compassRadius - 20
    const compassY = compassRadius + 20

    // Draw compass circle
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fill()
    ctx.strokeStyle = "#64748b" // slate-500
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw compass directions
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.textAlign = "center"
    ctx.fillText("N", compassX, compassY - compassRadius + 12)
    ctx.fillText("S", compassX, compassY + compassRadius - 4)
    ctx.fillText("E", compassX + compassRadius - 4, compassY + 4)
    ctx.fillText("W", compassX - compassRadius + 4, compassY + 4)

    // Draw compass needle
    ctx.beginPath()
    ctx.moveTo(compassX, compassY - compassRadius + 8)
    ctx.lineTo(compassX - 4, compassY)
    ctx.lineTo(compassX, compassY + 8)
    ctx.lineTo(compassX + 4, compassY)
    ctx.closePath()
    ctx.fillStyle = "#ef4444" // red-500
    ctx.fill()
  }, [location, weatherData, isLoading])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Weather Map</h2>
      <Card className="bg-white/50 dark:bg-slate-800/50">
        <CardContent className="p-4">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
