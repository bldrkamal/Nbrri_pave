'use client'

import { useState, useEffect } from 'react'
import LoadDistributionChart from './components/LoadDistributionChart'
import EndpointStatus from './components/EndpointStatus'
import LoadMetrics from './components/LoadMetrics'
import Header from './components/Header'

interface EndpointData {
  id: string
  name: string
  url: string
  status: 'healthy' | 'warning' | 'error'
  responseTime: number
  load: number
  lastChecked: string
}

export default function Home() {
  const [endpoints, setEndpoints] = useState<EndpointData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalLoad, setTotalLoad] = useState(0)
  const [averageResponseTime, setAverageResponseTime] = useState(0)

  useEffect(() => {
    // Simulate initial data loading
    const mockEndpoints: EndpointData[] = [
      {
        id: '1',
        name: 'Primary API',
        url: 'https://api-primary.example.com',
        status: 'healthy',
        responseTime: 120,
        load: 45,
        lastChecked: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Secondary API',
        url: 'https://api-secondary.example.com',
        status: 'healthy',
        responseTime: 95,
        load: 38,
        lastChecked: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Backup API',
        url: 'https://api-backup.example.com',
        status: 'warning',
        responseTime: 250,
        load: 17,
        lastChecked: new Date().toISOString()
      }
    ]

    setEndpoints(mockEndpoints)
    
    // Calculate metrics
    const total = mockEndpoints.reduce((sum, endpoint) => sum + endpoint.load, 0)
    const avgResponse = mockEndpoints.reduce((sum, endpoint) => sum + endpoint.responseTime, 0) / mockEndpoints.length
    
    setTotalLoad(total)
    setAverageResponseTime(avgResponse)
    setIsLoading(false)

    // Set up real-time updates
    const interval = setInterval(() => {
      updateEndpointData()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const updateEndpointData = async () => {
    try {
      const response = await fetch('/api/endpoints')
      if (response.ok) {
        const data = await response.json()
        setEndpoints(data.endpoints)
        
        const total = data.endpoints.reduce((sum: number, endpoint: EndpointData) => sum + endpoint.load, 0)
        const avgResponse = data.endpoints.reduce((sum: number, endpoint: EndpointData) => sum + endpoint.responseTime, 0) / data.endpoints.length
        
        setTotalLoad(total)
        setAverageResponseTime(avgResponse)
      }
    } catch (error) {
      console.error('Failed to update endpoint data:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LoadMetrics 
          totalLoad={totalLoad}
          averageResponseTime={averageResponseTime}
          activeEndpoints={endpoints.filter(e => e.status === 'healthy').length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Load Distribution</h2>
          <LoadDistributionChart endpoints={endpoints} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Endpoint Status</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <EndpointStatus key={endpoint.id} endpoint={endpoint} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Real-time Monitoring</h2>
        <p className="text-gray-600 mb-4">
          This dashboard automatically distributes load across multiple endpoints and monitors their health in real-time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Auto-scaling</h3>
            <p className="text-blue-600">Automatically adjusts load distribution based on endpoint performance</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Health Checks</h3>
            <p className="text-green-600">Continuous monitoring of endpoint availability and response times</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Failover</h3>
            <p className="text-purple-600">Automatic failover to healthy endpoints when issues are detected</p>
          </div>
        </div>
      </div>
    </main>
  )
}