import express from 'express';
import {
  createCommunicationProxy,
  getAllCommunicationProxies,
  getCommunicationProxyById,
  updateCommunicationProxy,
  deleteCommunicationProxy
} from '../controllers/communicationProxyController.js';

const router = express.Router();

router.post('/', createCommunicationProxy);
router.get('/', getAllCommunicationProxies);
router.get('/:id', getCommunicationProxyById);
router.put('/:id', updateCommunicationProxy);
router.delete('/:id', deleteCommunicationProxy);

export default router;
