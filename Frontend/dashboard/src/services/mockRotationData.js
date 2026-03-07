import { RotationType, RotationEventType } from '../types/rotation';

export const mockRotationLogs = [
  {
    _id: 'r1',
    shield_id: {
      _id: '1',
      proxy_email: 'linkedin@shieldmail.ai',
      proxy_phone: '+1 (555) 0101',
      linked_services: ['LinkedIn'],
      status: 'burned',
    },
    new_shield_id: {
      _id: '7',
      proxy_email: 'linkedin_new@shieldmail.ai',
      proxy_phone: '+1 (555) 0107',
      linked_services: ['LinkedIn'],
      status: 'active',
    },
    rotation_type: RotationType.AUTO,
    timestamp: '2026-03-07T23:24:00Z',
    reason: 'Credential leak detected',
  },
  {
    _id: 'r2',
    shield_id: {
      _id: '2',
      proxy_email: 'amazon@shieldmail.ai',
      proxy_phone: '+1 (555) 0102',
      linked_services: ['Amazon'],
      status: 'active',
    },
    new_shield_id: {
      _id: '8',
      proxy_email: 'amazon_v2@shieldmail.ai',
      proxy_phone: '+1 (555) 0108',
      linked_services: ['Amazon'],
      status: 'active',
    },
    rotation_type: RotationType.MANUAL,
    timestamp: '2026-03-07T18:30:00Z',
    reason: 'Scheduled rotation',
  },
  {
    _id: 'r3',
    shield_id: {
      _id: '3',
      proxy_email: 'facebook@shieldmail.ai',
      proxy_phone: '+1 (555) 0103',
      linked_services: ['Facebook'],
      status: 'burned',
    },
    new_shield_id: {
      _id: '9',
      proxy_email: 'facebook_secure@shieldmail.ai',
      proxy_phone: '+1 (555) 0109',
      linked_services: ['Facebook'],
      status: 'active',
    },
    rotation_type: RotationType.AUTO,
    timestamp: '2026-03-06T14:15:00Z',
    reason: 'Data breach detected',
  },
  {
    _id: 'r4',
    shield_id: {
      _id: '4',
      proxy_email: 'google@shieldmail.ai',
      proxy_phone: '+1 (555) 0104',
      linked_services: ['Google'],
      status: 'active',
    },
    new_shield_id: {
      _id: '10',
      proxy_email: 'google_backup@shieldmail.ai',
      proxy_phone: '+1 (555) 0110',
      linked_services: ['Google'],
      status: 'active',
    },
    rotation_type: RotationType.MANUAL,
    timestamp: '2026-03-05T09:00:00Z',
    reason: 'User requested rotation',
  },
  {
    _id: 'r5',
    shield_id: {
      _id: '5',
      proxy_email: 'twitter@shieldmail.ai',
      proxy_phone: '+1 (555) 0105',
      linked_services: ['Twitter'],
      status: 'burned',
    },
    new_shield_id: {
      _id: '11',
      proxy_email: 'twitter_new@shieldmail.ai',
      proxy_phone: '+1 (555) 0111',
      linked_services: ['Twitter'],
      status: 'active',
    },
    rotation_type: RotationType.AUTO,
    timestamp: '2026-03-04T22:45:00Z',
    reason: 'Unauthorized access attempt',
  },
  {
    _id: 'r6',
    shield_id: {
      _id: '6',
      proxy_email: 'paypal@shieldmail.ai',
      proxy_phone: '+1 (555) 0106',
      linked_services: ['PayPal'],
      status: 'active',
    },
    new_shield_id: {
      _id: '12',
      proxy_email: 'paypal_secure@shieldmail.ai',
      proxy_phone: '+1 (555) 0112',
      linked_services: ['PayPal'],
      status: 'active',
    },
    rotation_type: RotationType.MANUAL,
    timestamp: '2026-03-03T16:20:00Z',
    reason: 'Security upgrade',
  },
];

export const getMockRotationLogs = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockRotationLogs;
};

export default mockRotationLogs;
