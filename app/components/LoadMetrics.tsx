'use client'

interface LoadMetricsProps {
  totalLoad: number
  averageResponseTime: number
  activeEndpoints: number
}

export default function LoadMetrics({ totalLoad, averageResponseTime, activeEndpoints }: LoadMetricsProps) {
  const getLoadColor = (load: number) => {
    if (load < 30) return 'text-green-600'
    if (load < 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getResponseTimeColor = (time: number) => {
    if (time < 100) return 'text-green-600'
    if (time < 300) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Total Load</h3>
          <div className={`text-2xl font-bold ${getLoadColor(totalLoad)}`}>
            {totalLoad}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              totalLoad < 30 ? 'bg-green-500' : totalLoad < 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(totalLoad, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Distributed across all endpoints</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Avg Response Time</h3>
          <div className={`text-2xl font-bold ${getResponseTimeColor(averageResponseTime)}`}>
            {averageResponseTime}ms
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">Across all endpoints</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Active Endpoints</h3>
          <div className="text-2xl font-bold text-blue-600">
            {activeEndpoints}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Healthy endpoints</span>
        </div>
      </div>
    </>
  )
}