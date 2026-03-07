import ShieldIdentity from '../models/ShieldIdentity.js';

export const createShieldIdentity = async (req, res) => {
  try {
    const shield = new ShieldIdentity(req.body);
    const savedShield = await shield.save();
    res.status(201).json(savedShield);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllShieldIdentities = async (req, res) => {
  try {
    const shields = await ShieldIdentity.find().populate('user_id');
    res.json(shields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShieldIdentityById = async (req, res) => {
  try {
    const shield = await ShieldIdentity.findById(req.params.id).populate('user_id');
    if (!shield) return res.status(404).json({ message: 'Shield identity not found' });
    res.json(shield);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShieldIdentity = async (req, res) => {
  try {
    const shield = await ShieldIdentity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shield) return res.status(404).json({ message: 'Shield identity not found' });
    res.json(shield);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShieldIdentity = async (req, res) => {
  try {
    const shield = await ShieldIdentity.findByIdAndDelete(req.params.id);
    if (!shield) return res.status(404).json({ message: 'Shield identity not found' });
    res.json({ message: 'Shield identity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
