import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
<<<<<<< HEAD
import stemRoute from "./Routes/stemRoute.js";
import threatEventRoute from "./Routes/threatEventRoutes.js";
import identityRotationRoute from "./Routes/identityRotationRoutes.js";
import communicationProxyRoute from "./Routes/communicationProxyRoutes.js";
import auditLogRoute from "./Routes/auditLogRoutes.js";
import shieldAccessRoute from "./Routes/shieldAccessRoutes.js";
import aiCustomLogRoute from "./Routes/aiCustomLogRoutes.js";
import shieldIdentityRoute from "./Routes/shieldIdentityRoutes.js";
import userRoute from "./Routes/userRoutes.js";
=======
import stemRoute from './Routes/stemRoute.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import emailRoutes from './Proxy-Engine/src/routes/emailRoutes.js';
import fraudRoutes from './Proxy-Engine/src/routes/fraudRoutes.js';
import { fraudDetector } from './Proxy-Engine/src/middleware/fraudDetector.js';
import { emailParser } from './Proxy-Engine/src/middleware/emailParser.js';
import { authMiddleware } from './Proxy-Engine/src/middleware/authMiddleware.js';
>>>>>>> 35a4b5bb852de93d70d7d7b5639f2aee9c7cdb9e

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/stem", stemRoute);
app.use("/api/threat-event", threatEventRoute);
app.use("/api/identity-rotation", identityRotationRoute);
app.use("/api/communication-proxy", communicationProxyRoute);
app.use("/api/audit-log", auditLogRoute);
app.use("/api/shield-access", shieldAccessRoute);
app.use("/api/ai-custom-log", aiCustomLogRoute);
app.use("/api/shield-identity", shieldIdentityRoute);
app.use("/api/user", userRoute);

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.send("ProxyShield API is running");
=======
app.use('/proxy-engine/emails', emailParser, fraudDetector, emailRoutes);
app.use('/proxy-engine/fraud', authMiddleware, fraudRoutes);

app.get('/', (req, res) => {
  res.send('ProxyShield 11 API is running');
>>>>>>> 35a4b5bb852de93d70d7d7b5639f2aee9c7cdb9e
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
