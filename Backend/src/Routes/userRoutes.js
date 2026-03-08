import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  firebaseSyncUser,
  getCurrentUser
} from '../controllers/userController.js';
import { firebaseAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Firebase authentication routes (protected)
router.post('/firebase-sync', firebaseAuth, firebaseSyncUser);
router.get('/me', firebaseAuth, getCurrentUser);

// Standard CRUD routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
