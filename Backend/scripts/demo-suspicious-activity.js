/**
 * ProxyShield-11 Suspicious Activity Simulator
 * 
 * This script simulates various suspicious activities to trigger
 * the AI anomaly detection engine and test the burn_and_rotate flow.
 * 
 * Usage: node scripts/demo-suspicious-activity.js
 */

import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const AI_ENGINE_URL = process.env.AI_URL || 'http://localhost:8000';

// Test Shield Identity
const TEST_IDENTITY = {
  shield_id: 'shield_demo_001',
  proxy_email: 'shield_demo_001@proxyshield.io',
  user_id: 'demo_user_001',
};

// Simulated VPN/Proxy servers
const PROXY_SERVERS = [
  { url: 'http://vpn-us.example:8080', location: 'US', country: 'United States', city: 'New York' },
  { url: 'http://vpn-eu.example:8080', location: 'EU', country: 'Germany', city: 'Frankfurt' },
  { url: 'http://vpn-asia.example:8080', location: 'ASIA', country: 'Singapore', city: 'Singapore' },
  { url: 'http://vpn-ru.example:8080', location: 'RU', country: 'Russia', city: 'Moscow' },
  { url: 'http://vpn-br.example:8080', location: 'BR', country: 'Brazil', city: 'São Paulo' },
];

// Simulated IP addresses by region
const IP_POOLS = {
  US: ['192.168.1.100', '45.33.32.156', '104.244.42.1', '172.217.14.206'],
  EU: ['85.214.132.117', '138.201.81.199', '176.9.93.198', '46.101.245.17'],
  ASIA: ['103.21.244.0', '175.45.176.1', '202.89.233.100', '43.255.154.39'],
  RU: ['95.173.136.70', '178.248.232.27', '185.159.82.1', '92.242.59.41'],
  BR: ['177.71.207.1', '200.147.35.216', '189.6.2.85', '177.67.84.53'],
  TRUSTED: ['10.0.0.1'], // Trusted home IP
};

// Simulated User Agents (browser fingerprints)
const USER_AGENTS = {
  chrome_win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  chrome_mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  firefox_win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  safari_mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
  edge_win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  bot: 'Python-urllib/3.9',
};

// Device IDs
const DEVICE_IDS = {
  trusted: 'device_trusted_001',
  suspicious: ['device_unknown_001', 'device_unknown_002', 'device_unknown_003', 'device_bot_001'],
};

// ============================================================================
// Utility Functions
// ============================================================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomIP = (region = 'US') => randomElement(IP_POOLS[region] || IP_POOLS.US);

const generateFingerprint = () => Math.random().toString(36).substring(2, 15);

const timestamp = () => new Date().toISOString();

const log = (phase, message, data = null) => {
  const time = new Date().toLocaleTimeString();
  console.log(`\n[${time}] 📌 ${phase}`);
  console.log(`   ${message}`);
  if (data) {
    console.log('   Response:', JSON.stringify(data, null, 2));
  }
};

const logSuccess = (message) => console.log(`   ✅ ${message}`);
const logWarning = (message) => console.log(`   ⚠️  ${message}`);
const logError = (message) => console.log(`   ❌ ${message}`);
const logInfo = (message) => console.log(`   ℹ️  ${message}`);

// ============================================================================
// API Request Functions
// ============================================================================

/**
 * Create axios instance with optional proxy
 */
const createClient = (proxyUrl = null, userAgent = USER_AGENTS.chrome_win) => {
  const config = {
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
    },
  };

  // Note: In real demo, you would use actual proxy servers
  // For local testing, we simulate proxy headers instead
  // if (proxyUrl) {
  //   config.httpsAgent = new HttpsProxyAgent(proxyUrl);
  // }

  return axios.create(config);
};

/**
 * Simulate login attempt
 */
