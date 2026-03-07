import { AuditAction } from '../types/blockchain';

export const mockAuditLogs = [
  {
    _id: 'bl1',
    shield_id: {
      _id: '1',
      proxy_email: 'linkedin@shieldmail.ai',
      proxy_phone: '+1 (555) 0101',
      linked_services: ['LinkedIn'],
      status: 'burned',
    },
    action: AuditAction.BURN,
    timestamp: '2026-03-07T22:30:00Z',
    blockchain_hash: '0x72af8b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    metadata: {
      reason: 'Credential leak detected',
      ip_address: '192.168.1.100',
      threat_level: 'high',
    },
  },
  {
    _id: 'bl2',
    shield_id: {
      _id: '7',
      proxy_email: 'linkedin_new@shieldmail.ai',
      proxy_phone: '+1 (555) 0107',
      linked_services: ['LinkedIn'],
      status: 'active',
    },
    action: AuditAction.ROTATION,
    timestamp: '2026-03-07T22:30:05Z',
    blockchain_hash: '0xa912bc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0b',
    metadata: {
      reason: 'Auto-rotation after burn',
      old_shield_id: '1',
    },
  },
  {
    _id: 'bl3',
    shield_id: {
      _id: '2',
      proxy_email: 'amazon@shieldmail.ai',
      proxy_phone: '+1 (555) 0102',
      linked_services: ['Amazon'],
      status: 'active',
    },
    action: AuditAction.LOGIN_ATTEMPT,
    timestamp: '2026-03-07T20:15:00Z',
    blockchain_hash: '0xc34de5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    metadata: {
      ip_address: '10.0.0.50',
      location: 'New York, USA',
      device: 'Chrome on Windows',
      success: true,
    },
  },
  {
    _id: 'bl4',
    shield_id: {
      _id: '3',
      proxy_email: 'paypal@shieldmail.ai',
      proxy_phone: '+1 (555) 0103',
      linked_services: ['PayPal'],
      status: 'active',
    },
    action: AuditAction.COMMUNICATION_FILTERED,
    timestamp: '2026-03-07T18:45:00Z',
    blockchain_hash: '0xd45ef6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    metadata: {
      message_type: 'email',
      sender: 'security@paypa1-alert.com',
      reason: 'Phishing attempt blocked',
      trackers_removed: 3,
    },
  },
  {
    _id: 'bl5',
    shield_id: {
      _id: '4',
      proxy_email: 'google@shieldmail.ai',
      proxy_phone: '+1 (555) 0104',
      linked_services: ['Google'],
      status: 'active',
    },
    action: AuditAction.LOGIN_ATTEMPT,
    timestamp: '2026-03-07T16:00:00Z',
    blockchain_hash: '0xe56fa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
    metadata: {
      ip_address: '172.16.0.25',
      location: 'San Francisco, USA',
      device: 'Safari on macOS',
      success: true,
    },
  },
  {
    _id: 'bl6',
    shield_id: {
      _id: '5',
      proxy_email: 'facebook@shieldmail.ai',
      proxy_phone: '+1 (555) 0105',
      linked_services: ['Facebook'],
      status: 'burned',
    },
    action: AuditAction.BURN,
    timestamp: '2026-03-06T14:20:00Z',
    blockchain_hash: '0xf67ab8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
    metadata: {
      reason: 'Data breach detected',
      source: 'Dark web monitor',
    },
  },
  {
    _id: 'bl7',
    shield_id: {
      _id: '9',
      proxy_email: 'facebook_secure@shieldmail.ai',
      proxy_phone: '+1 (555) 0109',
      linked_services: ['Facebook'],
      status: 'active',
    },
    action: AuditAction.ROTATION,
    timestamp: '2026-03-06T14:20:05Z',
    blockchain_hash: '0x078bc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    metadata: {
      reason: 'Auto-rotation after burn',
      old_shield_id: '5',
    },
  },
  {
    _id: 'bl8',
    shield_id: {
      _id: '6',
      proxy_email: 'twitter@shieldmail.ai',
      proxy_phone: '+1 (555) 0106',
      linked_services: ['Twitter'],
      status: 'active',
    },
    action: AuditAction.LOGIN_ATTEMPT,
    timestamp: '2026-03-06T10:30:00Z',
    blockchain_hash: '0x189cd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    metadata: {
      ip_address: '192.168.50.10',
      location: 'Austin, USA',
      device: 'Firefox on Linux',
      success: true,
    },
  },
];

export const getMockAuditLogs = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockAuditLogs;
};

export default mockAuditLogs;
