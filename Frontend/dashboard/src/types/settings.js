export const DeviceType = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  OTHER: 'other',
};

export const AccountStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

export const StatusConfig = {
  [AccountStatus.ACTIVE]: {
    label: 'Active',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  [AccountStatus.SUSPENDED]: {
    label: 'Suspended',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  [AccountStatus.DELETED]: {
    label: 'Deleted',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
};

export const DeviceTypeConfig = {
  [DeviceType.DESKTOP]: {
    label: 'Desktop',
    icon: '💻',
  },
  [DeviceType.MOBILE]: {
    label: 'Mobile',
    icon: '📱',
  },
  [DeviceType.TABLET]: {
    label: 'Tablet',
    icon: '📟',
  },
  [DeviceType.OTHER]: {
    label: 'Other',
    icon: '🖥️',
  },
};

export const SettingsTab = {
  PROFILE: 'profile',
  DEVICES: 'devices',
  SECURITY: 'security',
  ACCOUNT: 'account',
};
