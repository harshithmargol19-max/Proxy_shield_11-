export const RotationEventType = {
  IDENTITY_BURN: 'identity_burn',
  NEW_IDENTITY: 'new_identity',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
};

export const RotationType = {
  AUTO: 'auto',
  MANUAL: 'manual',
};

export const EventConfig = {
  [RotationEventType.IDENTITY_BURN]: {
    label: 'Identity Burned',
    icon: '🔥',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  [RotationEventType.NEW_IDENTITY]: {
    label: 'New Identity Issued',
    icon: '🆕',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  [RotationEventType.SUSPICIOUS_ACTIVITY]: {
    label: 'Suspicious Activity',
    icon: '⚠️',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
};

export const defaultRotationFilter = {
  search: '',
  eventType: 'all',
  rotationType: 'all',
};
