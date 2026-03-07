import AuditLog from '../models/AuditLog.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logSecurityEvent } from '../services/blockchainService.js';

export const createAuditLog = async (req, res) => {
  try {
    const { shield_id, action, metadata } = req.body;

    // Submit to blockchain first to get txId
    let blockchainHash = req.body.blockchain_hash || null;

    if (!blockchainHash) {
      try {
        const bcResult = await logSecurityEvent(
          action,
          String(shield_id),
          { action, metadata: metadata || {} },
        );
        if (bcResult.success) {
          blockchainHash = bcResult.txId;
        }
      } catch (bcError) {
        console.error('[Blockchain] audit log event failed:', bcError.message);
      }
    }

    // If blockchain failed and no hash was provided, generate a local fallback
    if (!blockchainHash) {
      blockchainHash = `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      console.warn('[AuditLog] Using local fallback hash — blockchain unavailable');
    }

    const log = new AuditLog({
      ...req.body,
      blockchain_hash: blockchainHash,
    });
    const savedLog = await log.save();

    return sendResponse(res, 201, savedLog, "Audit log created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('shield_id');
    return sendResponse(res, 200, logs);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('shield_id');
    if (!log) throw new apiError(404, 'Audit log not found');
    return sendResponse(res, 200, log);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!log) throw new apiError(404, 'Audit log not found');
    return sendResponse(res, 200, log, "Audit log updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findByIdAndDelete(req.params.id);
    if (!log) throw new apiError(404, 'Audit log not found');
    return sendResponse(res, 200, null, "Audit log deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
