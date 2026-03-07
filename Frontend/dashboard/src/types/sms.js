export const MessageType = {
  EMAIL: 'email',
  SMS: 'sms',
};

export const MessageStatus = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  FILTERED: 'filtered',
  BLOCKED: 'blocked',
};

export const SecurityStatus = {
  SAFE: 'safe',
  SUSPICIOUS: 'suspicious',
  PHISHING: 'phishing',
};

export const StatusConfig = {
  [MessageStatus.DELIVERED]: {
    label: 'Safe',
    icon: '✅',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  [MessageStatus.FILTERED]: {
    label: 'Suspicious',
    icon: '⚠️',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  [MessageStatus.BLOCKED]: {
    label: 'Phishing',
    icon: '🚫',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  [MessageStatus.PENDING]: {
    label: 'Pending',
    icon: '⏳',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
  },
};

export const MessageTypeConfig = {
  [MessageType.EMAIL]: {
    label: 'Email',
    icon: '📧',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  [MessageType.SMS]: {
    label: 'SMS',
    icon: '📱',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
};

export const defaultInboxFilter = {
  search: '',
  messageType: 'all',
  securityStatus: 'all',
};
