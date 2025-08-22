'use client'

interface EndpointData {
  id: string
  name: string
  url: string
  status: 'healthy' | 'warning' | 'error'
  responseTime: number
  load: number
  lastChecked: string
}

interface EndpointStatusProps {
  endpoint: EndpointData
}

export default function EndpointStatus({ endpoint }: EndpointStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy'
      case 'warning':
        return 'Warning'
      case 'error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  const getResponseTimeColor = (time: number) => {
    if (time < 100) return 'text-green-600'
    if (time < 300) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatLastChecked = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${getStatusColor(endpoint.status)} rounded-full animate-pulse`}></div>
          <h3 className="font-medium text-gray-900">{endpoint.name}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          endpoint.status === 'healthy' ? 'bg-green-100 text-green-800' :
          endpoint.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getStatusText(endpoint.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">URL:</span>
          <span className="text-gray-900 font-mono text-xs truncate max-w-48">
            {endpoint.url}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Response Time:</span>
          <span className={`font-medium ${getResponseTimeColor(endpoint.responseTime)}`}>
            {endpoint.responseTime}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Current Load:</span>
          <span className="font-medium text-blue-600">{endpoint.load}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Last Checked:</span>
          <span className="text-gray-500">{formatLastChecked(endpoint.lastChecked)}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Load Distribution</span>
          <span>{endpoint.load}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              endpoint.load < 30 ? 'bg-green-500' : 
              endpoint.load < 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(endpoint.load, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}