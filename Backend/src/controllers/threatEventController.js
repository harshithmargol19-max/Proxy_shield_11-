import ThreatEvent from '../models/ThreatEvent.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

export const createThreatEvent = async (req, res) => {
  try {
    const event = new ThreatEvent(req.body);
    const savedEvent = await event.save();
    return sendResponse(res, 201, savedEvent, "Threat event created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllThreatEvents = async (req, res) => {
  try {
    const events = await ThreatEvent.find().populate('shield_id');
    return sendResponse(res, 200, events);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getThreatEventById = async (req, res) => {
  try {
    const event = await ThreatEvent.findById(req.params.id).populate('shield_id');
    if (!event) throw new apiError(404, 'Threat event not found');
    return sendResponse(res, 200, event);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateThreatEvent = async (req, res) => {
  try {
    const event = await ThreatEvent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) throw new apiError(404, 'Threat event not found');
    return sendResponse(res, 200, event, "Threat event updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteThreatEvent = async (req, res) => {
  try {
    const event = await ThreatEvent.findByIdAndDelete(req.params.id);
    if (!event) throw new apiError(404, 'Threat event not found');
    return sendResponse(res, 200, null, "Threat event deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
