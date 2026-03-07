import { Search, Filter, RefreshCw } from 'lucide-react';
import { useBlockchainLogs } from '../context/BlockchainContext';
import { AuditAction, VerificationStatus } from '../types/blockchain';

const BlockchainFilterBar = () => {
  const { filter, updateFilter, refreshLogs, stats } = useBlockchainLogs();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by service, event, or hash..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter.action}
            onChange={(e) => updateFilter({ action: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Events</option>
            <option value={AuditAction.ROTATION}>Rotation</option>
            <option value={AuditAction.BURN}>Burn</option>
            <option value={AuditAction.LOGIN_ATTEMPT}>Login Attempt</option>
            <option value={AuditAction.COMMUNICATION_FILTERED}>Communication Filtered</option>
          </select>
          <select
            value={filter.verificationStatus}
            onChange={(e) => updateFilter({ verificationStatus: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value={VerificationStatus.VERIFIED}>Verified</option>
            <option value={VerificationStatus.PENDING}>Pending</option>
          </select>
          <button
            onClick={refreshLogs}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockchainFilterBar;
