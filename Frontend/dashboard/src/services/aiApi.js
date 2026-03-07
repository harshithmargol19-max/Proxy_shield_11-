import axios from 'axios';

/**
 * AI Engine API Service
 * Connects to FastAPI AI Engine on port 8000
 */

const AI_BASE_URL = import.meta.env.VITE_AI_ENGINE_URL || '/ai';

const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // AI scoring should be fast
});

/**
 * Get AI Engine health status
 */
export const getAIHealth = async () => {
  const response = await aiApi.get('/health');
  return response.data;
};

/**
 * Score a shield access request for risk
 * @param {Object} accessData - Shield access data
 * @param {string} accessData.shield_id - Shield ID
 * @param {string} accessData.timestamp - ISO timestamp
 * @param {string} accessData.ip_address - Client IP
 * @param {string} accessData.ip_country - Geo-resolved country
 * @param {string} accessData.device_type - mobile|desktop|tablet|unknown
 * @param {string} accessData.browser - Browser name
 * @param {string} accessData.os - Operating system
 * @param {number} accessData.login_hour - Login hour 0-23
 * @param {number} accessData.request_frequency - Request count
 * @param {boolean} accessData.is_proxy - Proxy/VPN flag
 */
export const scoreRisk = async (accessData) => {
  const response = await aiApi.post('/score', accessData);
  return response.data;
};

/**
 * Score risk for a shield access record
 * Transforms ShieldAccess record to AI Engine format
 */
export const scoreShieldAccess = async (shieldAccess) => {
  const payload = {
    shield_id: shieldAccess.shield_id || shieldAccess._id,
    timestamp: shieldAccess.timestamp || new Date().toISOString(),
    ip_address: shieldAccess.ip_address,
    ip_country: shieldAccess.ip_country,
    device_type: shieldAccess.device_type || 'unknown',
    browser: shieldAccess.browser,
    os: shieldAccess.os,
    login_hour: shieldAccess.login_hour ?? new Date().getHours(),
    request_frequency: shieldAccess.request_frequency ?? 1,
    is_proxy: shieldAccess.is_proxy ?? false,
  };
  
  return scoreRisk(payload);
};

export default aiApi;
