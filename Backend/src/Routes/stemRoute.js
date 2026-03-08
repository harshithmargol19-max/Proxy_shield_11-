import express from 'express';
import userRoutes from './userRoutes.js';
import shieldAccessRoutes from './shieldAccessRoutes.js';
import shieldIdentityRoutes from './shieldIdentityRoutes.js';
import threatEventRoutes from './threatEventRoutes.js';
import identityRotationRoutes from './identityRotationRoutes.js';
import communicationProxyRoutes from './communicationProxyRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import aiCustomLogRoutes from './aiCustomLogRoutes.js';
import attackSimulationRoutes from './attackSimulationRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/shield-access', shieldAccessRoutes);
router.use('/shield-identity', shieldIdentityRoutes);
router.use('/threat-event', threatEventRoutes);
router.use('/identity-rotation', identityRotationRoutes);
router.use('/communication-proxy', communicationProxyRoutes);
router.use('/audit-log', auditLogRoutes);
router.use('/ai-log', aiCustomLogRoutes);
router.use('/attack-simulation', attackSimulationRoutes);

export default router;
