import express from 'express';
import {
  createThreatEvent,
  getAllThreatEvents,
  getThreatEventById,
  updateThreatEvent,
  deleteThreatEvent
} from '../controllers/threatEventController.js';

const router = express.Router();

router.post('/', createThreatEvent);
router.get('/', getAllThreatEvents);
router.get('/:id', getThreatEventById);
router.put('/:id', updateThreatEvent);
router.delete('/:id', deleteThreatEvent);

export default router;
