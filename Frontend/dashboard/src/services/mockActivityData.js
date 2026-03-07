import { ActivityType } from '../types/activity';

export const mockShieldIdentities = [
  {
    _id: 'si1',
    user_id: 'user1',
    proxy_email: 'twitter@shieldmail.ai',
    proxy_phone: '+1 (555) 0101',
    browser_fingerprint: 'fp_twitter_001',
    creation_time: '2026-03-07T22:45:00Z',
    last_used: '2026-03-07T22:50:00Z',
    status: 'active',
    linked_services: ['Twitter'],
  },
  {
    _id: 'si2',
    user_id: 'user1',
    proxy_email: 'linkedin@shieldmail.ai',
    proxy_phone: '+1 (555) 0102',
    browser_fingerprint: 'fp_linkedin_001',
    creation_time: '2026-03-07T20:30:00Z',
    last_used: '2026-03-07T21:00:00Z',
    status: 'active',
    linked_services: ['LinkedIn'],
  },
  {
    _id: 'si3',
    user_id: 'user1',
    proxy_email: 'amazon@shieldmail.ai',
    proxy_phone: '+1 (555) 0103',
    browser_fingerprint: 'fp_amazon_001',
    creation_time: '2026-03-06T18:15:00Z',
    last_used: '2026-03-07T19:00:00Z',
    status: 'active',
    linked_services: ['Amazon'],
  },
  {
    _id: 'si4',
    user_id: 'user1',
    proxy_email: 'netflix@shieldmail.ai',
    proxy_phone: '+1 (555) 0104',
    browser_fingerprint: 'fp_netflix_001',
    creation_time: '2026-03-05T14:00:00Z',
    last_used: '2026-03-06T20:00:00Z',
    status: 'burned',
    linked_services: ['Netflix'],
  },
];

export const mockShieldAccesses = [
  {
    _id: 'sa1',
    shield_id: 'twitter@shieldmail.ai',
    timestamp: '2026-03-07T22:50:00Z',
    ip_address: '192.168.1.100',
    ip_country: 'United States',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 11',
    login_hour: 22,
    request_frequency: 5,
    is_proxy: false,
  },
  {
    _id: 'sa2',
    shield_id: 'linkedin@shieldmail.ai',
    timestamp: '2026-03-07T21:00:00Z',
    ip_address: '10.0.0.50',
    ip_country: 'United States',
    device_type: 'mobile',
    browser: 'Safari',
    os: 'iOS 17',
    login_hour: 21,
    request_frequency: 3,
    is_proxy: true,
  },
  {
    _id: 'sa3',
    shield_id: 'amazon@shieldmail.ai',
    timestamp: '2026-03-07T19:00:00Z',
    ip_address: '172.16.0.25',
    ip_country: 'Canada',
    device_type: 'desktop',
    browser: 'Firefox',
    os: 'macOS',
    login_hour: 19,
    request_frequency: 10,
    is_proxy: false,
  },
  {
    _id: 'sa4',
    shield_id: 'netflix@shieldmail.ai',
    timestamp: '2026-03-06T20:00:00Z',
    ip_address: '192.168.50.10',
    ip_country: 'United Kingdom',
    device_type: 'tablet',
    browser: 'Chrome',
    os: 'Android',
    login_hour: 20,
    request_frequency: 2,
    is_proxy: false,
  },
];

export const mockAILogs = [
  {
    _id: 'ai1',
    shield_id: {
      _id: 'si1',
      proxy_email: 'twitter@shieldmail.ai',
      linked_services: ['Twitter'],
    },
    action: 'Signup form detected',
    confidence: 0.98,
    timestamp: '2026-03-07T22:44:00Z',
    metadata: {
      form_url: 'https://twitter.com/signup',
      fields_detected: ['email', 'password', 'username'],
      action_taken: 'email_injected',
    },
  },
  {
    _id: 'ai2',
    shield_id: {
      _id: 'si2',
      proxy_email: 'linkedin@shieldmail.ai',
      linked_services: ['LinkedIn'],
    },
    action: 'Email injection successful',
    confidence: 0.99,
    timestamp: '2026-03-07T20:29:00Z',
    metadata: {
      form_url: 'https://linkedin.com/signup',
      email_injected: 'linkedin@shieldmail.ai',
    },
  },
  {
    _id: 'ai3',
    shield_id: {
      _id: 'si3',
      proxy_email: 'amazon@shieldmail.ai',
      linked_services: ['Amazon'],
    },
    action: 'Phishing attempt detected',
    confidence: 0.95,
    timestamp: '2026-03-06T17:30:00Z',
    metadata: {
      threat_type: 'fake_login_page',
      url: 'http://amaz0n-verify.com',
      action_taken: 'blocked',
    },
  },
  {
    _id: 'ai4',
    shield_id: {
      _id: 'si4',
      proxy_email: 'netflix@shieldmail.ai',
      linked_services: ['Netflix'],
    },
    action: 'Credential leak detected',
    confidence: 0.97,
    timestamp: '2026-03-05T13:45:00Z',
    metadata: {
      source: 'dark_web_monitor',
      leak_type: 'password_hash',
      action_taken: 'identity_burned',
    },
  },
];

export const getMockShieldIdentities = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockShieldIdentities;
};

export const getMockShieldAccesses = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockShieldAccesses;
};

export const getMockAILogs = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockAILogs;
};

export default { mockShieldIdentities, mockShieldAccesses, mockAILogs };
