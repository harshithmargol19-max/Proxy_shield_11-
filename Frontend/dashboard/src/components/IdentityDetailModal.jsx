import { X, Shield, Mail, Phone, Calendar, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useIdentities } from '../context/IdentityContext';
import { IdentityStatus } from '../types/identity';

const IdentityDetailModal = ({ isOpen, onClose }) => {
  const { selectedIdentity, burnIdentity, clearSelection } = useIdentities();

  if (!isOpen || !selectedIdentity) return null;

  const handleBurn = async () => {
    if (confirm('Are you sure you want to burn this identity? This action cannot be undone.')) {
      await burnIdentity(selectedIdentity.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Identity Details</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-indigo-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedIdentity.website}</h3>
                  <p className="text-sm text-gray-500">Shield Identity</p>
                </div>
              </div>
              <StatusBadge status={selectedIdentity.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Shield Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedIdentity.shieldEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Virtual Phone</p>
                  <p className="text-sm font-medium text-gray-900">{selectedIdentity.virtualPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedIdentity.creationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Last Activity</p>
                  <p className="text-sm font-medium text-gray-900">{selectedIdentity.lastActivity}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Activity Log</h4>
              <div className="space-y-2">
                {selectedIdentity.logs && selectedIdentity.logs.length > 0 ? (
                  selectedIdentity.logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      {log.action.includes('Failed') || log.action.includes('Unusual') || log.action.includes('Compromised') ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500">{log.details}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No activity logs available</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {selectedIdentity.status !== IdentityStatus.BURNED && (
                <button onClick={handleBurn} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" /> Burn Identity
                </button>
              )}
              <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityDetailModal;
