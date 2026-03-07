import { Eye } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import EventTypeBadge from './EventTypeBadge';
import { useThreatEvents } from '../context/ThreatContext';

const ThreatCard = ({ onCardClick }) => {
  const { threats } = useThreatEvents();

  if (threats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No threat events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {threats.map((threat) => {
        const statusColor = threat.status === 'active' ? 'text-red-600' :
                           threat.status === 'resolved' ? 'text-green-600' :
                           threat.status === 'investigating' ? 'text-yellow-600' :
                           'text-gray-600';

        return (
          <div
            key={threat._id}
            onClick={() => onCardClick(threat._id)}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={threat.severity} />
                <EventTypeBadge eventType={threat.event_type} />
              </div>
              <span className={"text-xs font-medium " + statusColor}>
                {threat.status ? threat.status.toUpperCase() : ''}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Website:</span>
                <span className="text-gray-900 font-medium">{threat.shield_id ? threat.shield_id.website : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shield Email:</span>
                <span className="text-gray-900">{threat.shield_id ? threat.shield_id.shieldEmail : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Detected:</span>
                <span className="text-gray-900">
                  {new Date(threat.detected_at).toLocaleDateString()}
                </span>
              </div>
              {threat.metadata && threat.metadata.details && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{threat.metadata.details}</p>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(threat._id);
                }}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" /> View Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ThreatCard;
