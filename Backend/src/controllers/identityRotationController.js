import IdentityRotation from '../models/IdentityRotation.js';

export const createIdentityRotation = async (req, res) => {
  try {
    const rotation = new IdentityRotation(req.body);
    const savedRotation = await rotation.save();
    res.status(201).json(savedRotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllIdentityRotations = async (req, res) => {
  try {
    const rotations = await IdentityRotation.find().populate('shield_id new_shield_id');
    res.json(rotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIdentityRotationById = async (req, res) => {
  try {
    const rotation = await IdentityRotation.findById(req.params.id).populate('shield_id new_shield_id');
    if (!rotation) return res.status(404).json({ message: 'Identity rotation not found' });
    res.json(rotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIdentityRotation = async (req, res) => {
  try {
    const rotation = await IdentityRotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rotation) return res.status(404).json({ message: 'Identity rotation not found' });
    res.json(rotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteIdentityRotation = async (req, res) => {
  try {
    const rotation = await IdentityRotation.findByIdAndDelete(req.params.id);
    if (!rotation) return res.status(404).json({ message: 'Identity rotation not found' });
    res.json({ message: 'Identity rotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
