import AIEngineLog from '../models/AiCustoomLog.js';

export const createLog = async (req, res) => {
  try {
    const log = new AIEngineLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const logs = await AIEngineLog.find().populate('shield_id');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLogById = async (req, res) => {
  try {
    const log = await AIEngineLog.findById(req.params.id).populate('shield_id');
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLog = async (req, res) => {
  try {
    const log = await AIEngineLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLog = async (req, res) => {
  try {
    const log = await AIEngineLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
