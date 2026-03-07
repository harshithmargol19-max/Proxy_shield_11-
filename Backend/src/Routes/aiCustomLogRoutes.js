import express from 'express';
import {
  createLog,
  getAllLogs,
  getLogById,
  updateLog,
  deleteLog
} from '../controllers/aiCustomLogController.js';

const router = express.Router();

router.post('/', createLog);
router.get('/', getAllLogs);
router.get('/:id', getLogById);
router.put('/:id', updateLog);
router.delete('/:id', deleteLog);

export default router;
