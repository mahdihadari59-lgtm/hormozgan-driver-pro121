import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Hormozgan Driver Pro is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({
    service: 'Hormozgan Driver Pro',
    status: 'active',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🚕 Welcome to Hormozgan Driver Pro API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1/status'
    }
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`,
    availableRoutes: ['/', '/health', '/api/v1/status']
  });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🚕 Hormozgan Driver Pro`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ========================================');
});

export default app;
