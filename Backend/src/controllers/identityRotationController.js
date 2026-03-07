import IdentityRotation from '../models/IdentityRotation.js';
import ShieldIdentity from '../models/ShieldIdentity.js';
import AuditLog from '../models/AuditLog.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logSecurityEvent } from '../services/blockchainService.js';
import { buildIdentityRotatedEvent } from '../services/blockchainEventSchema.js';

export const createIdentityRotation = async (req, res) => {
  try {
    const rotation = new IdentityRotation(req.body);
    const savedRotation = await rotation.save();

    // Log identity_rotated to blockchain (non-blocking)
    try {
      const oldShield = await ShieldIdentity.findById(savedRotation.shield_id);
      const event = buildIdentityRotatedEvent(savedRotation, oldShield);
      const bcResult = await logSecurityEvent(event.event_type, event.shield_id, event);
      if (bcResult.success) {
        await new AuditLog({
          shield_id: savedRotation.shield_id,
          action: 'rotation',
          blockchain_hash: bcResult.txId,
          metadata: { event_type: 'identity_rotated' },
        }).save();
      }
    } catch (bcError) {
      console.error('[Blockchain] identity_rotated logging failed:', bcError.message);
    }

    return sendResponse(res, 201, savedRotation, "Identity rotation created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllIdentityRotations = async (req, res) => {
  try {
    const rotations = await IdentityRotation.find().populate('shield_id new_shield_id');
    return sendResponse(res, 200, rotations);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getIdentityRotationById = async (req, res) => {
  try {
    const rotation = await IdentityRotation.findById(req.params.id).populate('shield_id new_shield_id');
    if (!rotation) throw new apiError(404, 'Identity rotation not found');
    return sendResponse(res, 200, rotation);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateIdentityRotation = async (req, res) => {
  try {
    const rotation = await IdentityRotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rotation) throw new apiError(404, 'Identity rotation not found');
    return sendResponse(res, 200, rotation, "Identity rotation updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteIdentityRotation = async (req, res) => {
  try {
    const rotation = await IdentityRotation.findByIdAndDelete(req.params.id);
    if (!rotation) throw new apiError(404, 'Identity rotation not found');
    return sendResponse(res, 200, null, "Identity rotation deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
