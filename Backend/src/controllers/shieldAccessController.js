import SheildAccess from '../models/SheildAccess.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createShieldAccess = async (req, res) => {
  try {
    const access = new SheildAccess(req.body);
    const savedAccess = await access.save();
    return sendResponse(res, 201, savedAccess, "Shield access created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllShieldAccesses = async (req, res) => {
  try {
    const accesses = await SheildAccess.find();
    return sendResponse(res, 200, accesses);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getShieldAccessById = async (req, res) => {
  try {
    const access = await SheildAccess.findById(req.params.id);
    if (!access) throw new apiError(404, 'Shield access not found');
    return sendResponse(res, 200, access);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateShieldAccess = async (req, res) => {
  try {
    const access = await SheildAccess.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!access) throw new apiError(404, 'Shield access not found');
    return sendResponse(res, 200, access, "Shield access updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteShieldAccess = async (req, res) => {
  try {
    const access = await SheildAccess.findByIdAndDelete(req.params.id);
    if (!access) throw new apiError(404, 'Shield access not found');
    return sendResponse(res, 200, null, "Shield access deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
