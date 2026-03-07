import { ActivityConfig, ActivityType } from '../types/activity';

const ActivityTypeBadge = ({ type }) => {
  const config = ActivityConfig[type] || ActivityConfig[ActivityType.AI_ACTION];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default ActivityTypeBadge;
