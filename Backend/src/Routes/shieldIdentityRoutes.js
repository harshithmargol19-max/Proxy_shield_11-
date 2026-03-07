import express from 'express';
import {
  createShieldIdentity,
  getAllShieldIdentities,
  getShieldIdentityById,
  updateShieldIdentity,
  deleteShieldIdentity
} from '../controllers/shieldIdentityController.js';

const router = express.Router();

router.post('/', createShieldIdentity);
router.get('/', getAllShieldIdentities);
router.get('/:id', getShieldIdentityById);
router.put('/:id', updateShieldIdentity);
router.delete('/:id', deleteShieldIdentity);

export default router;
