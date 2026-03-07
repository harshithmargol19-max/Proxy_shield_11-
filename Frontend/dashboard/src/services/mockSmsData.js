import { MessageType, MessageStatus } from '../types/sms';

export const mockMessages = [
  {
    _id: 'm1',
    shield_id: {
      _id: '1',
      proxy_email: 'amazon@shieldmail.ai',
      proxy_phone: '+1 (555) 0101',
      linked_services: ['Amazon'],
    },
    type: MessageType.EMAIL,
    sender: 'orders@amazon.com',
    recipient: 'amazon@shieldmail.ai',
    received_at: '2026-03-07T22:42:00Z',
    delivered_at: '2026-03-07T22:42:05Z',
    status: MessageStatus.DELIVERED,
    sanitized_content: 'Order Confirmation #12345\n\nYour order has been shipped. Track at: https://amazon.com/track/12345',
  },
  {
    _id: 'm2',
    shield_id: {
      _id: '2',
      proxy_email: 'netflix@shieldmail.ai',
      proxy_phone: '+1 (555) 0102',
      linked_services: ['Netflix'],
    },
    type: MessageType.EMAIL,
    sender: 'info@netflix.com',
    recipient: 'netflix@shieldmail.ai',
    received_at: '2026-03-07T20:15:00Z',
    delivered_at: '2026-03-07T20:15:03Z',
    status: MessageStatus.DELIVERED,
    sanitized_content: 'Your subscription has been renewed.\n\nNext billing date: April 7, 2026\nAmount: $15.99',
  },
  {
    _id: 'm3',
    shield_id: {
      _id: '3',
      proxy_email: 'paypal@shieldmail.ai',
      proxy_phone: '+1 (555) 0103',
      linked_services: ['PayPal'],
    },
    type: MessageType.EMAIL,
    sender: 'security@paypa1-alert.com',
    recipient: 'paypal@shieldmail.ai',
    received_at: '2026-03-07T18:30:00Z',
    delivered_at: null,
    status: MessageStatus.BLOCKED,
    sanitized_content: 'URGENT: Your account has been compromised! Click here to verify: http://fake-paypal.com/verify',
  },
  {
    _id: 'm4',
    shield_id: {
      _id: '4',
      proxy_email: 'google@shieldmail.ai',
      proxy_phone: '+1 (555) 0104',
      linked_services: ['Google'],
    },
    type: MessageType.SMS,
    sender: '+1-800-GOOGLE',
    recipient: '+1 (555) 0104',
    received_at: '2026-03-07T16:00:00Z',
    delivered_at: '2026-03-07T16:00:02Z',
    status: MessageStatus.DELIVERED,
    sanitized_content: 'Your Google verification code is: 847291',
  },
  {
    _id: 'm5',
    shield_id: {
      _id: '5',
      proxy_email: 'facebook@shieldmail.ai',
      proxy_phone: '+1 (555) 0105',
      linked_services: ['Facebook'],
    },
    type: MessageType.EMAIL,
    sender: 'notify@facebook.com',
    recipient: 'facebook@shieldmail.ai',
    received_at: '2026-03-07T14:20:00Z',
    delivered_at: '2026-03-07T14:20:04Z',
    status: MessageStatus.FILTERED,
    sanitized_content: 'New login detected from Chrome on Windows.\n\nLocation: New York, USA\nTime: 2:20 PM\n\nTrackers removed: 3',
  },
  {
    _id: 'm6',
    shield_id: {
      _id: '6',
      proxy_email: 'twitter@shieldmail.ai',
      proxy_phone: '+1 (555) 0106',
      linked_services: ['Twitter'],
    },
    type: MessageType.SMS,
    sender: '40404',
    recipient: '+1 (555) 0106',
    received_at: '2026-03-07T12:45:00Z',
    delivered_at: '2026-03-07T12:45:01Z',
    status: MessageStatus.DELIVERED,
    sanitized_content: 'Twitter: Your password reset code is 582941. Valid for 10 minutes.',
  },
  {
    _id: 'm7',
    shield_id: {
      _id: '7',
      proxy_email: 'linkedin@shieldmail.ai',
      proxy_phone: '+1 (555) 0107',
      linked_services: ['LinkedIn'],
    },
    type: MessageType.EMAIL,
    sender: 'notifications@linkedin.com',
    recipient: 'linkedin@shieldmail.ai',
    received_at: '2026-03-06T09:30:00Z',
    delivered_at: '2026-03-06T09:30:02Z',
    status: MessageStatus.DELIVERED,
    sanitized_content: 'You have 5 new profile views this week.\n\nSee who viewed your profile: https://linkedin.com/views',
  },
  {
    _id: 'm8',
    shield_id: {
      _id: '8',
      proxy_email: 'bank@shieldmail.ai',
      proxy_phone: '+1 (555) 0108',
      linked_services: ['Bank of America'],
    },
    type: MessageType.SMS,
    sender: '22656',
    recipient: '+1 (555) 0108',
    received_at: '2026-03-06T08:00:00Z',
    delivered_at: null,
    status: MessageStatus.FILTERED,
    sanitized_content: 'Alert: Unusual transaction detected. Reply YES to confirm or NO to block.',
  },
];

export const getMockMessages = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return mockMessages;
};

export default mockMessages;
