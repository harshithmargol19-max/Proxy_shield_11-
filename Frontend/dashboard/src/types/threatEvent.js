export const ThreatSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const ThreatEventType = {
  CREDENTIAL_LEAK: 'credential_leak',
  UNAUTHORIZED_IP: 'unauthorized_ip',
  PHISHING_ATTEMPT: 'phishing_attempt',
};

export const SeverityConfig = {
  [ThreatSeverity.HIGH]: {
    label: 'High',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    icon: '🔴',
    priority: 1,
  },
  [ThreatSeverity.MEDIUM]: {
    label: 'Medium',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    icon: '🟡',
    priority: 2,
  },
  [ThreatSeverity.LOW]: {
    label: 'Low',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: '🟢',
    priority: 3,
  },
};

export const EventTypeConfig = {
  [ThreatEventType.CREDENTIAL_LEAK]: {
    label: 'Credential Leak',
    icon: '🔑',
    description: 'Sensitive credentials detected in unauthorized location',
  },
  [ThreatEventType.UNAUTHORIZED_IP]: {
    label: 'Unauthorized IP',
    icon: '🌐',
    description: 'Access attempt from suspicious IP address',
  },
  [ThreatEventType.PHISHING_ATTEMPT]: {
    label: 'Phishing Attempt',
    icon: '🎣',
    description: 'Phishing attack detected targeting shield identity',
  },
};

export const defaultThreatFilter = {
  search: '',
  severity: 'all',
  eventType: 'all',
  sortBy: 'detected_at',
  sortOrder: 'desc',
};
