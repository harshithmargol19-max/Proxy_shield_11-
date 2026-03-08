/**
 * AI Engine Service for ProxyShield-11 Backend
 * 
 * Calls the FastAPI AI Engine for real-time threat detection
 * and risk scoring of shield access events.
 */

import axios from 'axios';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

const aiClient = axios.create({
  baseURL: AI_ENGINE_URL,
  timeout: 5000, // 5 second timeout for AI scoring
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Check AI Engine health
 * @returns {Promise<{status: string, service: string, version: string}>}
 */
export const checkAIHealth = async () => {
  try {
    const response = await aiClient.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[AIService] Health check failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Score a shield access event for risk
 * @param {Object} accessData - Shield access data
 * @returns {Promise<{risk_score: number, risk_level: string, action: string, flags: string[]}>}
 */
export const scoreShieldAccess = async (accessData) => {
  try {
    const payload = {
      shield_id: accessData.shield_id?.toString() || accessData._id?.toString(),
      timestamp: accessData.timestamp || new Date().toISOString(),
      ip_address: accessData.ip_address || '0.0.0.0',
      ip_country: accessData.ip_country || 'unknown',
      device_type: accessData.device_type || 'unknown',
      browser: accessData.browser || 'unknown',
      os: accessData.os || 'unknown',
      login_hour: accessData.login_hour ?? new Date().getHours(),
      request_frequency: accessData.request_frequency ?? 1,
      is_proxy: accessData.is_proxy ?? false,
    };

    const response = await aiClient.post('/score', payload);
    
    console.log(`[AIService] Risk scored: Shield ${payload.shield_id} | Score: ${response.data.risk_score} | Level: ${response.data.risk_level}`);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[AIService] Scoring failed:', error.message);
    return {
      success: false,
      error: error.message,
      // Return safe defaults on failure
      data: {
        risk_score: 0,
        risk_level: 'low',
        action: 'allow',
        flags: [],
      },
    };
  }
};

/**
 * Analyze multiple access events in batch
 * @param {Array} accessEvents - Array of access events
 * @returns {Promise<Array>}
 */
export const batchScoreAccess = async (accessEvents) => {
  const results = await Promise.all(
    accessEvents.map(event => scoreShieldAccess(event))
  );
  return results;
};

export default {
  checkAIHealth,
  scoreShieldAccess,
  batchScoreAccess,
};
