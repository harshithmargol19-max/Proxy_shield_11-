import express from 'express';
import {
  createIdentityRotation,
  getAllIdentityRotations,
  getIdentityRotationById,
  updateIdentityRotation,
  deleteIdentityRotation
} from '../controllers/identityRotationController.js';

const router = express.Router();

router.post('/', createIdentityRotation);
router.get('/', getAllIdentityRotations);
router.get('/:id', getIdentityRotationById);
router.put('/:id', updateIdentityRotation);
router.delete('/:id', deleteIdentityRotation);

export default router;
