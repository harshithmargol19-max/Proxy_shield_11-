import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import emailRoutes from './routes/emailRoutes.js';
import fraudRoutes from './routes/fraudRoutes.js';
import { fraudDetector } from './middleware/fraudDetector.js';
import { emailParser } from './middleware/emailParser.js';
import { authMiddleware, rateLimiter } from './middleware/authMiddleware.js';
import { startSMTPServer } from './services/smtpServer.js';

import User from '../src/models/user.js';
import ShieldIdentity from '../src/models/ShieldIdentity.js';
import Email from './models/Email.js';
import FraudReport from './models/FraudReport.js';

console.log('Models loaded:', {
  User: !!User,
  ShieldIdentity: !!ShieldIdentity,
  Email: !!Email,
  FraudReport: !!FraudReport
});

const app = express();
const PORT = process.env.PROXY_ENGINE_PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(rateLimiter(100, 60000));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Proxy Engine is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    version: '1.0.0',
    features: {
      fraudDetection: true,
      emailParsing: true,
      smtpServer: process.env.ENABLE_SMTP === 'true',
      authentication: process.env.REQUIRE_AUTH === 'true',
    },
  });
});

app.use('/api/emails', emailParser, fraudDetector, emailRoutes);
app.use('/api/fraud', authMiddleware, fraudRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');

    if (process.env.ENABLE_SMTP === 'true') {
      const smtpPort = parseInt(process.env.SMTP_PORT || '2525');
      startSMTPServer(smtpPort);
    }

    app.listen(PORT, () => {
      console.log(`Proxy Engine running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
