import { NextRequest, NextResponse } from 'next/server'

interface EndpointData {
  id: string
  name: string
  url: string
  status: 'healthy' | 'warning' | 'error'
  responseTime: number
  load: number
  lastChecked: string
}

// Simulated endpoint data - in a real application, this would come from a database
let endpoints: EndpointData[] = [
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

// Simulate health checks and load balancing
function updateEndpointHealth() {
  endpoints = endpoints.map(endpoint => {
    // Simulate response time variations
    const responseTimeVariation = Math.random() * 50 - 25
    const newResponseTime = Math.max(50, endpoint.responseTime + responseTimeVariation)
    
    // Determine status based on response time
    let status: 'healthy' | 'warning' | 'error' = 'healthy'
    if (newResponseTime > 500) {
      status = 'error'
    } else if (newResponseTime > 200) {
      status = 'warning'
    }
    
    // Simulate load variations
    const loadVariation = Math.random() * 20 - 10
    const newLoad = Math.max(0, Math.min(100, endpoint.load + loadVariation))
    
    return {
      ...endpoint,
      status,
      responseTime: Math.round(newResponseTime),
      load: Math.round(newLoad),
      lastChecked: new Date().toISOString()
    }
  })
  
  // Redistribute load based on health
  redistributeLoad()
}

function redistributeLoad() {
  const healthyEndpoints = endpoints.filter(e => e.status === 'healthy')
  const warningEndpoints = endpoints.filter(e => e.status === 'warning')
  
  if (healthyEndpoints.length === 0) return
  
  // Calculate total load to distribute
  const totalLoad = endpoints.reduce((sum, e) => sum + e.load, 0)
  
  // Distribute load primarily to healthy endpoints
  const healthyLoadShare = 0.8 // 80% to healthy endpoints
  const warningLoadShare = 0.2 // 20% to warning endpoints
  
  let healthyLoad = totalLoad * healthyLoadShare
  let warningLoad = totalLoad * warningLoadShare
  
  // Distribute among healthy endpoints
  if (healthyEndpoints.length > 0) {
    const loadPerHealthy = healthyLoad / healthyEndpoints.length
    endpoints = endpoints.map(endpoint => {
      if (endpoint.status === 'healthy') {
        return { ...endpoint, load: Math.round(loadPerHealthy) }
      }
      return endpoint
    })
  }
  
  // Distribute among warning endpoints
  if (warningEndpoints.length > 0) {
    const loadPerWarning = warningLoad / warningEndpoints.length
    endpoints = endpoints.map(endpoint => {
      if (endpoint.status === 'warning') {
        return { ...endpoint, load: Math.round(loadPerWarning) }
      }
      return endpoint
    })
  }
  
  // Set error endpoints to 0 load
  endpoints = endpoints.map(endpoint => {
    if (endpoint.status === 'error') {
      return { ...endpoint, load: 0 }
    }
    return endpoint
  })
}

export async function GET(request: NextRequest) {
  try {
    // Update endpoint health and redistribute load
    updateEndpointHealth()
    
    return NextResponse.json({
      endpoints,
      timestamp: new Date().toISOString(),
      totalLoad: endpoints.reduce((sum, e) => sum + e.load, 0),
      averageResponseTime: Math.round(endpoints.reduce((sum, e) => sum + e.responseTime, 0) / endpoints.length)
    })
  } catch (error) {
    console.error('Error fetching endpoints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch endpoint data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url } = body
    
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }
    
    const newEndpoint: EndpointData = {
      id: Date.now().toString(),
      name,
      url,
      status: 'healthy',
      responseTime: 100,
      load: 0,
      lastChecked: new Date().toISOString()
    }
    
    endpoints.push(newEndpoint)
    
    return NextResponse.json({
      endpoint: newEndpoint,
      message: 'Endpoint added successfully'
    })
  } catch (error) {
    console.error('Error adding endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to add endpoint' },
      { status: 500 }
    )
  }
}