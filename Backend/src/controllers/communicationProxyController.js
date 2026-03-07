import CommunicationProxy from '../models/CommunicationProxy.js';

export const createCommunicationProxy = async (req, res) => {
  try {
    const proxy = new CommunicationProxy(req.body);
    const savedProxy = await proxy.save();
    res.status(201).json(savedProxy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCommunicationProxies = async (req, res) => {
  try {
    const proxies = await CommunicationProxy.find().populate('shield_id');
    res.json(proxies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommunicationProxyById = async (req, res) => {
  try {
    const proxy = await CommunicationProxy.findById(req.params.id).populate('shield_id');
    if (!proxy) return res.status(404).json({ message: 'Communication proxy not found' });
    res.json(proxy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCommunicationProxy = async (req, res) => {
  try {
    const proxy = await CommunicationProxy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!proxy) return res.status(404).json({ message: 'Communication proxy not found' });
    res.json(proxy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCommunicationProxy = async (req, res) => {
  try {
    const proxy = await CommunicationProxy.findByIdAndDelete(req.params.id);
    if (!proxy) return res.status(404).json({ message: 'Communication proxy not found' });
    res.json({ message: 'Communication proxy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
