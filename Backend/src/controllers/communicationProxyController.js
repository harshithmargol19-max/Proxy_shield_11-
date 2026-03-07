import CommunicationProxy from '../models/CommunicationProxy.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createCommunicationProxy = async (req, res) => {
  try {
    const proxy = new CommunicationProxy(req.body);
    const savedProxy = await proxy.save();
    return sendResponse(res, 201, savedProxy, "Communication proxy created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllCommunicationProxies = async (req, res) => {
  try {
    const proxies = await CommunicationProxy.find().populate('shield_id');
    return sendResponse(res, 200, proxies);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getCommunicationProxyById = async (req, res) => {
  try {
    const proxy = await CommunicationProxy.findById(req.params.id).populate('shield_id');
    if (!proxy) throw new apiError(404, 'Communication proxy not found');
    return sendResponse(res, 200, proxy);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateCommunicationProxy = async (req, res) => {
  try {
    const proxy = await CommunicationProxy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!proxy) throw new apiError(404, 'Communication proxy not found');
    return sendResponse(res, 200, proxy, "Communication proxy updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteCommunicationProxy = async (req, res) => {
  try {
    const proxy = await CommunicationProxy.findByIdAndDelete(req.params.id);
    if (!proxy) throw new apiError(404, 'Communication proxy not found');
    return sendResponse(res, 200, null, "Communication proxy deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
