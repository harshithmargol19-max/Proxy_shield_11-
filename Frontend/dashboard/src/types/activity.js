export const ActivityType = {
  IDENTITY_CREATED: 'identity_created',
  LOGIN_DETECTED: 'login_detected',
  AI_ACTION: 'ai_action',
};

export const ActivityConfig = {
  [ActivityType.IDENTITY_CREATED]: {
    label: 'Identity Created',
    icon: '🆕',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  [ActivityType.LOGIN_DETECTED]: {
    label: 'Login Detected',
    icon: '🔐',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  [ActivityType.AI_ACTION]: {
    label: 'AI Action',
    icon: '🤖',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
  },
};

export const defaultActivityFilter = {
  search: '',
  activityType: 'all',
  website: 'all',
};
