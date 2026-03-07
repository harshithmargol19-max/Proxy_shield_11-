import SheildAccess from '../models/SheildAccess.js';

export const createShieldAccess = async (req, res) => {
  try {
    const access = new SheildAccess(req.body);
    const savedAccess = await access.save();
    res.status(201).json(savedAccess);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllShieldAccesses = async (req, res) => {
  try {
    const accesses = await SheildAccess.find();
    res.json(accesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShieldAccessById = async (req, res) => {
  try {
    const access = await SheildAccess.findById(req.params.id);
    if (!access) return res.status(404).json({ message: 'Shield access not found' });
    res.json(access);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShieldAccess = async (req, res) => {
  try {
    const access = await SheildAccess.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!access) return res.status(404).json({ message: 'Shield access not found' });
    res.json(access);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShieldAccess = async (req, res) => {
  try {
    const access = await SheildAccess.findByIdAndDelete(req.params.id);
    if (!access) return res.status(404).json({ message: 'Shield access not found' });
    res.json({ message: 'Shield access deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
