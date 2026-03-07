/**
 * ProxyShield-11 Main Application
 * Unified Backend + Proxy Engine server
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import connectDB from './src/config/db.js';

// Main API Routes (using stemRoute which combines all routes)
import stemRoute from './src/Routes/stemRoute.js';

// Error handling middleware
import { errorHandler } from './src/middleware/errorMiddleware.js';

// Proxy Engine routes and middleware
import emailRoutes from './Proxy-Engine/src/Routes/emailRoutes.js';
import fraudRoutes from './Proxy-Engine/src/Routes/fraudRoutes.js';
import { fraudDetector } from './Proxy-Engine/src/middleware/fraudDetector.js';
import { emailParser } from './Proxy-Engine/src/middleware/emailParser.js';
import { authMiddleware } from './Proxy-Engine/src/middleware/authMiddleware.js';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Database Connection
// ---------------------------------------------------------------------------
connectDB();

// ---------------------------------------------------------------------------
// Health Check Endpoints
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'proxyshield-11-backend',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      proxyEngine: '/proxy-engine',
      health: '/health',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'proxyshield-11-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/proxy-engine/health', (req, res) => {
  res.json({
    success: true,
    message: 'Proxy Engine is running',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Main API Routes
// ---------------------------------------------------------------------------
app.use('/api', stemRoute);

// ---------------------------------------------------------------------------
// Proxy Engine Routes
// ---------------------------------------------------------------------------
app.use('/proxy-engine/emails', emailParser, fraudDetector, emailRoutes);
app.use('/proxy-engine/fraud', authMiddleware, fraudRoutes);

// ---------------------------------------------------------------------------
// Error Handler (must be last)
// ---------------------------------------------------------------------------
app.use(errorHandler);

export default app;
