import SheildAccess from '../models/SheildAccess.js';
import ShieldIdentity from '../models/ShieldIdentity.js';
import ThreatEvent from '../models/ThreatEvent.js';
import { apiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { scoreShieldAccess } from '../services/aiService.js';
import { logSecurityEvent } from '../services/blockchainService.js';

export const createShieldAccess = async (req, res) => {
  try {
    const access = new SheildAccess(req.body);
    const savedAccess = await access.save();
    
    // Score the access with AI Engine (non-blocking)
    let aiResult = null;
    try {
      aiResult = await scoreShieldAccess(savedAccess);
      
      if (aiResult.success && aiResult.data.risk_level !== 'low') {
        // Log threat event if risk is elevated
        const threat = new ThreatEvent({
          shield_id: savedAccess.shield_id,
          threat_type: aiResult.data.flags.length > 0 ? aiResult.data.flags[0] : 'anomaly_detected',
          severity: aiResult.data.risk_level,
          description: `AI detected ${aiResult.data.risk_level} risk: ${aiResult.data.flags.join(', ') || 'Behavioral anomaly'}`,
          metadata: {
            risk_score: aiResult.data.risk_score,
            action: aiResult.data.action,
            flags: aiResult.data.flags,
            access_id: savedAccess._id,
          },
        });
        await threat.save();
        
        // Log to blockchain if high risk
        if (aiResult.data.risk_level === 'high' || aiResult.data.risk_level === 'critical') {
          try {
            await logSecurityEvent('anomaly_detected', savedAccess.shield_id, {
              event_type: 'anomaly_detected',
              shield_id: savedAccess.shield_id,
              risk_score: aiResult.data.risk_score,
              risk_level: aiResult.data.risk_level,
              flags: aiResult.data.flags,
            });
          } catch (bcError) {
            console.error('[Blockchain] Anomaly logging failed:', bcError.message);
          }
          
          // Auto-burn identity if action is 'burn'
          if (aiResult.data.action === 'burn') {
            await ShieldIdentity.findByIdAndUpdate(savedAccess.shield_id, {
              status: 'compromised',
              risk_score: aiResult.data.risk_score,
              burn_reason: 'ai_auto_burn',
            });
          }
        }
      }
    } catch (aiError) {
      console.error('[AI Service] Scoring failed:', aiError.message);
    }
    
    return sendResponse(res, 201, {
      ...savedAccess.toObject(),
      ai_assessment: aiResult?.data || null,
    }, "Shield access created successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const getAllShieldAccesses = async (req, res) => {
  try {
    const accesses = await SheildAccess.find();
    return sendResponse(res, 200, accesses);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export const getShieldAccessById = async (req, res) => {
  try {
    const access = await SheildAccess.findById(req.params.id);
    if (!access) throw new apiError(404, 'Shield access not found');
    return sendResponse(res, 200, access);
  } catch (error) {
    throw new apiError(error.statusCode || 500, error.message);
  }
};

export const updateShieldAccess = async (req, res) => {
  try {
    const access = await SheildAccess.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!access) throw new apiError(404, 'Shield access not found');
    return sendResponse(res, 200, access, "Shield access updated successfully");
  } catch (error) {
    throw new apiError(400, error.message);
  }
};

export const deleteShieldAccess = async (req, res) => {
  try {
    const access = await SheildAccess.findByIdAndDelete(req.params.id);
    if (!access) throw new apiError(404, 'Shield access not found');
    return sendResponse(res, 200, null, "Shield access deleted successfully");
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

// Get all access logs for a specific shield identity
export const getAccessesByShieldId = async (req, res) => {
  try {
    const { shield_id } = req.params;
    const accesses = await SheildAccess.find({ shield_id }).sort({ timestamp: -1 }).limit(50);
    
    // Transform to activity log format for frontend
    const logs = accesses.map(access => ({
      id: access._id,
      action: access.is_suspicious ? `Suspicious login from ${access.ip_country}` : `Login from ${access.ip_country}`,
      details: `${access.browser} on ${access.os} (${access.device_type}) - IP: ${access.ip_address}`,
      timestamp: access.timestamp,
      is_suspicious: access.is_suspicious || false,
      risk_score: access.risk_score || 0,
    }));
    
    return sendResponse(res, 200, logs);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};
