import { ExternalLink } from 'lucide-react';
import ActionBadge from './ActionBadge';
import VerificationBadge from './VerificationBadge';
import { useBlockchainLogs } from '../context/BlockchainContext';

const BlockchainTable = ({ onRowClick }) => {
  const { logs } = useBlockchainLogs();

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⛓️</div>
        <p className="text-gray-500 text-lg">No blockchain events found</p>
        <p className="text-gray-400 text-sm mt-2">Audit logs will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(log.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <ActionBadge action={log.event} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.service_name}</div>
                  <div className="text-xs text-gray-500">{log.shield_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.timestamp}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                      {log.short_hash}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <VerificationBadge status={log.verification_status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(log.id);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockchainTable;
