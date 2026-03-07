import { ThreatSeverity, ThreatEventType } from '../types/threatEvent';

export const mockThreatEvents = [
  {
    _id: 't1',
    shield_id: {
      _id: '1',
      website: 'Netflix',
      shieldEmail: 'netflix@shieldmail.ai',
      virtualPhone: '+1 (555) 0101',
    },
    event_type: ThreatEventType.CREDENTIAL_LEAK,
    detected_at: '2026-03-07T08:30:00Z',
    severity: ThreatSeverity.HIGH,
    metadata: {
      source: 'Dark Web Monitor',
      details: 'Credentials found in paste site dump',
      leakedFields: ['email', 'password_hash'],
    },
    status: 'active',
  },
  {
    _id: 't2',
    shield_id: {
      _id: '2',
      website: 'Amazon',
      shieldEmail: 'amazon@shieldmail.ai',
      virtualPhone: '+1 (555) 0102',
    },
    event_type: ThreatEventType.UNAUTHORIZED_IP,
    detected_at: '2026-03-07T07:15:00Z',
    severity: ThreatSeverity.MEDIUM,
    metadata: {
      source: 'Login Monitor',
      details: 'Login from unusual geographic location',
      ip: '192.168.1.100',
      location: 'Unknown',
    },
    status: 'investigating',
  },
  {
    _id: 't3',
    shield_id: {
      _id: '4',
      website: 'Google',
      shieldEmail: 'google@shieldmail.ai',
      virtualPhone: '+1 (555) 0104',
    },
    event_type: ThreatEventType.PHISHING_ATTEMPT,
    detected_at: '2026-03-06T22:00:00Z',
    severity: ThreatSeverity.HIGH,
    metadata: {
      source: 'Email Scanner',
      details: 'Phishing email detected with malicious link',
      sender: 'suspicious@fake-google.com',
    },
    status: 'resolved',
  },
  {
    _id: 't4',
    shield_id: {
      _id: '5',
      website: 'Twitter',
      shieldEmail: 'twitter@shieldmail.ai',
      virtualPhone: '+1 (555) 0105',
    },
    event_type: ThreatEventType.CREDENTIAL_LEAK,
    detected_at: '2026-03-06T14:30:00Z',
    severity: ThreatSeverity.LOW,
    metadata: {
      source: 'Breach Monitor',
      details: 'Email found in old breach database',
      breachDate: '2024-01-15',
    },
    status: 'active',
  },
  {
    _id: 't5',
    shield_id: {
      _id: '6',
      website: 'PayPal',
      shieldEmail: 'paypal@shieldmail.ai',
      virtualPhone: '+1 (555) 0106',
    },
    event_type: ThreatEventType.UNAUTHORIZED_IP,
    detected_at: '2026-03-05T18:45:00Z',
    severity: ThreatSeverity.HIGH,
    metadata: {
      source: 'Access Control',
      details: 'Multiple failed login attempts from botnet IP',
      ip: '10.0.0.1',
      attempts: 15,
    },
    status: 'active',
  },
  {
    _id: 't6',
    shield_id: {
      _id: '3',
      website: 'Facebook',
      shieldEmail: 'facebook@shieldmail.ai',
      virtualPhone: '+1 (555) 0103',
    },
    event_type: ThreatEventType.PHISHING_ATTEMPT,
    detected_at: '2026-03-04T10:00:00Z',
    severity: ThreatSeverity.MEDIUM,
    metadata: {
      source: 'Link Scanner',
      details: 'Suspicious redirect detected',
      url: 'http://fake-facebook-login.com',
    },
    status: 'resolved',
  },
];

export const getMockThreatEvents = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockThreatEvents;
};

export default mockThreatEvents;
