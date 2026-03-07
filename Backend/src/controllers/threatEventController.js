import ThreatEvent from '../models/ThreatEvent.js';

export const createThreatEvent = async (req, res) => {
  try {
    const event = new ThreatEvent(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllThreatEvents = async (req, res) => {
  try {
    const events = await ThreatEvent.find().populate('shield_id');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getThreatEventById = async (req, res) => {
  try {
    const event = await ThreatEvent.findById(req.params.id).populate('shield_id');
    if (!event) return res.status(404).json({ message: 'Threat event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateThreatEvent = async (req, res) => {
  try {
    const event = await ThreatEvent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Threat event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteThreatEvent = async (req, res) => {
  try {
    const event = await ThreatEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Threat event not found' });
    res.json({ message: 'Threat event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
