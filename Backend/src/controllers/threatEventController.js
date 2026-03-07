import ThreatEvent from '../models/ThreatEvent.js';
import AuditLog from '../models/AuditLog.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logSecurityEvent } from '../services/blockchainService.js';
import { buildThreatEventEvent } from '../services/blockchainEventSchema.js';

export const createThreatEvent = async (req, res) => {
  try {
    const event = new ThreatEvent(req.body);
    const savedEvent = await event.save();

    // Log threat_event to blockchain (non-blocking)
    try {
      const bcEvent = buildThreatEventEvent(savedEvent);
      const bcResult = await logSecurityEvent(bcEvent.event_type, bcEvent.shield_id, bcEvent);
      if (bcResult.success) {
        await new AuditLog({
          shield_id: savedEvent.shield_id,
          action: 'communication_filtered',
          blockchain_hash: bcResult.txId,
          metadata: { event_type: 'threat_event', threat_type: savedEvent.event_type },
        }).save();
      }
    } catch (bcError) {
      console.error('[Blockchain] threat_event logging failed:', bcError.message);
    }

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
