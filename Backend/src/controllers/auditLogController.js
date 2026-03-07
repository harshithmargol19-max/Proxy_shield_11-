import AuditLog from '../models/AuditLog.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createAuditLog = async (req, res) => {
  try {
    const log = new AuditLog(req.body);
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
