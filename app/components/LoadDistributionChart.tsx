'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface EndpointData {
  id: string
  name: string
  url: string
  status: 'healthy' | 'warning' | 'error'
  responseTime: number
  load: number
  lastChecked: string
}

interface LoadDistributionChartProps {
  endpoints: EndpointData[]
}

export default function LoadDistributionChart({ endpoints }: LoadDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const colors = endpoints.map((_, index) => {
      const hue = (index * 137.508) % 360 // Golden angle approximation for good color distribution
      return `hsl(${hue}, 70%, 60%)`
    })

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: endpoints.map(endpoint => endpoint.name),
        datasets: [
          {
            data: endpoints.map(endpoint => endpoint.load),
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('60%', '50%')),
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const endpoint = endpoints[context.dataIndex]
                return [
                  `${endpoint.name}: ${endpoint.load}%`,
                  `Response Time: ${endpoint.responseTime}ms`,
                  `Status: ${endpoint.status}`,
                ]
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [endpoints])

  return (
    <div className="relative h-64">
      <canvas ref={chartRef}></canvas>
      {endpoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No endpoint data available
        </div>
      )}
    </div>
  )
}