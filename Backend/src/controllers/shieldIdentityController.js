import ShieldIdentity from '../models/ShieldIdentity.js';
import AuditLog from '../models/AuditLog.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logSecurityEvent } from '../services/blockchainService.js';
import { buildIdentityCreatedEvent, buildIdentityBurnedEvent } from '../services/blockchainEventSchema.js';

export const createShieldIdentity = async (req, res) => {
  try {
    const shield = new ShieldIdentity(req.body);
    const savedShield = await shield.save();

    // Log identity_created to blockchain (non-blocking)
    try {
      const event = buildIdentityCreatedEvent(savedShield);
      const bcResult = await logSecurityEvent(event.event_type, event.shield_id, event);
      if (bcResult.success) {
        await new AuditLog({
          shield_id: savedShield._id,
          action: 'login_attempt',
          blockchain_hash: bcResult.txId,
          metadata: { event_type: 'identity_created' },
        }).save();
      }
    } catch (bcError) {
      console.error('[Blockchain] identity_created logging failed:', bcError.message);
    }

    return sendResponse(res, 201, savedShield, "Shield identity created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllShieldIdentities = async (req, res) => {
  try {
    const shields = await ShieldIdentity.find().populate('user_id');
    return sendResponse(res, 200, shields);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getShieldIdentityById = async (req, res) => {
  try {
    const shield = await ShieldIdentity.findById(req.params.id).populate('user_id');
    if (!shield) throw new apiError(404, 'Shield identity not found');
    return sendResponse(res, 200, shield);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateShieldIdentity = async (req, res) => {
  try {
    const shield = await ShieldIdentity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shield) throw new apiError(404, 'Shield identity not found');

    // If status changed to "burned", log identity_burned to blockchain
    if (req.body.status === 'burned') {
      try {
        const event = buildIdentityBurnedEvent(shield, req.body.burn_reason || 'manual_burn', req.body.risk_score ?? null);
        const bcResult = await logSecurityEvent(event.event_type, event.shield_id, event);
        if (bcResult.success) {
          await new AuditLog({
            shield_id: shield._id,
            action: 'burn',
            blockchain_hash: bcResult.txId,
            metadata: { event_type: 'identity_burned' },
          }).save();
        }
      } catch (bcError) {
        console.error('[Blockchain] identity_burned logging failed:', bcError.message);
      }
    }

    return sendResponse(res, 200, shield, "Shield identity updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteShieldIdentity = async (req, res) => {
  try {
    const shield = await ShieldIdentity.findByIdAndDelete(req.params.id);
    if (!shield) throw new apiError(404, 'Shield identity not found');
    return sendResponse(res, 200, null, "Shield identity deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