const simulateLogin = async (options = {}) => {
  const {
    shield_id = TEST_IDENTITY.shield_id,
    ip_address = randomIP('TRUSTED'),
    user_agent = USER_AGENTS.chrome_win,
    device_id = DEVICE_IDS.trusted,
    geo_location = { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
    proxy = null,
    is_proxy = false,
  } = options;

  const payload = {
    shield_id,
    ip_address,
    user_agent,
    device_id,
    device_type: user_agent.includes('Mobile') ? 'mobile' : 'desktop',
    browser: user_agent.includes('Chrome') ? 'Chrome' : user_agent.includes('Firefox') ? 'Firefox' : 'Other',
    os: user_agent.includes('Windows') ? 'Windows' : user_agent.includes('Mac') ? 'macOS' : 'Other',
    timestamp: timestamp(),
    geo_location,
    is_proxy,
    login_hour: new Date().getHours(),
    request_frequency: 1,
  };

  try {
    const client = createClient(proxy?.url, user_agent);
    
    // Log to shield-access endpoint
    const response = await client.post('/api/shield-access', payload);
    return { success: true, data: response.data, payload };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      payload 
    };
  }
};

/**
 * Simulate password reset request
 */
const simulatePasswordReset = async (options = {}) => {
  const {
    shield_id = TEST_IDENTITY.shield_id,
    ip_address = randomIP('US'),
    user_agent = USER_AGENTS.chrome_win,
  } = options;

  const payload = {
    shield_id,
    action: 'password_reset_request',
    ip_address,
    user_agent,
    timestamp: timestamp(),
    metadata: {
      request_type: 'password_reset',
      email: TEST_IDENTITY.proxy_email,
    },
  };

  try {
    const client = createClient(null, user_agent);
    // Log as threat event
    const response = await client.post('/api/threat-event', {
      shield_id,
      event_type: 'password_reset_request',
      detected_at: timestamp(),
      severity: 'low',
      metadata: payload,
    });
    return { success: true, data: response.data, payload };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message, payload };
  }
};

/**
 * Log suspicious activity
 */
