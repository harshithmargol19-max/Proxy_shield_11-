import { ActionConfig, AuditAction } from '../types/blockchain';

const ActionBadge = ({ action }) => {
  const config = ActionConfig[action] || ActionConfig[AuditAction.LOGIN_ATTEMPT];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default ActionBadge;
