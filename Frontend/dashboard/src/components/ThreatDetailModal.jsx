import { X, Shield, AlertTriangle, CheckCircle, XCircle, Clock, Globe, Key, Fish } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import EventTypeBadge from './EventTypeBadge';
import { useThreatEvents } from '../context/ThreatContext';
import { ThreatEventType, EventTypeConfig } from '../types/threatEvent';

const ThreatDetailModal = ({ isOpen, onClose }) => {
  const { selectedThreat, resolveThreat, dismissThreat, clearSelection } = useThreatEvents();

  if (!isOpen || !selectedThreat) return null;

  const handleResolve = async () => {
    await resolveThreat(selectedThreat._id);
    onClose();
  };

  const handleDismiss = async () => {
    await dismissThreat(selectedThreat._id);
    onClose();
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case ThreatEventType.CREDENTIAL_LEAK:
        return <Key className="w-6 h-6 text-indigo-600" />;
      case ThreatEventType.UNAUTHORIZED_IP:
        return <Globe className="w-6 h-6 text-indigo-600" />;
      case ThreatEventType.PHISHING_ATTEMPT:
        return <Fish className="w-6 h-6 text-indigo-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-indigo-600" />;
    }
  };

  const eventTypeConfig = EventTypeConfig[selectedThreat.event_type] || EventTypeConfig[ThreatEventType.CREDENTIAL_LEAK];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Threat Details</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getEventIcon(selectedThreat.event_type)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{eventTypeConfig.label}</h3>
                  <p className="text-sm text-gray-500">{eventTypeConfig.description}</p>
                </div>
              </div>
              <SeverityBadge severity={selectedThreat.severity} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Shield Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedThreat.shield_id?.shieldEmail || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Website</p>
                  <p className="text-sm font-medium text-gray-900">{selectedThreat.shield_id?.website || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Detected At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedThreat.detected_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selectedThreat.status || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Threat Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Source:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedThreat.metadata?.source || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Details:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedThreat.metadata?.details || 'N/A'}</span>
                  </div>
                  {Object.entries(selectedThreat.metadata || {})
                    .filter(([key]) => !['source', 'details'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {selectedThreat.status === 'active' && (
                <>
                  <button
                    onClick={handleResolve}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Resolved
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <XCircle className="w-4 h-4" /> Dismiss
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetailModal;
