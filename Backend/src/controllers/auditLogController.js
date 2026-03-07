import AuditLog from '../models/AuditLog.js';

export const createAuditLog = async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('shield_id');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('shield_id');
    if (!log) return res.status(404).json({ message: 'Audit log not found' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!log) return res.status(404).json({ message: 'Audit log not found' });
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Audit log not found' });
    res.json({ message: 'Audit log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
