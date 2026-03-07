import { DeviceType, AccountStatus } from '../types/settings';

export const mockUser = {
  _id: 'user1',
  firebase_uid: 'firebase_abc123',
  real_email: 'john.doe@example.com',
  real_phone: '+1 (555) 987-6543',
  devices: [
    {
      device_id: 'dev_001',
      device_name: 'MacBook Pro',
      device_type: DeviceType.DESKTOP,
      last_active: '2026-03-07T23:00:00Z',
      push_token: 'token_macbook_001',
    },
    {
      device_id: 'dev_002',
      device_name: 'iPhone 15 Pro',
      device_type: DeviceType.MOBILE,
      last_active: '2026-03-07T22:30:00Z',
      push_token: 'token_iphone_002',
    },
    {
      device_id: 'dev_003',
      device_name: 'iPad Pro',
      device_type: DeviceType.TABLET,
      last_active: '2026-03-06T18:00:00Z',
      push_token: 'token_ipad_003',
    },
  ],
  created_at: '2026-01-01T00:00:00Z',
  last_login: '2026-03-07T23:00:00Z',
  status: AccountStatus.ACTIVE,
};

export const getMockUser = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockUser;
};

export default mockUser;
