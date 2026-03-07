export const IdentityStatus = {
  ACTIVE: 'active',
  SUSPICIOUS: 'suspicious',
  BURNED: 'burned',
};

export const StatusConfig = {
  [IdentityStatus.ACTIVE]: {
    label: 'Active',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: '🟢',
  },
  [IdentityStatus.SUSPICIOUS]: {
    label: 'Suspicious',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    icon: '🟡',
  },
  [IdentityStatus.BURNED]: {
    label: 'Burned',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    icon: '🔴',
  },
};

export const defaultFilter = {
  search: '',
  status: 'all',
  sortBy: 'creationDate',
  sortOrder: 'desc',
};
