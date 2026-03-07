import ShieldIdentity from '../models/ShieldIdentity.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createShieldIdentity = async (req, res) => {
  try {
    const shield = new ShieldIdentity(req.body);
    const savedShield = await shield.save();
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
