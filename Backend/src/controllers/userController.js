import User from '../models/user.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    return sendResponse(res, 201, savedUser, "User created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return sendResponse(res, 200, users);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, 'User not found');
    return sendResponse(res, 200, user);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) throw new apiError(404, 'User not found');
    return sendResponse(res, 200, user, "User updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new apiError(404, 'User not found');
    return sendResponse(res, 200, null, "User deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
