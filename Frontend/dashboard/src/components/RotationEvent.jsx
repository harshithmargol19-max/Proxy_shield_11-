import { EventConfig } from '../types/rotation';

const RotationEvent = ({ log, isLast }) => {
  const config = EventConfig[log.event_type] || EventConfig.suspicious_activity;

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      {/* Icon */}
      <div className={`relative z-10 w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border flex items-center justify-center text-xl flex-shrink-0`}>
        {config.icon}
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={`text-lg font-semibold ${config.textColor}`}>
              {config.label}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{log.timestamp}</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {log.service_name}
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">Reason: </span>
            <span className="text-gray-900 capitalize">{log.reason}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <p className="text-xs text-red-600 font-medium mb-1">Old Identity</p>
              <p className="text-sm text-red-900 font-mono truncate">{log.old_identity}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-xs text-green-600 font-medium mb-1">New Identity</p>
              <p className="text-sm text-green-900 font-mono truncate">{log.new_identity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotationEvent;
