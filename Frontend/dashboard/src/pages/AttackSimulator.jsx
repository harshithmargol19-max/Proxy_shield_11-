import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield,
  Globe,
  Clock,
  Fingerprint,
  Flame,
  Activity
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const AI_ENGINE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

// ============================================================================
// Configuration (matching demo-suspicious-activity.js)
// ============================================================================

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
  TRUSTED: ['10.0.0.1'],
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

// Geo locations
const GEO_LOCATIONS = {
  US: { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
  EU: { country: 'Germany', city: 'Frankfurt', lat: 50.1109, lng: 8.6821 },
  ASIA: { country: 'Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  RU: { country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173 },
  BR: { country: 'Brazil', city: 'São Paulo', lat: -23.5505, lng: -46.6333 },
};

// Attack phase configurations
const ATTACK_PHASES = [
  {
    id: 'normal',
    name: 'Phase 1: Normal Behavior',
    description: 'Single login from trusted IP with consistent device fingerprint (baseline)',
    icon: CheckCircle2,
    color: 'green',
    severity: 'low',
    estimatedTime: '3s',
  },
  {
    id: 'brute_force',
    name: 'Phase 2: Suspicious Login Pattern',
    description: '20 rapid login attempts within 10 seconds (brute force pattern)',
    icon: Zap,
    color: 'yellow',
    severity: 'medium',
    estimatedTime: '12s',
  },
  {
    id: 'geo_anomaly',
    name: 'Phase 3: Geo Anomaly',
    description: 'Logins from 3 different VPN locations (impossible travel)',
    icon: Globe,
    color: 'orange',
    severity: 'high',
    estimatedTime: '8s',
  },
  {
    id: 'attack',
    name: 'Phase 4: Attack Simulation',
    description: 'Password reset spam + rapid API bursts + device mismatch',
    icon: AlertTriangle,
    color: 'red',
    severity: 'critical',
    estimatedTime: '15s',
  },
  {
    id: 'burn_rotate',
    name: 'Phase 5: AI Detection & Burn/Rotate',
    description: 'Trigger AI anomaly detection and execute identity burn_and_rotate',
    icon: Flame,
    color: 'purple',
    severity: 'critical',
    estimatedTime: '5s',
  },
];

// ============================================================================
// Utility Functions (matching demo script)
// ============================================================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomIP = (region = 'US') => randomElement(IP_POOLS[region] || IP_POOLS.US);
const generateFingerprint = () => Math.random().toString(36).substring(2, 15);
const timestamp = () => new Date().toISOString();

// ============================================================================
// API Request Functions (matching demo script)
// ============================================================================

const apiRequest = async (endpoint, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Simulate login attempt (POST /api/shield-access)
 */
const simulateLogin = async (options) => {
  const {
    shield_id,
    ip_address = randomIP('TRUSTED'),
    user_agent = USER_AGENTS.chrome_win,
    device_id = DEVICE_IDS.trusted,
    geo_location = GEO_LOCATIONS.US,
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
    ip_country: geo_location.country || 'Unknown',
    geo_location,
    is_proxy,
    login_hour: new Date().getHours(),
    request_frequency: 1,
  };

  return apiRequest('/shield-access', payload);
};

/**
 * Log threat event (POST /api/threat-event)
 */
const logThreatEvent = async (shield_id, event_type, severity, metadata = {}) => {
  return apiRequest('/threat-event', {
    shield_id,
    event_type,
    detected_at: timestamp(),
    severity,
    metadata,
  });
};

/**
 * Log AI activity (POST /api/ai-log)
 */
const logAIActivity = async (shield_id, action, metadata = {}) => {
  return apiRequest('/ai-log', {
    shield_id,
    action,
    timestamp: timestamp(),
    confidence: Math.random() * 0.5 + 0.5,
    metadata,
  });
};

/**
 * Request AI risk assessment (POST to AI Engine)
 */
const requestAIAssessment = async (accessData) => {
  try {
    const response = await fetch(`${AI_ENGINE_URL}/analyze/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accessData),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    // Return simulated AI response if engine not available
    return {
      success: true,
      simulated: true,
      data: {
        risk_score: 0.91,
        risk_level: 'high',
        flags: ['geo_anomaly', 'vpn_rotation', 'device_mismatch', 'login_frequency_spike'],
        action: 'burn_and_rotate',
        confidence: 0.94,
      },
    };
  }
};

/**
 * Trigger burn and rotate (POST /api/identity-rotation + /api/audit-log)
 */
const triggerBurnAndRotate = async (shield_id, reason, riskScore = 0.91) => {
  const newShieldId = `shield_rotated_${Date.now()}`;
  const blockchainHash = `0x${generateFingerprint()}${generateFingerprint()}`;

  // Create rotation record
  await apiRequest('/identity-rotation', {
    shield_id,
    rotation_type: 'auto',
    timestamp: timestamp(),
    reason,
    new_shield_id: newShieldId,
  });

  // Update shield identity status
  await fetch(`${API_BASE_URL}/shield-identity/${shield_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'burned' }),
  }).catch(() => {});

  // Create audit log with blockchain hash
  await apiRequest('/audit-log', {
    shield_id,
    action: 'burn',
    timestamp: timestamp(),
    blockchain_hash: blockchainHash,
    metadata: {
      reason,
      risk_score: riskScore,
      new_shield_id: newShieldId,
    },
  });

  return { newShieldId, blockchainHash };
};

// ============================================================================
// React Component
// ============================================================================

const AttackSimulator = () => {
  const [identities, setIdentities] = useState([]);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [email, setEmail] = useState('');
  const [shieldId, setShieldId] = useState('');
  const [selectedPhases, setSelectedPhases] = useState(['normal']);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [results, setResults] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingIdentities, setLoadingIdentities] = useState(true);
  const abortRef = useRef(false);
  const logContainerRef = useRef(null);

  // Load identities from backend
  useEffect(() => {
    const fetchIdentities = async () => {
      try {
        setLoadingIdentities(true);
        const response = await fetch(`${API_BASE_URL}/shield-identity`);
        const data = await response.json();
        const identityList = data.data || data || [];
        setIdentities(identityList);
        // Auto-select first identity if available
        if (identityList.length > 0) {
          const first = identityList[0];
          setSelectedIdentity(first);
          setShieldId(first._id);
          setEmail(first.proxy_email);
        }
      } catch (err) {
        console.error('Failed to load identities:', err);
      } finally {
        setLoadingIdentities(false);
      }
    };
    fetchIdentities();
  }, []);

  // Update form when identity selected
  const handleIdentitySelect = (identityId) => {
    const identity = identities.find(i => i._id === identityId);
    if (identity) {
      setSelectedIdentity(identity);
      setShieldId(identity._id);
      setEmail(identity.proxy_email);
    }
  };

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, message, type }]);
  }, []);

  const togglePhase = (phaseId) => {
    setSelectedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(p => p !== phaseId)
        : [...prev, phaseId]
    );
  };

  const selectAllPhases = () => setSelectedPhases(ATTACK_PHASES.map(p => p.id));
  const clearPhases = () => setSelectedPhases([]);

  const resetSimulator = () => {
    setResults([]);
    setLogs([]);
    setCurrentPhase(null);
    setIsRunning(false);
    setAiResponse(null);
  };

  const stopSimulation = () => {
    abortRef.current = true;
    setIsRunning(false);
    setCurrentPhase(null);
    addLog('⛔ Simulation stopped by user', 'warning');
  };

  // ===========================================================================
  // Phase Implementations (matching demo-suspicious-activity.js)
  // ===========================================================================

  /**
   * Phase 1: Normal Behavior
   */
  const runPhase1_NormalBehavior = async (shield_id) => {
    addLog('═'.repeat(60), 'info');
    addLog('📗 PHASE 1: NORMAL BEHAVIOR', 'info');
    addLog('   Simulating legitimate user activity', 'info');
    addLog('═'.repeat(60), 'info');

    addLog('🔐 Single login from trusted IP with consistent device', 'info');
    
    const result = await simulateLogin({
      shield_id,
      ip_address: IP_POOLS.TRUSTED[0],
      device_id: DEVICE_IDS.trusted,
      user_agent: USER_AGENTS.chrome_win,
      geo_location: GEO_LOCATIONS.US,
      is_proxy: false,
    });

    if (result.success) {
      addLog(`✅ Normal login successful`, 'success');
      addLog(`   IP: ${IP_POOLS.TRUSTED[0]}`, 'info');
      addLog(`   Device: ${DEVICE_IDS.trusted}`, 'info');
    } else {
      addLog(`⚠️ Login endpoint: ${result.error || 'Recorded'}`, 'warning');
    }

    await sleep(2000);

    // Normal browsing activity
    addLog('📊 Normal browsing activity', 'info');
    await logAIActivity(shield_id, 'normal_browse', { page: '/dashboard', duration: 45 });
    addLog('✅ Activity logged', 'success');

    return { phase: 'normal', status: 'success', loginCount: 1 };
  };

  /**
   * Phase 2: Suspicious Login Pattern (Brute Force)
   */
  const runPhase2_SuspiciousLogin = async (shield_id) => {
    addLog('═'.repeat(60), 'info');
    addLog('📙 PHASE 2: SUSPICIOUS LOGIN PATTERN', 'warning');
    addLog('   Simulating rapid login attempts (brute force pattern)', 'info');
    addLog('═'.repeat(60), 'info');

    const loginCount = 20;
    let successCount = 0;

    addLog(`⚡ Initiating ${loginCount} rapid login attempts...`, 'warning');

    for (let i = 0; i < loginCount; i++) {
      if (abortRef.current) break;

      const ip = randomIP('US');
      const result = await simulateLogin({
        shield_id,
        ip_address: ip,
        device_id: randomElement(DEVICE_IDS.suspicious),
        user_agent: randomElement(Object.values(USER_AGENTS)),
      });

      if (result.success) successCount++;
      addLog(`🔄 Attempt ${i + 1}/${loginCount} - IP: ${ip}`, 'info');

      await sleep(Math.random() * 500 + 100);
    }

    addLog(`⚠️ Completed ${loginCount} login attempts in rapid succession`, 'warning');
    addLog(`   Success: ${successCount}, Recorded: ${loginCount - successCount}`, 'info');

    // Log threat event for brute force
    await logThreatEvent(shield_id, 'brute_force_detected', 'high', {
      attempts: loginCount,
      time_window_seconds: 10,
      pattern: 'credential_stuffing',
    });

    return { phase: 'brute_force', status: 'success', loginCount, pattern: 'brute_force' };
  };

  /**
   * Phase 3: Geo Anomaly (Impossible Travel)
   */
  const runPhase3_GeoAnomaly = async (shield_id) => {
    addLog('═'.repeat(60), 'info');
    addLog('📕 PHASE 3: GEO ANOMALY', 'error');
    addLog('   Simulating impossible travel - logins from multiple countries', 'info');
    addLog('═'.repeat(60), 'info');

    const locations = [
      { proxy: PROXY_SERVERS[0], region: 'US', geo: GEO_LOCATIONS.US },
      { proxy: PROXY_SERVERS[1], region: 'EU', geo: GEO_LOCATIONS.EU },
      { proxy: PROXY_SERVERS[2], region: 'ASIA', geo: GEO_LOCATIONS.ASIA },
    ];

    for (const loc of locations) {
      if (abortRef.current) break;

      addLog(`🌍 VPN Login from ${loc.geo.country} (${loc.geo.city})`, 'warning');

      await simulateLogin({
        shield_id,
        ip_address: randomIP(loc.region),
        device_id: DEVICE_IDS.trusted, // Same device, different locations!
        user_agent: USER_AGENTS.chrome_win,
        geo_location: loc.geo,
        is_proxy: true,
      });

      addLog(`   ✅ Logged from ${loc.geo.city}`, 'success');
      addLog(`   📡 Via Proxy: ${loc.proxy.url}`, 'info');

      // Create threat event for geo anomaly
      await logThreatEvent(shield_id, 'geo_anomaly', 'high', {
        previous_location: locations[0].geo,
        current_location: loc.geo,
        time_difference_minutes: 5,
        is_impossible_travel: true,
      });

      await sleep(2000);
    }

    addLog('🚨 IMPOSSIBLE TRAVEL DETECTED: User logged in from 3 continents within minutes!', 'error');

    return { phase: 'geo_anomaly', status: 'anomaly', type: 'geo_anomaly', locations: locations.map(l => l.geo.country) };
  };

  /**
   * Phase 4: Attack Simulation
   */
  const runPhase4_AttackSimulation = async (shield_id, proxy_email) => {
    addLog('═'.repeat(60), 'info');
    addLog('🔴 PHASE 4: ATTACK SIMULATION', 'error');
    addLog('   Simulating account takeover attempt', 'info');
    addLog('═'.repeat(60), 'info');

    // Password reset spam
    addLog('🔑 Initiating rapid password reset requests', 'warning');
    const resetCount = 10;

    for (let i = 0; i < resetCount; i++) {
      if (abortRef.current) break;

      await logThreatEvent(shield_id, 'password_reset_request', 'low', {
        ip_address: randomIP(randomElement(['US', 'EU', 'RU'])),
        user_agent: randomElement([USER_AGENTS.bot, USER_AGENTS.firefox_win]),
        email: proxy_email,
      });
      addLog(`   🔑 Reset request ${i + 1}/${resetCount}`, 'info');
      await sleep(200);
    }

    addLog(`⚠️ ${resetCount} password reset requests sent!`, 'warning');

    // Rapid API activity burst
    addLog('⚡ Simulating rapid API requests (data scraping pattern)', 'warning');
    const burstCount = 15;
    const activities = ['view_identity', 'export_data', 'list_emails', 'access_sensitive'];

    for (let i = 0; i < burstCount; i++) {
      if (abortRef.current) break;

      await logAIActivity(shield_id, randomElement(activities), {
        source_ip: randomIP('RU'),
        request_count: Math.floor(Math.random() * 100) + 50,
        duration_ms: Math.floor(Math.random() * 100),
      });
      addLog(`   ⚡ API burst ${i + 1}/${burstCount}`, 'info');
      await sleep(100);
    }

    addLog(`⚠️ ${burstCount} suspicious API activities logged!`, 'warning');

    // Device mismatch attack
    addLog('🤖 Login from unknown device with bot fingerprint', 'error');

    await simulateLogin({
      shield_id,
      ip_address: randomIP('RU'),
      device_id: 'device_attacker_bot',
      user_agent: USER_AGENTS.bot,
      geo_location: GEO_LOCATIONS.RU,
      is_proxy: true,
    });

    // Create high severity threat
    await logThreatEvent(shield_id, 'account_takeover_attempt', 'critical', {
      attack_vector: 'credential_stuffing',
      bot_detected: true,
      vpn_detected: true,
      risk_indicators: ['geo_anomaly', 'device_mismatch', 'login_frequency_spike', 'vpn_rotation'],
    });

    return { phase: 'attack', status: 'attack', resetCount, burstCount };
  };

  /**
   * Phase 5: AI Detection & Burn/Rotate
   */
  const runPhase5_AIDetectionAndBurn = async (shield_id) => {
    addLog('═'.repeat(60), 'info');
    addLog('🤖 PHASE 5: AI DETECTION & BURN/ROTATE', 'error');
    addLog('   Triggering AI anomaly detection and identity rotation', 'info');
    addLog('═'.repeat(60), 'info');

    // Simulate AI assessment
    addLog('🔍 Requesting risk assessment from AI engine...', 'info');

    const assessmentPayload = {
      shield_id,
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
        geo_location: GEO_LOCATIONS.RU,
      },
    };

    const aiResult = await requestAIAssessment(assessmentPayload);
    const response = aiResult.data;

    setAiResponse(response);

    addLog('', 'info');
    addLog('🤖 AI ENGINE RESPONSE:', 'warning');
    addLog('─'.repeat(50), 'info');
    addLog(`   Risk Score: ${response.risk_score}`, 'error');
    addLog(`   Risk Level: ${response.risk_level?.toUpperCase()}`, 'error');
    addLog(`   Flags: ${response.flags?.join(', ')}`, 'warning');
    addLog(`   Recommended Action: ${response.action?.toUpperCase()}`, 'error');
    addLog('─'.repeat(50), 'info');

    // Execute burn and rotate
    if (response.action === 'burn_and_rotate' || response.risk_score > 0.8) {
      addLog('🔥 Executing identity burn and rotation...', 'error');

      const burnResult = await triggerBurnAndRotate(
        shield_id,
        'AI-detected high-risk activity: ' + (response.flags?.join(', ') || 'multiple anomalies'),
        response.risk_score
      );

      addLog('', 'info');
      addLog('🔥🔥🔥 IDENTITY BURNED AND ROTATED 🔥🔥🔥', 'error');
      addLog('─'.repeat(50), 'info');
      addLog(`   ❌ Old Shield ID: ${shield_id} [BURNED]`, 'error');
      addLog(`   ✅ New Shield ID: ${burnResult.newShieldId} [ACTIVE]`, 'success');
      addLog(`   📋 Blockchain hash: ${burnResult.blockchainHash}`, 'success');
      addLog('   ✅ Dashboard notification queued', 'success');
      addLog('─'.repeat(50), 'info');

      return {
        phase: 'burn_rotate',
        status: 'burned',
        aiResponse: response,
        newShieldId: burnResult.newShieldId,
        blockchainHash: burnResult.blockchainHash,
      };
    }

    return { phase: 'burn_rotate', status: 'monitored', aiResponse: response };
  };

  // ===========================================================================
  // Main Simulation Runner
  // ===========================================================================

  const runSimulation = async () => {
    if (!shieldId && !email) {
      addLog('❌ Please select an identity or enter Shield ID', 'error');
      return;
    }

    if (selectedPhases.length === 0) {
      addLog('❌ Please select at least one phase', 'error');
      return;
    }

    setIsRunning(true);
    setResults([]);
    setLogs([]);
    setAiResponse(null);
    abortRef.current = false;

    const testShieldId = shieldId || `shield_${email.split('@')[0]}_${Date.now()}`;
    const testEmail = email || `${testShieldId}@proxyshield.io`;

    // Determine real email if selecting from existing identities
    const realEmail = selectedIdentity?.proxy_email?.includes('+shield_') 
      ? selectedIdentity.proxy_email.split('+')[0] + '@' + selectedIdentity.proxy_email.split('@')[1]
      : 'N/A (not using email forwarding)';

    // Header
    addLog('╔══════════════════════════════════════════════════════════════════════╗', 'info');
    addLog('║           PROXYSHIELD-11 SECURITY DEMO                               ║', 'info');
    addLog('║           Suspicious Activity Simulator                              ║', 'info');
    addLog('╠══════════════════════════════════════════════════════════════════════╣', 'info');
    addLog(`║  Shield ID: ${testShieldId}`, 'info');
    addLog(`║  Proxy Email: ${testEmail}`, 'info');
    if (selectedIdentity?.proxy_email?.includes('+shield_')) {
      addLog(`║  Real Email: ${realEmail} (protected by proxy)`, 'success');
      addLog(`║  Website: ${selectedIdentity?.website || selectedIdentity?.linked_services || 'N/A'}`, 'info');
    }
    addLog('╠══════════════════════════════════════════════════════════════════════╣', 'info');
    addLog(`║  Selected Phases: ${selectedPhases.join(', ')}`, 'info');
    addLog('╚══════════════════════════════════════════════════════════════════════╝', 'info');

    // Check API availability
    addLog('', 'info');
    addLog('⏳ Checking API availability...', 'info');
    try {
      const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      if (healthResponse.ok) {
        addLog(`✅ Backend API available`, 'success');
      } else {
        addLog(`⚠️ Backend API returned ${healthResponse.status}`, 'warning');
      }
    } catch {
      addLog('⚠️ Backend API not responding - demo will continue but some requests may fail', 'warning');
    }

    const phaseResults = {};

    try {
      // Run selected phases
      for (const phaseId of selectedPhases) {
        if (abortRef.current) break;

        setCurrentPhase(phaseId);
        let result;

        switch (phaseId) {
          case 'normal':
            result = await runPhase1_NormalBehavior(testShieldId);
            break;
          case 'brute_force':
            result = await runPhase2_SuspiciousLogin(testShieldId);
            break;
          case 'geo_anomaly':
            result = await runPhase3_GeoAnomaly(testShieldId);
            break;
          case 'attack':
            result = await runPhase4_AttackSimulation(testShieldId, testEmail);
            break;
          case 'burn_rotate':
            result = await runPhase5_AIDetectionAndBurn(testShieldId);
            break;
          default:
            result = { phase: phaseId, status: 'unknown' };
        }

        phaseResults[phaseId] = result;
        setResults(prev => [...prev, result]);

        await sleep(3000);
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    }

    // Summary
    addLog('', 'info');
    addLog('╔══════════════════════════════════════════════════════════════════════╗', 'info');
    addLog('║                         DEMO SUMMARY                                 ║', 'info');
    addLog('╠══════════════════════════════════════════════════════════════════════╣', 'info');

    for (const [phase, data] of Object.entries(phaseResults)) {
      const status = data?.status || 'unknown';
      const icon = status === 'burned' ? '🔥' : status === 'attack' ? '⚠️' : status === 'anomaly' ? '🚨' : status === 'success' ? '✅' : '⚡';
      addLog(`║  ${icon} ${phase.toUpperCase()}: ${status.toUpperCase()}`, 'info');
    }

    addLog('╠══════════════════════════════════════════════════════════════════════╣', 'info');

    if (phaseResults.burn_rotate?.status === 'burned') {
      addLog('║  🔥 RESULT: Shield Identity BURNED and ROTATED', 'error');
      addLog(`║     New ID: ${phaseResults.burn_rotate.newShieldId || 'N/A'}`, 'success');
      if (selectedIdentity?.proxy_email?.includes('+shield_')) {
        const realEmail = selectedIdentity.proxy_email.split('+')[0] + '@' + selectedIdentity.proxy_email.split('@')[1];
        addLog(`║  🛡️  Your real email (${realEmail}) remains PROTECTED`, 'success');
        addLog(`║     Only the proxy identity was exposed and burned`, 'success');
      }
      // Reload identities to reflect burned status
      try {
        const response = await fetch(`${API_BASE_URL}/shield-identity`);
        const data = await response.json();
        setIdentities(data.data || data || []);
      } catch (e) {
        console.error('Failed to reload identities:', e);
      }
    } else {
      addLog('║  ℹ️  RESULT: Activity logged for monitoring', 'info');
    }

    addLog('╚══════════════════════════════════════════════════════════════════════╝', 'info');
    addLog('', 'info');
    addLog('✅ Demo completed!', 'success');
    addLog('', 'info');
    addLog('📊 View activity logs in Identity Control Center → Click on identity → Activity Log', 'info');

    setIsRunning(false);
    setCurrentPhase(null);
  };

  // ===========================================================================
  // UI Helpers
  // ===========================================================================

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 border-green-300 text-green-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      red: 'bg-red-100 border-red-300 text-red-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
    };
    return colors[color] || colors.green;
  };

  const getLogTypeClasses = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-10 h-10 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Attack Simulator</h1>
                <p className="text-sm text-gray-500">Test AI anomaly detection and burn/rotate workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetSimulator}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Identity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Target Identity
              </h2>
              
              {/* Identity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Existing Identity
                </label>
                {loadingIdentities ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" />
                    Loading identities...
                  </div>
                ) : identities.length > 0 ? (
                  <select
                    value={selectedIdentity?._id || ''}
                    onChange={(e) => handleIdentitySelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isRunning}
                  >
                    <option value="">-- Select an identity --</option>
                    {identities.map((identity) => (
                      <option key={identity._id} value={identity._id}>
                        {identity.website || identity.linked_services || 'Unknown'} - {identity.proxy_email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-500">No identities found. Create one first in Identity Control Center.</p>
                )}
              </div>

              {/* Selected Identity Details */}
              {selectedIdentity && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="text-sm font-medium text-indigo-800 mb-2">Selected Identity Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-indigo-600">Website:</span>
                      <span className="ml-2 text-indigo-900 font-medium">{selectedIdentity.website || selectedIdentity.linked_services || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-indigo-600">Status:</span>
                      <span className={`ml-2 font-medium ${selectedIdentity.status === 'active' ? 'text-green-600' : selectedIdentity.status === 'burned' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {selectedIdentity.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-indigo-600">Proxy Email:</span>
                      <span className="ml-2 text-indigo-900 font-mono text-xs">{selectedIdentity.proxy_email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-indigo-600">Shield ID:</span>
                      <span className="ml-2 text-indigo-900 font-mono text-xs">{selectedIdentity._id}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proxy Email (target)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shield ID (target)
                  </label>
                  <input
                    type="text"
                    value={shieldId}
                    onChange={(e) => setShieldId(e.target.value)}
                    placeholder="shield_demo_001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isRunning}
                  />
                </div>
              </div>
            </div>

            {/* Phase Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Attack Phases
                </h2>
                <div className="flex gap-2">
                  <button onClick={selectAllPhases} className="text-sm text-indigo-600 hover:text-indigo-800" disabled={isRunning}>
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={clearPhases} className="text-sm text-gray-600 hover:text-gray-800" disabled={isRunning}>
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {ATTACK_PHASES.map((phase) => {
                  const Icon = phase.icon;
                  const isSelected = selectedPhases.includes(phase.id);
                  const isActive = currentPhase === phase.id;
                  
                  return (
                    <div
                      key={phase.id}
                      onClick={() => !isRunning && togglePhase(phase.id)}
                      className={`
                        relative p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected ? `${getColorClasses(phase.color)} border-opacity-100` : 'bg-gray-50 border-gray-200 hover:border-gray-300'}
                        ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                        ${isRunning ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-50' : 'bg-gray-100'}`}>
                          <Icon className={`w-6 h-6 ${isSelected ? '' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{phase.name}</h3>
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full
                              ${phase.severity === 'low' ? 'bg-green-200 text-green-800' : ''}
                              ${phase.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : ''}
                              ${phase.severity === 'high' ? 'bg-orange-200 text-orange-800' : ''}
                              ${phase.severity === 'critical' ? 'bg-red-200 text-red-800' : ''}
                            `}>
                              {phase.severity}
                            </span>
                          </div>
                          <p className="text-sm opacity-75 mt-1">{phase.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                            <Clock className="w-3 h-3" />
                            <span>Est. {phase.estimatedTime}</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          disabled={isRunning}
                        />
                      </div>
                      {isActive && (
                        <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" />
                            <span className="text-sm font-medium text-indigo-600">Running...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex justify-center">
              {isRunning ? (
                <button
                  onClick={stopSimulation}
                  className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Stop Simulation
                </button>
              ) : (
                <button
                  onClick={runSimulation}
                  disabled={selectedPhases.length === 0 || (!email && !shieldId)}
                  className={`
                    flex items-center gap-2 px-8 py-3 rounded-lg transition-colors
                    ${selectedPhases.length > 0 && (email || shieldId)
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <Play className="w-5 h-5" />
                  Run Attack Simulation
                </button>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* AI Response */}
            {aiResponse && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  AI Detection Result
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Score</span>
                    <span className={`text-2xl font-bold ${aiResponse.risk_score > 0.7 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {(aiResponse.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Level</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      aiResponse.risk_level === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {aiResponse.risk_level?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Action</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      aiResponse.action === 'burn_and_rotate' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {aiResponse.action?.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Flags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiResponse.flags?.map((flag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Phase Results
              </h2>
              {results.length === 0 ? (
                <p className="text-gray-500 text-sm">No results yet. Run a simulation to see results.</p>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => {
                    const phase = ATTACK_PHASES.find(p => p.id === result.phase);
                    const isBurned = result.status === 'burned';
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${isBurned ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{phase?.name || result.phase}</span>
                          {isBurned ? <XCircle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          Status: {result.status}
                          {result.newShieldId && <div>New ID: {result.newShieldId}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Console Log */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-4">
              <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Console Log
              </h2>
              <div 
                ref={logContainerRef}
                className="h-96 overflow-y-auto font-mono text-xs space-y-0.5"
              >
                {logs.length === 0 ? (
                  <p className="text-gray-500">Waiting for simulation...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={`${getLogTypeClasses(log.type)} whitespace-pre-wrap`}>
                      {log.message.startsWith('╔') || log.message.startsWith('║') || log.message.startsWith('╠') || log.message.startsWith('╚') || log.message.startsWith('═') || log.message.startsWith('─')
                        ? log.message
                        : `[${log.time}] ${log.message}`
                      }
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttackSimulator;
