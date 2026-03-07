import express from 'express';
import {
  createShieldAccess,
  getAllShieldAccesses,
  getShieldAccessById,
  updateShieldAccess,
  deleteShieldAccess
} from '../controllers/shieldAccessController.js';

const router = express.Router();

router.post('/', createShieldAccess);
router.get('/', getAllShieldAccesses);
router.get('/:id', getShieldAccessById);
router.put('/:id', updateShieldAccess);
router.delete('/:id', deleteShieldAccess);

export default router;
