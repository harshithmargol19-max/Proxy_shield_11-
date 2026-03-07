import { IdentityStatus } from '../types/identity';

export const mockIdentities = [
  {
    id: '1',
    website: 'Netflix',
    shieldEmail: 'netflix@shieldmail.ai',
    virtualPhone: '+1 (555) 0101',
    creationDate: '2026-01-15T10:30:00Z',
    status: IdentityStatus.ACTIVE,
    lastActivity: '2h ago',
    logs: [
      { id: '1a', timestamp: '2026-03-07T08:00:00Z', action: 'Login', details: 'Successful login from Chrome' },
      { id: '1b', timestamp: '2026-03-06T14:30:00Z', action: 'Password Reset', details: 'Password reset requested' },
    ],
  },
  {
    id: '2',
    website: 'Amazon',
    shieldEmail: 'amazon@shieldmail.ai',
    virtualPhone: '+1 (555) 0102',
    creationDate: '2026-02-01T08:15:00Z',
    status: IdentityStatus.SUSPICIOUS,
    lastActivity: '1h ago',
    logs: [
      { id: '2a', timestamp: '2026-03-07T09:00:00Z', action: 'Unusual Location', details: 'Login attempt from unknown IP' },
      { id: '2b', timestamp: '2026-03-05T11:00:00Z', action: 'Purchase', details: 'Order #12345 placed' },
    ],
  },
  {
    id: '3',
    website: 'Facebook',
    shieldEmail: 'facebook@shieldmail.ai',
    virtualPhone: '+1 (555) 0103',
    creationDate: '2025-12-10T16:45:00Z',
    status: IdentityStatus.BURNED,
    lastActivity: '3d ago',
    logs: [
      { id: '3a', timestamp: '2026-03-04T20:00:00Z', action: 'Compromised', details: 'Data breach detected' },
      { id: '3b', timestamp: '2026-03-04T20:05:00Z', action: 'Burned', details: 'Identity automatically burned' },
    ],
  },
  {
    id: '4',
    website: 'Google',
    shieldEmail: 'google@shieldmail.ai',
    virtualPhone: '+1 (555) 0104',
    creationDate: '2026-02-20T12:00:00Z',
    status: IdentityStatus.ACTIVE,
    lastActivity: '30m ago',
    logs: [
      { id: '4a', timestamp: '2026-03-07T09:30:00Z', action: 'Login', details: 'Successful 2FA authentication' },
    ],
  },
  {
    id: '5',
    website: 'Twitter',
    shieldEmail: 'twitter@shieldmail.ai',
    virtualPhone: '+1 (555) 0105',
    creationDate: '2026-01-05T09:00:00Z',
    status: IdentityStatus.ACTIVE,
    lastActivity: '5h ago',
    logs: [
      { id: '5a', timestamp: '2026-03-07T05:00:00Z', action: 'Post', details: 'Tweet posted' },
    ],
  },
  {
    id: '6',
    website: 'PayPal',
    shieldEmail: 'paypal@shieldmail.ai',
    virtualPhone: '+1 (555) 0106',
    creationDate: '2026-03-01T14:30:00Z',
    status: IdentityStatus.SUSPICIOUS,
    lastActivity: '4h ago',
    logs: [
      { id: '6a', timestamp: '2026-03-07T06:00:00Z', action: 'Failed Login', details: 'Multiple failed attempts detected' },
    ],
  },
];

export const getMockIdentities = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockIdentities;
};

export default mockIdentities;
