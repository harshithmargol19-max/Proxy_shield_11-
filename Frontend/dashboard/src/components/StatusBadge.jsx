import { StatusConfig, IdentityStatus } from '../types/identity';

const StatusBadge = ({ status }) => {
  const config = StatusConfig[status] || StatusConfig[IdentityStatus.ACTIVE];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
