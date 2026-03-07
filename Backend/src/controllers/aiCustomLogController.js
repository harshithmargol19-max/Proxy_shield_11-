import AIEngineLog from '../models/AiCustoomLog.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createLog = async (req, res) => {
  try {
    const log = new AIEngineLog(req.body);
    const savedLog = await log.save();
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
