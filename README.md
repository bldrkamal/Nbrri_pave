# Load Distribution Dashboard

A modern web application for monitoring and distributing load across multiple endpoints, optimized for deployment on Vercel's free tier.

## Features

- **Real-time Load Monitoring**: Track load distribution across multiple endpoints
- **Health Checks**: Continuous monitoring of endpoint availability and response times
- **Auto-scaling**: Automatic load redistribution based on endpoint performance
- **Failover Support**: Automatic failover to healthy endpoints
- **Modern UI**: Beautiful, responsive dashboard built with Next.js and Tailwind CSS
- **Vercel Optimized**: Configured for optimal performance on Vercel's platform

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: Vercel (Free Tier)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd load-distribution-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Automatic Deployment

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your repository

2. **Configure deployment settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Set up environment variables if needed
   - Deploy to production

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Vercel Configuration

The `vercel.json` file is pre-configured with:
- Function timeout settings
- Security headers
- API route rewrites

## API Endpoints

### GET /api/endpoints
Returns current endpoint status and load distribution data.

**Response:**
```json
{
  "endpoints": [
    {
      "id": "1",
      "name": "Primary API",
      "url": "https://api-primary.example.com",
      "status": "healthy",
      "responseTime": 120,
      "load": 45,
      "lastChecked": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "totalLoad": 100,
  "averageResponseTime": 155
}
```

### POST /api/endpoints
Add a new endpoint to monitor.

**Request Body:**
```json
{
  "name": "New API",
  "url": "https://api-new.example.com"
}
```

### GET /api/health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "responseTime": "5ms",
  "version": "1.0.0",
  "environment": "production"
}
```

## Load Distribution Logic

The application implements intelligent load distribution:

1. **Health-based Distribution**: 80% of load goes to healthy endpoints, 20% to warning endpoints
2. **Automatic Failover**: Error endpoints receive 0% load
3. **Dynamic Rebalancing**: Load is redistributed every 30 seconds
4. **Response Time Monitoring**: Endpoints are classified based on response times:
   - < 100ms: Healthy
   - 100-200ms: Warning
   - > 200ms: Error

## Performance Optimizations

### Vercel Free Tier Optimizations

- **Edge Functions**: API routes are optimized for Vercel's edge network
- **Static Generation**: Pages are statically generated where possible
- **Image Optimization**: Next.js Image component for optimal loading
- **Bundle Optimization**: Tree shaking and code splitting enabled

### Caching Strategy

- **Static Assets**: Cached at the edge
- **API Responses**: 30-second cache for endpoint data
- **Health Checks**: 5-second cache for health status

## Monitoring and Analytics

The dashboard provides real-time insights:

- **Load Distribution Chart**: Visual representation of load across endpoints
- **Response Time Metrics**: Average and individual endpoint response times
- **Health Status**: Real-time endpoint health monitoring
- **Auto-refresh**: Data updates every 30 seconds

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure Node.js version is 18+
   - Clear `.next` folder and reinstall dependencies

2. **API Errors**
   - Check Vercel function timeout settings
   - Verify environment variables are set

3. **Performance Issues**
   - Monitor Vercel function execution times
   - Check for memory leaks in long-running processes

### Vercel Free Tier Limits

- **Function Execution**: 10 seconds max
- **Bandwidth**: 100GB/month
- **Build Time**: 100 minutes/month
- **Serverless Function Calls**: 100,000/month

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check Vercel documentation for deployment issues
- Review Next.js documentation for framework questions
