import IdentityRotation from '../models/IdentityRotation.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createIdentityRotation = async (req, res) => {
  try {
    const rotation = new IdentityRotation(req.body);
    const savedRotation = await rotation.save();
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
