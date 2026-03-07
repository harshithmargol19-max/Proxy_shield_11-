import AIEngineLog from '../models/AiCustoomLog.js';
import AuditLog from '../models/AuditLog.js';
import ShieldIdentity from '../models/ShieldIdentity.js';
import IdentityRotation from '../models/IdentityRotation.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logSecurityEvent } from '../services/blockchainService.js';
import {
  buildAnomalyDetectedEvent,
  buildMfaTriggeredEvent,
  buildIdentityBurnedEvent,
  buildIdentityRotatedEvent,
} from '../services/blockchainEventSchema.js';

// Risk levels that trigger blockchain logging
const LOGGABLE_RISK_LEVELS = new Set(['medium', 'high', 'critical']);

export const createLog = async (req, res) => {
  try {
    const log = new AIEngineLog(req.body);
    const savedLog = await log.save();

    const { shield_id, action, confidence, metadata } = req.body;

    // Extract AI result fields from body or metadata
    const riskLevel = metadata?.risk_level || metadata?.riskLevel;
    const riskScore = confidence ?? metadata?.risk_score ?? metadata?.riskScore;
    const flags     = metadata?.flags || [];
    const aiAction  = action || metadata?.action;

    // Log anomaly_detected when risk_level >= medium
    if (riskLevel && LOGGABLE_RISK_LEVELS.has(riskLevel.toLowerCase())) {
      const aiResult = {
        shield_id: String(shield_id),
        risk_score: riskScore,
        risk_level: riskLevel,
        action: aiAction,
        flags,
        confidence: riskScore,
        latency_ms: metadata?.latency_ms ?? null,
      };

      // Log anomaly_detected
      try {
        const anomalyEvent = buildAnomalyDetectedEvent(aiResult);
        const bcResult = await logSecurityEvent(anomalyEvent.event_type, anomalyEvent.shield_id, anomalyEvent);
        if (bcResult.success) {
          await new AuditLog({
            shield_id,
            action: 'login_attempt',
            blockchain_hash: bcResult.txId,
            metadata: { event_type: 'anomaly_detected', risk_level: riskLevel },
          }).save();
        }
      } catch (bcError) {
        console.error('[Blockchain] anomaly_detected logging failed:', bcError.message);
      }

      // If action is "challenge", also log mfa_triggered
      if (aiAction === 'challenge') {
        try {
          const mfaEvent = buildMfaTriggeredEvent(String(shield_id), aiResult, metadata?.mfa_method || 'email');
          const bcResult = await logSecurityEvent(mfaEvent.event_type, mfaEvent.shield_id, mfaEvent);
          if (bcResult.success) {
            await new AuditLog({
              shield_id,
              action: 'login_attempt',
              blockchain_hash: bcResult.txId,
              metadata: { event_type: 'mfa_triggered', risk_level: riskLevel },
            }).save();
          }
        } catch (bcError) {
          console.error('[Blockchain] mfa_triggered logging failed:', bcError.message);
        }
      }

      // If action is "burn_and_rotate", execute full burn + rotate lifecycle
      if (aiAction === 'burn_and_rotate') {
        try {
          // 1. Update ShieldIdentity status to "burned"
          const burnedShield = await ShieldIdentity.findByIdAndUpdate(
            shield_id,
            { status: 'burned' },
            { new: true },
          );

          if (burnedShield) {
            // 2. Log identity_burned to blockchain
            const burnEvent = buildIdentityBurnedEvent(
              burnedShield,
              'ai_detected_compromise',
              riskScore,
            );
            const burnBcResult = await logSecurityEvent(burnEvent.event_type, burnEvent.shield_id, burnEvent);
            if (burnBcResult.success) {
              await new AuditLog({
                shield_id,
                action: 'burn',
                blockchain_hash: burnBcResult.txId,
                metadata: {
                  event_type: 'identity_burned',
                  reason: 'ai_detected_compromise',
                  risk_score: riskScore,
                  risk_level: riskLevel,
                },
              }).save();
            }

            // 3. Create new ShieldIdentity (rotated)
            const newShield = await new ShieldIdentity({
              user_id: burnedShield.user_id,
              proxy_email: burnedShield.proxy_email.replace(/^(.+?)(@)/, `$1_rotated$2`),
              proxy_phone: burnedShield.proxy_phone,
              linked_services: burnedShield.linked_services,
              status: 'active',
            }).save();

            // 4. Create IdentityRotation record
            const rotation = await new IdentityRotation({
              shield_id,
              rotation_type: 'auto',
              reason: 'ai_detected_compromise',
              new_shield_id: newShield._id,
            }).save();

            // 5. Log identity_rotated to blockchain
            const rotateEvent = buildIdentityRotatedEvent(rotation, burnedShield);
            const rotateBcResult = await logSecurityEvent(rotateEvent.event_type, rotateEvent.shield_id, rotateEvent);
            if (rotateBcResult.success) {
              await new AuditLog({
                shield_id: newShield._id,
                action: 'rotation',
                blockchain_hash: rotateBcResult.txId,
                metadata: {
                  event_type: 'identity_rotated',
                  old_shield_id: String(shield_id),
                  new_shield_id: String(newShield._id),
                },
              }).save();
            }

            console.log(`[BurnRotate] Shield ${shield_id} burned → new shield ${newShield._id}`);
          }
        } catch (burnError) {
          console.error('[BurnRotate] burn_and_rotate failed:', burnError.message);
        }
      }
    }

    return sendResponse(res, 201, savedLog, "Log created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const logs = await AIEngineLog.find().populate('shield_id');
    return sendResponse(res, 200, logs);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getLogById = async (req, res) => {
  try {
    const log = await AIEngineLog.findById(req.params.id).populate('shield_id');
    if (!log) throw new apiError(404, 'Log not found');
    return sendResponse(res, 200, log);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateLog = async (req, res) => {
  try {
    const log = await AIEngineLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!log) throw new apiError(404, 'Log not found');
    return sendResponse(res, 200, log, "Log updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteLog = async (req, res) => {
  try {
    const log = await AIEngineLog.findByIdAndDelete(req.params.id);
    if (!log) throw new apiError(404, 'Log not found');
    return sendResponse(res, 200, null, "Log deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
