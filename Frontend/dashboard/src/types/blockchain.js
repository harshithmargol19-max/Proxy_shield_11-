export const AuditAction = {
  ROTATION: 'rotation',
  BURN: 'burn',
  LOGIN_ATTEMPT: 'login_attempt',
  COMMUNICATION_FILTERED: 'communication_filtered',
};

export const VerificationStatus = {
  VERIFIED: 'verified',
  PENDING: 'pending',
};

export const ActionConfig = {
  [AuditAction.ROTATION]: {
    label: 'Identity Rotation',
    icon: '🔄',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  [AuditAction.BURN]: {
    label: 'Identity Burned',
    icon: '🔥',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  [AuditAction.LOGIN_ATTEMPT]: {
    label: 'Login Attempt',
    icon: '🔐',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
  },
  [AuditAction.COMMUNICATION_FILTERED]: {
    label: 'Communication Filtered',
    icon: '📧',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
};

export const defaultBlockchainFilter = {
  search: '',
  action: 'all',
  verificationStatus: 'all',
};
