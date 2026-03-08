import express from 'express';
import ShieldAccess from '../models/SheildAccess.js';
import ThreatEvent from '../models/ThreatEvent.js';
import IdentityRotation from '../models/IdentityRotation.js';
import AuditLog from '../models/AuditLog.js';
import AICustomLog from '../models/AiCustoomLog.js';
import ShieldIdentity from '../models/ShieldIdentity.js';
import { logSecurityEvent } from '../services/blockchainService.js';
import { generateProxyEmail, generateRandomPhone } from '../../Proxy-Engine/src/services/emailGenerator.js';

const router = express.Router();

// AI Engine Configuration
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

// Attack simulation configurations
const IP_POOLS = {
  US: ['45.33.32.156', '104.244.42.1', '172.217.14.206', '208.67.222.222'],
  EU: ['85.214.132.117', '138.201.81.199', '176.9.93.198', '46.101.245.17'],
  ASIA: ['103.21.244.0', '175.45.176.1', '202.89.233.100', '43.255.154.39'],
  RU: ['95.173.136.70', '178.248.232.27', '185.159.82.1', '92.242.59.41'],
  TRUSTED: ['10.0.0.1'],
};

const USER_AGENTS = {
  chrome_win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0',
  firefox_win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Firefox/122.0',
  safari_mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari/537.36',
  bot: 'Python-urllib/3.9',
};

