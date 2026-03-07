import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import stemRoute from './Routes/stemRoute.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import emailRoutes from './Proxy-Engine/src/routes/emailRoutes.js';
import fraudRoutes from './Proxy-Engine/src/routes/fraudRoutes.js';
import { fraudDetector } from './Proxy-Engine/src/middleware/fraudDetector.js';
import { emailParser } from './Proxy-Engine/src/middleware/emailParser.js';
import { authMiddleware } from './Proxy-Engine/src/middleware/authMiddleware.js';

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use('/api', stemRoute);

app.use('/proxy-engine/emails', emailParser, fraudDetector, emailRoutes);
app.use('/proxy-engine/fraud', authMiddleware, fraudRoutes);

app.get('/', (req, res) => {
  res.send('ProxyShield 11 API is running');
});

app.get('/proxy-engine/health', (req, res) => {
  res.json({
    success: true,
    message: 'Proxy Engine is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
