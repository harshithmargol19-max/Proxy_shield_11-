import { X, Shield, Hash, Clock, CheckCircle, Link as LinkIcon } from 'lucide-react';
import ActionBadge from './ActionBadge';
import VerificationBadge from './VerificationBadge';
import { useBlockchainLogs } from '../context/BlockchainContext';

const BlockchainLogDetail = ({ isOpen, onClose }) => {
  const { selectedLog, clearSelection } = useBlockchainLogs();

  if (!isOpen || !selectedLog) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Blockchain Event Details</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  ⛓️
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Audit Log Entry</h3>
                  <p className="text-sm text-gray-500">Immutable blockchain record</p>
                </div>
              </div>
              <VerificationBadge status={selectedLog.verification_status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Event Type</p>
                  <div className="mt-1">
                    <ActionBadge action={selectedLog.event} />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Timestamp</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedLog.fullDate).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Service</p>
                  <p className="text-sm font-medium text-gray-900">{selectedLog.service_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Shield Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedLog.shield_email}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Transaction Hash
              </h4>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <code className="text-sm text-indigo-900 font-mono break-all">
                  {selectedLog.transaction_hash}
                </code>
                <div className="mt-3 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-600" />
                  <a
                    href={`https://etherscan.io/tx/${selectedLog.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View on Blockchain Explorer
                  </a>
                </div>
              </div>
            </div>

            {Object.keys(selectedLog.metadata).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="space-y-2">
                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

export default BlockchainLogDetail;
