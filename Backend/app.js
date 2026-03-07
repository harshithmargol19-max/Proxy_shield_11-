import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import stemRoute from "./Routes/stemRoute.js";
import threatEventRoute from "./Routes/threatEventRoutes.js";
import identityRotationRoute from "./Routes/identityRotationRoutes.js";
import communicationProxyRoute from "./Routes/communicationProxyRoutes.js";
import auditLogRoute from "./Routes/auditLogRoutes.js";
import shieldAccessRoute from "./Routes/shieldAccessRoutes.js";
import aiCustomLogRoute from "./Routes/aiCustomLogRoutes.js";
import shieldIdentityRoute from "./Routes/shieldIdentityRoutes.js";
import userRoute from "./Routes/userRoutes.js";

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

app.get("/", (req, res) => {
  res.send("ProxyShield API is running");
});

export default app;
