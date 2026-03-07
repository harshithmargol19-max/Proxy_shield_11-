import { EventTypeConfig, ThreatEventType } from '../types/threatEvent';

const EventTypeBadge = ({ eventType }) => {
  const config = EventTypeConfig[eventType] || EventTypeConfig[ThreatEventType.CREDENTIAL_LEAK];

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default EventTypeBadge;