const GEO_LOCATIONS = {
  US: { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
  EU: { country: 'Germany', city: 'Frankfurt', lat: 50.1109, lng: 8.6821 },
  ASIA: { country: 'Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  RU: { country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173 },
};

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomIP = (region) => randomElement(IP_POOLS[region] || IP_POOLS.US);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Call AI Engine /score endpoint for risk assessment
 */
async function callAIEngine(accessData) {
  try {
    const response = await fetch(`${AI_ENGINE_URL}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shield_id: accessData.shield_id,
        timestamp: new Date().toISOString(),
        ip_address: accessData.ip_address || '0.0.0.0',
        ip_country: accessData.ip_country || 'Unknown',
        device_type: accessData.device_type || 'desktop',
        browser: accessData.browser || 'Chrome',
        os: accessData.os || 'Windows',
        login_hour: new Date().getHours(),
        request_frequency: accessData.request_frequency || 1,
        is_proxy: accessData.is_proxy || false,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`AI Engine returned ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[AttackSimulation] AI Engine call failed:', error.message);
    // Fallback response for demo purposes
    return {
      success: false,
      simulated: true,
      data: {
        risk_score: 0.91,
        risk_level: 'high',
        flags: ['geo_anomaly', 'vpn_rotation', 'device_mismatch', 'login_frequency_spike'],
        action: 'burn_and_rotate',
        latency_ms: 0,
      },
      error: error.message,
    };
  }
}

/**
 * Run attack simulation with streaming results
 * POST /api/attack-simulation/run
 */
router.post('/run', async (req, res) => {
  const { shield_id, proxy_email, phases = ['normal'] } = req.body;

  if (!shield_id) {
    return res.status(400).json({ error: 'shield_id is required' });
  }

  // Set up SSE for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const results = [];
  const logs = [];

  const addLog = (message, level = 'info') => {
    logs.push({ message, level, timestamp: new Date().toISOString() });
    sendEvent({ type: 'log', message, level });
  };

  try {
    addLog(`Starting attack simulation for shield: ${shield_id}`);
    addLog(`Email: ${proxy_email || 'N/A'}`);
    addLog(`Phases: ${phases.join(', ')}`);

    for (const phase of phases) {
      sendEvent({ type: 'phase_start', phase });

      let result = { phase, status: 'success', events: [] };

      switch (phase) {
        case 'normal':
          result = await runNormalPhase(shield_id, proxy_email, addLog);
          break;
        case 'brute_force':
          result = await runBruteForcePhase(shield_id, proxy_email, addLog);
          break;
        case 'geo_anomaly':
          result = await runGeoAnomalyPhase(shield_id, proxy_email, addLog);
          break;
        case 'attack':
          result = await runAttackPhase(shield_id, proxy_email, addLog);
          break;
        case 'burn_rotate':
          result = await runBurnRotatePhase(shield_id, proxy_email, addLog, sendEvent);
          break;
        default:
          addLog(`Unknown phase: ${phase}`, 'warning');
      }

      results.push(result);
      sendEvent({ type: 'phase_complete', phase, result });

      await sleep(500);
    }

    sendEvent({ type: 'complete', results, logs });
    res.end();

  } catch (error) {
    addLog(`Error: ${error.message}`, 'error');
    sendEvent({ type: 'error', message: error.message });
    res.end();
  }
});

/**
 * Phase 1: Normal Behavior
 */
async function runNormalPhase(shield_id, proxy_email, addLog) {
  addLog('Phase 1: Normal Behavior - Single login from trusted IP');

  const access = await ShieldAccess.create({
    shield_id,
    ip_address: IP_POOLS.TRUSTED[0],
    user_agent: USER_AGENTS.chrome_win,
    device_id: 'device_trusted_001',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    is_proxy: false,
    geo_location: GEO_LOCATIONS.US,
    login_hour: new Date().getHours(),
    request_frequency: 1,
  });

  addLog(`Login successful from ${IP_POOLS.TRUSTED[0]}`, 'success');

  return {
    phase: 'normal',
    status: 'success',
    events: [{ type: 'login', status: 'success', id: access._id }],
  };
}

/**
 * Phase 2: Brute Force Attack
 */
async function runBruteForcePhase(shield_id, proxy_email, addLog) {
  addLog('Phase 2: Brute Force - 20 rapid login attempts');

  const attempts = 20;
  const events = [];

  for (let i = 0; i < attempts; i++) {
    const ip = randomIP('US');
    const userAgent = randomElement(Object.values(USER_AGENTS));

    await ShieldAccess.create({
      shield_id,
      ip_address: ip,
      user_agent: userAgent,
      device_id: `device_unknown_${i}`,
      device_type: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
      browser: 'Unknown',
      os: 'Unknown',
      is_proxy: false,
      geo_location: GEO_LOCATIONS.US,
      login_hour: new Date().getHours(),
      request_frequency: i + 1,
    });

    events.push({ type: 'login_attempt', ip, index: i + 1 });
    addLog(`Attempt ${i + 1}/${attempts} from ${ip}`);

    await sleep(100);
  }

  // Create threat event for brute force
  await ThreatEvent.create({
    shield_id,
    event_type: 'brute_force_detected',
    severity: 'high',
    metadata: {
      attempts,
      time_window_seconds: Math.floor(attempts * 0.1),
      pattern: 'credential_stuffing',
    },
  });

  addLog(`Brute force pattern detected: ${attempts} attempts`, 'warning');

  return {
    phase: 'brute_force',
    status: 'success',
    events: [{ type: 'login_attempts', count: attempts }],
  };
}

/**
 * Phase 3: Geo Anomaly (Impossible Travel)
 */
async function runGeoAnomalyPhase(shield_id, proxy_email, addLog) {
  addLog('Phase 3: Geo Anomaly - Impossible travel simulation');

  const regions = ['US', 'EU', 'ASIA'];
  const events = [];

  for (const region of regions) {
    const ip = randomIP(region);
    const geo = GEO_LOCATIONS[region];

    await ShieldAccess.create({
      shield_id,
      ip_address: ip,
      user_agent: USER_AGENTS.chrome_win,
      device_id: 'device_trusted_001', // Same device!
      device_type: 'desktop',
      browser: 'Chrome',
      os: 'Windows',
      is_proxy: true,
      geo_location: geo,
      login_hour: new Date().getHours(),
      request_frequency: 1,
    });

    events.push({ type: 'geo_login', country: geo.country, city: geo.city });
    addLog(`Login from ${geo.country} (${geo.city})`, 'warning');

    await sleep(1000);
  }

  // Create geo anomaly threat
  await ThreatEvent.create({
    shield_id,
    event_type: 'geo_anomaly',
    severity: 'critical',
    metadata: {
      locations: regions.map(r => GEO_LOCATIONS[r]),
      time_window_minutes: 5,
      is_impossible_travel: true,
      vpn_detected: true,
    },
  });

  addLog('IMPOSSIBLE TRAVEL DETECTED: 3 continents in minutes!', 'error');

  return {
    phase: 'geo_anomaly',
    status: 'success',
    events: [{ type: 'geo_anomaly', locations: regions.length }],
  };
}

/**
 * Phase 4: Full Attack Simulation
 */
async function runAttackPhase(shield_id, proxy_email, addLog) {
  addLog('Phase 4: Full Attack - Password reset spam + API burst');

  // Password reset spam
  const resetCount = 10;
  for (let i = 0; i < resetCount; i++) {
    await ThreatEvent.create({
      shield_id,
      event_type: 'password_reset_request',
      severity: 'medium',
      metadata: {
        source_ip: randomIP('RU'),
        request_index: i + 1,
      },
    });
    addLog(`Password reset request ${i + 1}/${resetCount}`);
  }

  // API burst
  const burstCount = 15;
  const actions = ['view_identity', 'export_data', 'list_emails', 'access_sensitive'];
  for (let i = 0; i < burstCount; i++) {
    await AICustomLog.create({
      shield_id,
      action: randomElement(actions),
      confidence: Math.random() * 0.5 + 0.5,
      metadata: {
        source_ip: randomIP('RU'),
        request_count: Math.floor(Math.random() * 100) + 50,
      },
    });
  }
  addLog(`API burst: ${burstCount} suspicious requests`, 'warning');

  // Device mismatch with bot
  await ShieldAccess.create({
    shield_id,
    ip_address: randomIP('RU'),
    user_agent: USER_AGENTS.bot,
    device_id: 'device_attacker_bot',
    device_type: 'bot',
    browser: 'Bot',
    os: 'Unknown',
    is_proxy: true,
    geo_location: GEO_LOCATIONS.RU,
    login_hour: new Date().getHours(),
    request_frequency: 100,
  });

  // Create attack threat
  await ThreatEvent.create({
    shield_id,
    event_type: 'account_takeover_attempt',
    severity: 'critical',
    metadata: {
      attack_vector: 'credential_stuffing',
      bot_detected: true,
      vpn_detected: true,
      password_reset_spam: true,
      api_burst: true,
    },
  });

  addLog('Account takeover attempt detected!', 'error');

  return {
    phase: 'attack',
    status: 'success',
    events: [
      { type: 'password_reset', count: resetCount },
      { type: 'api_burst', count: burstCount },
      { type: 'bot_detected', detected: true },
    ],
  };
}

/**
 * Phase 5: AI Detection & Burn/Rotate (with real AI Engine, blockchain, and new identity creation)
 */
async function runBurnRotatePhase(shield_id, proxy_email, addLog, sendEvent) {
  addLog('Phase 5: AI Detection & Burn/Rotate');

  // Step 1: Call real AI Engine with suspicious activity data
  addLog('Requesting AI risk assessment from AI Engine...');
  
  const aiResult = await callAIEngine({
    shield_id,
    ip_address: randomIP('RU'),
    ip_country: 'Russia',
    device_type: 'desktop',
    browser: 'Bot',
    os: 'Unknown',
    request_frequency: 100, // High frequency = suspicious
    is_proxy: true,
  });

  const aiResponse = aiResult.data;
  const usedRealAI = !aiResult.simulated;

  sendEvent({ type: 'ai_response', ...aiResponse, used_real_ai: usedRealAI });
  addLog(`AI Engine Response (${usedRealAI ? 'REAL' : 'SIMULATED'}):`, 'info');
  addLog(`   Risk Score: ${aiResponse.risk_score}`, aiResponse.risk_score > 0.7 ? 'error' : 'warning');
  addLog(`   Risk Level: ${aiResponse.risk_level?.toUpperCase()}`, 'warning');
  addLog(`   Flags: ${aiResponse.flags?.join(', ') || 'none'}`, 'warning');
  addLog(`   Recommended Action: ${aiResponse.action?.toUpperCase()}`, 'error');
  if (aiResponse.latency_ms) {
    addLog(`   AI Latency: ${aiResponse.latency_ms}ms`, 'info');
  }

  // Step 2: Get the original identity details
  let originalIdentity = null;
  try {
    originalIdentity = await ShieldIdentity.findById(shield_id);
  } catch (e) {
    addLog(`Original identity not found in DB, using proxy email`, 'warning');
  }

  const website = originalIdentity?.website || originalIdentity?.linked_services?.[0] || 'proxyshield.io';
  const realEmail = proxy_email?.includes('+shield_') 
    ? proxy_email.split('+')[0] + '@' + proxy_email.split('@')[1]
    : null;

  // Step 3: Burn the old identity (mark as compromised)
  addLog('🔥 Burning compromised identity...', 'error');
  
  if (originalIdentity) {
    originalIdentity.status = 'burned';
    originalIdentity.risk_score = aiResponse.risk_score;
    originalIdentity.burn_reason = `AI-detected: ${aiResponse.flags?.join(', ') || 'high risk'}`;
    await originalIdentity.save();
  }

  // Step 4: Create new identity for the SAME website (self-healing)
  addLog('🔄 Creating new identity for same website (self-healing)...', 'success');
  
  const newProxyEmail = realEmail 
    ? generateProxyEmail(realEmail, website)
    : `shield_${Date.now().toString(36)}@proxyshield.io`;
  const newProxyPhone = generateRandomPhone();

  const newIdentity = await ShieldIdentity.create({
    user_id: originalIdentity?.user_id || null,
    proxy_email: newProxyEmail,
    proxy_phone: newProxyPhone,
    browser_fingerprint: `fp_rotated_${Date.now().toString(36)}`,
    website: website,
    linked_services: [website],
    status: 'active',
    risk_score: 0,
    creation_time: new Date(),
  });

  addLog(`✅ New identity created: ${newIdentity._id}`, 'success');
  addLog(`   New Proxy Email: ${newProxyEmail}`, 'success');
  addLog(`   Website: ${website}`, 'info');

  // Step 5: Create IdentityRotation record
  const rotation = await IdentityRotation.create({
    shield_id: shield_id, // Old identity
    rotation_type: 'auto',
    reason: `AI-detected high-risk activity (score: ${aiResponse.risk_score}): ${aiResponse.flags?.join(', ') || 'multiple anomalies'}`,
    new_shield_id: newIdentity._id, // New identity
  });
  addLog(`📝 Rotation record saved: ${rotation._id}`, 'info');

  // Step 6: Log to blockchain
  addLog('⛓️ Logging to blockchain...', 'info');
  
  const blockchainResult = await logSecurityEvent('identity_rotated', shield_id, {
    event_type: 'burn_and_rotate',
    old_shield_id: shield_id,
    new_shield_id: newIdentity._id.toString(),
    old_proxy_email: proxy_email,
    new_proxy_email: newProxyEmail,
    website: website,
    reason: rotation.reason,
    ai_risk_score: aiResponse.risk_score,
    ai_risk_level: aiResponse.risk_level,
    ai_flags: aiResponse.flags,
    rotation_id: rotation._id.toString(),
    timestamp: new Date().toISOString(),
  });

  const blockchainHash = blockchainResult.success 
    ? blockchainResult.txId 
    : `simulated_0x${Math.random().toString(36).substring(2)}${Date.now().toString(16)}`;
  
  addLog(blockchainResult.success 
    ? `✅ Blockchain logged: ${blockchainHash}` 
    : `⚠️ Blockchain simulated: ${blockchainHash} (${blockchainResult.error || 'network unavailable'})`, 
    blockchainResult.success ? 'success' : 'warning');

  // Step 7: Create audit log
  await AuditLog.create({
    shield_id,
    action: 'burn_and_rotate',
    blockchain_hash: blockchainHash,
    metadata: {
      old_shield_id: shield_id,
      new_shield_id: newIdentity._id.toString(),
      old_proxy_email: proxy_email,
      new_proxy_email: newProxyEmail,
      website: website,
      risk_score: aiResponse.risk_score,
      ai_flags: aiResponse.flags,
      rotation_id: rotation._id.toString(),
      used_real_ai: usedRealAI,
      blockchain_success: blockchainResult.success,
    },
  });

  // Step 8: Log threat event
  await ThreatEvent.create({
    shield_id,
    event_type: 'identity_burned_and_rotated',
    severity: 'critical',
    metadata: {
      ai_risk_score: aiResponse.risk_score,
      ai_risk_level: aiResponse.risk_level,
      ai_flags: aiResponse.flags,
      new_identity_id: newIdentity._id.toString(),
      blockchain_hash: blockchainHash,
    },
  });

  sendEvent({
    type: 'burn_rotate',
    old_shield_id: shield_id,
    new_shield_id: newIdentity._id.toString(),
    old_proxy_email: proxy_email,
    new_proxy_email: newProxyEmail,
    website: website,
    blockchain_hash: blockchainHash,
    blockchain_success: blockchainResult.success,
    ai_used_real: usedRealAI,
  });

  addLog('', 'info');
  addLog('═'.repeat(60), 'info');
  addLog('🔥🔥🔥 IDENTITY BURNED AND ROTATED SUCCESSFULLY 🔥🔥🔥', 'error');
  addLog('═'.repeat(60), 'info');
  addLog(`   ❌ Old ID: ${shield_id} [BURNED]`, 'error');
  addLog(`   ✅ New ID: ${newIdentity._id} [ACTIVE]`, 'success');
  addLog(`   🌐 Website: ${website}`, 'info');
  addLog(`   📧 New Email: ${newProxyEmail}`, 'success');
  addLog(`   ⛓️ Blockchain: ${blockchainHash}`, 'success');
  addLog('═'.repeat(60), 'info');

  return {
    phase: 'burn_rotate',
    status: 'burned',
    events: [
      { type: 'ai_assessment', risk_score: aiResponse.risk_score, used_real_ai: usedRealAI },
      { type: 'identity_burned', shield_id: shield_id },
      { type: 'identity_created', new_shield_id: newIdentity._id.toString() },
      { type: 'rotation_saved', rotation_id: rotation._id.toString() },
      { type: 'blockchain_logged', hash: blockchainHash, success: blockchainResult.success },
    ],
    old_shield_id: shield_id,
    new_shield_id: newIdentity._id.toString(),
    new_proxy_email: newProxyEmail,
    website: website,
    blockchain_hash: blockchainHash,
    ai_response: aiResponse,
  };
}

/**
 * Get simulation status
 * GET /api/attack-simulation/status/:shield_id
 */
router.get('/status/:shield_id', async (req, res) => {
  try {
    const { shield_id } = req.params;

    const [accessCount, threatCount, rotations] = await Promise.all([
      ShieldAccess.countDocuments({ shield_id }),
      ThreatEvent.countDocuments({ shield_id }),
      IdentityRotation.find({ shield_id }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      shield_id,
      access_count: accessCount,
      threat_count: threatCount,
      rotations: rotations,
      last_checked: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Clear simulation data
 * DELETE /api/attack-simulation/clear/:shield_id
 */
router.delete('/clear/:shield_id', async (req, res) => {
  try {
    const { shield_id } = req.params;

    const [accessResult, threatResult, logResult] = await Promise.all([
      ShieldAccess.deleteMany({ shield_id }),
      ThreatEvent.deleteMany({ shield_id }),
      AICustomLog.deleteMany({ shield_id }),
    ]);

    res.json({
      cleared: true,
      deleted: {
        access_logs: accessResult.deletedCount,
        threat_events: threatResult.deletedCount,
        ai_logs: logResult.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