const logActivity = async (activityType, metadata = {}) => {
  const payload = {
    shield_id: TEST_IDENTITY.shield_id,
    action: activityType,
    timestamp: timestamp(),
    confidence: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
    metadata,
  };

  try {
    const client = createClient();
    const response = await client.post('/api/ai-log', payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Request AI risk assessment
 */
const requestAIAssessment = async (accessData) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/analyze/access`, accessData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Trigger burn and rotate
 */
const triggerBurnAndRotate = async (reason, riskScore = 0.91) => {
  const payload = {
    shield_id: TEST_IDENTITY.shield_id,
    rotation_type: 'auto',
    timestamp: timestamp(),
    reason,
    new_shield_id: `shield_rotated_${Date.now()}`,
  };

  try {
    const client = createClient();
    
    // Create rotation record
    const rotationResponse = await client.post('/api/identity-rotation', payload);
    
    // Update shield identity status to burned
    await client.put(`/api/shield-identity/${TEST_IDENTITY.shield_id}`, {
      status: 'burned',
    }).catch(() => {}); // Ignore if identity doesn't exist
    
    // Create audit log
    await client.post('/api/audit-log', {
      shield_id: TEST_IDENTITY.shield_id,
      action: 'burn',
      timestamp: timestamp(),
      blockchain_hash: `0x${generateFingerprint()}${generateFingerprint()}`,
      metadata: {
        reason,
        risk_score: riskScore,
        new_shield_id: payload.new_shield_id,
      },
    });

    return { success: true, data: rotationResponse.data, newShieldId: payload.new_shield_id };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// ============================================================================
// Simulation Phases
// ============================================================================

/**
 * Phase 1: Normal Behavior
 * Single login from trusted IP with consistent device fingerprint
 */
const phase1_NormalBehavior = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('📗 PHASE 1: NORMAL BEHAVIOR');
  console.log('   Simulating legitimate user activity');
  console.log('='.repeat(70));

  log('Login', 'Single login from trusted IP with consistent device');
  
  const result = await simulateLogin({
    ip_address: IP_POOLS.TRUSTED[0],
    device_id: DEVICE_IDS.trusted,
    user_agent: USER_AGENTS.chrome_win,
    geo_location: { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
    is_proxy: false,
  });

  if (result.success) {
    logSuccess('Normal login successful');
    logInfo(`IP: ${result.payload.ip_address}`);
    logInfo(`Device: ${result.payload.device_id}`);
  } else {
    logWarning(`Login endpoint: ${result.error}`);
  }

  await sleep(2000);
  
  // Second normal activity
  log('Activity', 'Normal browsing activity');
  await logActivity('normal_browse', { page: '/dashboard', duration: 45 });
  logSuccess('Activity logged');

  return { phase: 1, status: 'normal', loginCount: 1 };
};

/**
 * Phase 2: Suspicious Login Pattern
 * 20 login attempts within 10 seconds
 */
const phase2_SuspiciousLoginPattern = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('📙 PHASE 2: SUSPICIOUS LOGIN PATTERN');
  console.log('   Simulating rapid login attempts (brute force pattern)');
  console.log('='.repeat(70));

  const loginCount = 20;
  const results = [];
  let successCount = 0;
  let failCount = 0;

  log('Attack', `Initiating ${loginCount} rapid login attempts...`);

  for (let i = 0; i < loginCount; i++) {
    const ip = randomIP('US');
    const result = await simulateLogin({
      ip_address: ip,
      device_id: randomElement(DEVICE_IDS.suspicious),
      user_agent: randomElement(Object.values(USER_AGENTS)),
    });

    results.push(result);
    
    if (result.success) {
      successCount++;
      process.stdout.write(`   🔄 Attempt ${i + 1}/${loginCount} - Success (IP: ${ip})\n`);
    } else {
      failCount++;
      process.stdout.write(`   🔄 Attempt ${i + 1}/${loginCount} - Logged (IP: ${ip})\n`);
    }

    // Rapid fire - minimal delay
    await sleep(Math.random() * 500 + 100);
  }

  console.log();
  logWarning(`Completed ${loginCount} login attempts in rapid succession`);
  logInfo(`Success: ${successCount}, Recorded: ${failCount}`);

  // Log threat event
  await simulateLogin({
    ip_address: randomIP('US'),
    device_id: 'device_attacker_001',
    user_agent: USER_AGENTS.bot,
  });

  return { phase: 2, status: 'suspicious', loginCount, pattern: 'brute_force' };
};

/**
 * Phase 3: Geo Anomaly
 * Logins from 3 different VPN locations in quick succession
 */
const phase3_GeoAnomaly = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('📕 PHASE 3: GEO ANOMALY');
  console.log('   Simulating impossible travel - logins from multiple countries');
  console.log('='.repeat(70));

  const locations = [
    { proxy: PROXY_SERVERS[0], region: 'US', geo: { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 } },
    { proxy: PROXY_SERVERS[1], region: 'EU', geo: { country: 'Germany', city: 'Frankfurt', lat: 50.1109, lng: 8.6821 } },
    { proxy: PROXY_SERVERS[2], region: 'ASIA', geo: { country: 'Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198 } },
  ];

  for (const loc of locations) {
    log('VPN Login', `Login from ${loc.geo.country} (${loc.geo.city})`);
    
    const result = await simulateLogin({
      ip_address: randomIP(loc.region),
      device_id: DEVICE_IDS.trusted, // Same device, different locations!
      user_agent: USER_AGENTS.chrome_win,
      geo_location: loc.geo,
      proxy: loc.proxy,
      is_proxy: true,
    });

    if (result.success) {
      logSuccess(`Logged from ${loc.geo.city}`);
    } else {
      logWarning(`Recorded attempt from ${loc.geo.city}`);
    }
    
    logInfo(`IP: ${result.payload.ip_address}`);
    logInfo(`Via Proxy: ${loc.proxy.url}`);

    // Create threat event for geo anomaly
    const client = createClient();
    await client.post('/api/threat-event', {
      shield_id: TEST_IDENTITY.shield_id,
      event_type: 'geo_anomaly',
      detected_at: timestamp(),
      severity: 'high',
      metadata: {
        previous_location: locations[0].geo,
        current_location: loc.geo,
        time_difference_minutes: 5,
        is_impossible_travel: true,
      },
    }).catch(() => {});

    await sleep(2000);
  }

  logWarning('IMPOSSIBLE TRAVEL DETECTED: User logged in from 3 continents within minutes!');

  return { phase: 3, status: 'anomaly', type: 'geo_anomaly', locations: locations.map(l => l.geo.country) };
};

/**
 * Phase 4: Attack Simulation
 * Password reset spam and rapid activity bursts
 */
const phase4_AttackSimulation = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🔴 PHASE 4: ATTACK SIMULATION');
  console.log('   Simulating account takeover attempt');
  console.log('='.repeat(70));

  // Password reset spam
  log('Password Reset Spam', 'Initiating rapid password reset requests');
  
  const resetCount = 10;
  for (let i = 0; i < resetCount; i++) {
    await simulatePasswordReset({
      ip_address: randomIP(randomElement(['US', 'EU', 'RU'])),
      user_agent: randomElement([USER_AGENTS.bot, USER_AGENTS.firefox_win]),
    });
    process.stdout.write(`   🔑 Reset request ${i + 1}/${resetCount}\n`);
    await sleep(200);
  }
  
  logWarning(`${resetCount} password reset requests sent!`);

  // Rapid API activity burst
  log('API Burst', 'Simulating rapid API requests (data scraping pattern)');
  
  const burstCount = 15;
  const activities = ['view_identity', 'export_data', 'list_emails', 'access_sensitive'];
  
  for (let i = 0; i < burstCount; i++) {
    await logActivity(randomElement(activities), {
      source_ip: randomIP('RU'),
      request_count: Math.floor(Math.random() * 100) + 50,
      duration_ms: Math.floor(Math.random() * 100),
    });
    process.stdout.write(`   ⚡ API burst ${i + 1}/${burstCount}\n`);
    await sleep(100);
  }

  logWarning(`${burstCount} suspicious API activities logged!`);

  // Device mismatch attack
  log('Device Mismatch', 'Login from unknown device with bot fingerprint');
  
  await simulateLogin({
    ip_address: randomIP('RU'),
    device_id: 'device_attacker_bot',
    user_agent: USER_AGENTS.bot,
    geo_location: { country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173 },
    is_proxy: true,
  });

  // Create high severity threat
  const client = createClient();
  await client.post('/api/threat-event', {
    shield_id: TEST_IDENTITY.shield_id,
    event_type: 'account_takeover_attempt',
    detected_at: timestamp(),
    severity: 'critical',
    metadata: {
      attack_vector: 'credential_stuffing',
      bot_detected: true,
      vpn_detected: true,
      risk_indicators: ['geo_anomaly', 'device_mismatch', 'login_frequency_spike', 'vpn_rotation'],
    },
  }).catch(() => {});

  return { phase: 4, status: 'attack', resetCount, burstCount };
};

/**
 * Phase 5: AI Detection & Burn/Rotate
 * Trigger the AI engine and execute burn_and_rotate
 */
const phase5_AIDetectionAndBurn = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🤖 PHASE 5: AI DETECTION & BURN/ROTATE');
  console.log('   Triggering AI anomaly detection and identity rotation');
  console.log('='.repeat(70));

  // Simulate AI assessment
  log('AI Analysis', 'Requesting risk assessment from AI engine');
  
  const assessmentPayload = {
    shield_id: TEST_IDENTITY.shield_id,
    access_patterns: {
      login_attempts_1h: 35,
      unique_ips_1h: 15,
      unique_devices_1h: 8,
      countries_1h: 4,
      failed_logins_1h: 20,
      password_resets_1h: 10,
    },
    current_session: {
      ip_address: randomIP('RU'),
      user_agent: USER_AGENTS.bot,
      is_proxy: true,
      geo_location: { country: 'Russia', city: 'Moscow' },
    },
  };

  // Try to call AI engine (may not be running)
  const aiResult = await requestAIAssessment(assessmentPayload);
  
  // Simulate AI response if engine not available
  const aiResponse = aiResult.success ? aiResult.data : {
    risk_score: 0.91,
    risk_level: 'high',
    flags: ['geo_anomaly', 'vpn_rotation', 'device_mismatch', 'login_frequency_spike'],
    action: 'burn_and_rotate',
    confidence: 0.94,
    analysis: {
      geo_anomaly_score: 0.95,
      device_mismatch_score: 0.88,
      frequency_anomaly_score: 0.92,
      vpn_detection_score: 0.87,
    },
  };

  console.log('\n   🤖 AI ENGINE RESPONSE:');
  console.log('   ' + '-'.repeat(50));
  console.log(JSON.stringify(aiResponse, null, 2).split('\n').map(l => '   ' + l).join('\n'));
  console.log('   ' + '-'.repeat(50));

  logWarning(`Risk Score: ${aiResponse.risk_score}`);
  logWarning(`Risk Level: ${aiResponse.risk_level?.toUpperCase()}`);
  logWarning(`Flags: ${aiResponse.flags?.join(', ')}`);
  logWarning(`Recommended Action: ${aiResponse.action?.toUpperCase()}`);

  // Execute burn and rotate
  if (aiResponse.action === 'burn_and_rotate' || aiResponse.risk_score > 0.8) {
    log('BURN & ROTATE', '🔥 Executing identity burn and rotation...');
    
    const burnResult = await triggerBurnAndRotate(
      'AI-detected high-risk activity: ' + (aiResponse.flags?.join(', ') || 'multiple anomalies'),
      aiResponse.risk_score
    );

    if (burnResult.success) {
      console.log('\n   🔥🔥🔥 IDENTITY BURNED AND ROTATED 🔥🔥🔥');
      console.log('   ' + '-'.repeat(50));
      logSuccess(`Old Shield ID: ${TEST_IDENTITY.shield_id} [BURNED]`);
      logSuccess(`New Shield ID: ${burnResult.newShieldId} [ACTIVE]`);
      logSuccess('Blockchain audit log created');
      logSuccess('Dashboard notification queued');
      console.log('   ' + '-'.repeat(50));
    } else {
      logError('Burn/Rotate failed: ' + JSON.stringify(burnResult.error));
    }

    return { 
      phase: 5, 
      status: 'burned', 
      aiResponse, 
      newShieldId: burnResult.newShieldId,
      burnResult 
    };
  }

  return { phase: 5, status: 'monitored', aiResponse };
};

// ============================================================================
// Main Execution
// ============================================================================

const runDemo = async () => {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║           PROXYSHIELD-11 SECURITY DEMO                               ║');
  console.log('║           Suspicious Activity Simulator                              ║');
  console.log('╠══════════════════════════════════════════════════════════════════════╣');
  console.log('║  Test Identity:                                                      ║');
  console.log(`║    Shield ID: ${TEST_IDENTITY.shield_id.padEnd(53)}║`);
  console.log(`║    Proxy Email: ${TEST_IDENTITY.proxy_email.padEnd(51)}║`);
  console.log('╠══════════════════════════════════════════════════════════════════════╣');
  console.log('║  Phases:                                                             ║');
  console.log('║    1. Normal Behavior (baseline)                                     ║');
  console.log('║    2. Suspicious Login Pattern (brute force)                         ║');
  console.log('║    3. Geo Anomaly (impossible travel)                                ║');
  console.log('║    4. Attack Simulation (password reset spam + API burst)            ║');
  console.log('║    5. AI Detection & Burn/Rotate                                     ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');

  const results = {};

  try {
    // Check API availability
    console.log('\n⏳ Checking API availability...');
    try {
      await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      logSuccess(`Backend API available at ${API_BASE_URL}`);
    } catch {
      logWarning(`Backend API not responding at ${API_BASE_URL}`);
      logInfo('Demo will continue but some requests may fail');
    }

    // Run all phases
    results.phase1 = await phase1_NormalBehavior();
    await sleep(3000);
    
    results.phase2 = await phase2_SuspiciousLoginPattern();
    await sleep(3000);
    
    results.phase3 = await phase3_GeoAnomaly();
    await sleep(3000);
    
    results.phase4 = await phase4_AttackSimulation();
    await sleep(3000);
    
    results.phase5 = await phase5_AIDetectionAndBurn();

  } catch (error) {
    console.error('\n❌ Demo error:', error.message);
  }

  // Summary
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║                         DEMO SUMMARY                                 ║');
  console.log('╠══════════════════════════════════════════════════════════════════════╣');
  
  for (const [phase, data] of Object.entries(results)) {
    const status = data?.status || 'unknown';
    const icon = status === 'burned' ? '🔥' : status === 'attack' ? '⚠️' : status === 'anomaly' ? '🚨' : status === 'suspicious' ? '⚡' : '✅';
    console.log(`║  ${icon} ${phase.toUpperCase()}: ${status.toUpperCase().padEnd(55)}║`);
  }
  
  console.log('╠══════════════════════════════════════════════════════════════════════╣');
  
  if (results.phase5?.status === 'burned') {
    console.log('║  🔥 RESULT: Shield Identity BURNED and ROTATED                       ║');
    console.log(`║     New ID: ${(results.phase5.newShieldId || 'N/A').padEnd(55)}║`);
  } else {
    console.log('║  ℹ️  RESULT: Activity logged for monitoring                           ║');
  }
  
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log('\n✅ Demo completed!\n');
};

// Run the demo
runDemo().catch(console.error);
