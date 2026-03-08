import express from 'express';
import {
  createShieldAccess,
  getAllShieldAccesses,
  getShieldAccessById,
  updateShieldAccess,
  deleteShieldAccess,
  getAccessesByShieldId
} from '../controllers/shieldAccessController.js';

const router = express.Router();

router.post('/', createShieldAccess);
router.get('/', getAllShieldAccesses);
router.get('/by-shield/:shield_id', getAccessesByShieldId); // Get logs for specific identity
router.get('/:id', getShieldAccessById);
router.put('/:id', updateShieldAccess);
router.delete('/:id', deleteShieldAccess);

export default router;
