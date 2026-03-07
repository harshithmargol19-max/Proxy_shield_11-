import { X, Globe, Mail, Clock, Shield, Monitor, MapPin, MousePointer, Link as LinkIcon } from 'lucide-react';
import ActivityTypeBadge from './ActivityTypeBadge';
import { useActivities } from '../context/ActivityContext';

const ActivityDetailModal = ({ isOpen, onClose }) => {
  const { selectedActivity, clearSelection } = useActivities();

  if (!isOpen || !selectedActivity) return null;

  const renderMetadata = () => {
    const metadata = selectedActivity.metadata;
    const entries = Object.entries(metadata);
    
    return entries.map(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (key === 'ip_address' || key === 'form_url' || key === 'url') {
        return (
          <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <LinkIcon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{label}</p>
              <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
            </div>
          </div>
        );
      }
      
      if (key === 'ip_country' || key === 'os') {
        return (
          <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{label}</p>
              <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
          </div>
        );
      }
      
      if (key === 'device_type' || key === 'browser') {
        return (
          <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{label}</p>
              <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
          </div>
        );
      }
      
      if (key === 'confidence') {
        return (
          <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{label}</p>
              <p className="text-sm font-medium text-gray-900">{(value * 100).toFixed(0)}%</p>
            </div>
          </div>
        );
      }
      
      return (
        <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-500 capitalize">{label}:</span>
          <span className="text-sm font-medium text-gray-900">
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Details</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  {selectedActivity.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedActivity.action}</h3>
                  <p className="text-sm text-gray-500">{selectedActivity.timestamp}</p>
                </div>
              </div>
              <ActivityTypeBadge type={selectedActivity.activity_type} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Website</p>
                  <p className="text-sm font-medium text-gray-900">{selectedActivity.website}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Shield Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedActivity.shield_email}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Details</h4>
              <div className="space-y-2">
                {renderMetadata()}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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

export default ActivityDetailModal;
