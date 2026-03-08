import ShieldIdentity from '../models/ShieldIdentity.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/user.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logSecurityEvent } from '../services/blockchainService.js';
import { buildIdentityCreatedEvent, buildIdentityBurnedEvent } from '../services/blockchainEventSchema.js';
import { generateProxyEmail, generateRandomPhone } from '../../Proxy-Engine/src/services/emailGenerator.js';

export const createShieldIdentity = async (req, res) => {
  try {
    const { user_id, linked_services, website, real_email } = req.body;
    
    // Get user's real email for generating proxy email
    // Priority: 1. real_email from request, 2. from user record, 3. null
    let userEmail = real_email || null;
    if (!userEmail && user_id) {
      const user = await User.findById(user_id);
      if (user && user.real_email) {
        userEmail = user.real_email;
      }
    }
    
    // Auto-generate proxy email and phone if not provided
    const shieldData = {
      user_id,
      proxy_email: req.body.proxy_email || generateProxyEmail(userEmail, website),
      proxy_phone: req.body.proxy_phone || generateRandomPhone(),
      browser_fingerprint: req.body.browser_fingerprint || `fp_${Date.now().toString(36)}`,
      linked_services: linked_services || (website ? [website] : []),
      website: website,
      status: 'active'
    };
    
    const shield = new ShieldIdentity(shieldData);
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
