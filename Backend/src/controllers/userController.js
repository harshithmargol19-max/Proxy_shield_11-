import User from '../models/user.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

/**
 * Sync Firebase user - creates or updates user based on Firebase UID
 * Called after successful Firebase authentication
 */
export const firebaseSyncUser = async (req, res) => {
  try {
    const { firebase_uid, real_email, display_name, photo_url, is_anonymous } = req.body;
    
    // Validate firebase_uid is present
    if (!firebase_uid) {
      throw new apiError(400, 'firebase_uid is required');
    }

    // Try to find existing user
    let user = await User.findOne({ firebase_uid });
    
    if (user) {
      // Update existing user
      user.real_email = real_email || user.real_email;
      user.display_name = display_name || user.display_name;
      user.photo_url = photo_url || user.photo_url;
      user.is_anonymous = is_anonymous ?? user.is_anonymous;
      user.last_login = new Date();
      user.updated_at = new Date();
      
      await user.save();
      
      return sendResponse(res, 200, {
        user_id: user._id,
        firebase_uid: user.firebase_uid,
        is_new: false,
        message: 'User synced successfully'
      });
    } else {
      // Create new user
      user = new User({
        firebase_uid,
        real_email: real_email || null,
        display_name: display_name || null,
        photo_url: photo_url || null,
        is_anonymous: is_anonymous || false,
        last_login: new Date(),
      });
      
      await user.save();
      
      return sendResponse(res, 201, {
        user_id: user._id,
        firebase_uid: user.firebase_uid,
        is_new: true,
        message: 'User created successfully'
      });
    }
  } catch (error) {
    console.error('[Firebase Sync] Error:', error.message);
    throw new apiError(error.statusCode || 500, error.message);
  }
};

/**
 * Get current user profile based on Firebase UID from auth middleware
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
        message: 'User not authenticated'
      });
    }
    
    const user = await User.findOne({ firebase_uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'User not found in database'
      });
    }
    
    return sendResponse(res, 200, user);
  } catch (error) {
    console.error('[getCurrentUser] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
};

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
