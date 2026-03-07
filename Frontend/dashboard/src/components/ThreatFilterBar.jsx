import { Search, Filter, RefreshCw } from 'lucide-react';
import { useThreatEvents } from '../context/ThreatContext';
import { ThreatSeverity, ThreatEventType } from '../types/threatEvent';

const ThreatFilterBar = () => {
  const { filter, updateFilter, refreshThreats, stats } = useThreatEvents();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by website or event type..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter.severity}
              onChange={(e) => updateFilter({ severity: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Severities</option>
              <option value={ThreatSeverity.HIGH}>High</option>
              <option value={ThreatSeverity.MEDIUM}>Medium</option>
              <option value={ThreatSeverity.LOW}>Low</option>
            </select>
          </div>
          <select
            value={filter.eventType}
            onChange={(e) => updateFilter({ eventType: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Event Types</option>
            <option value={ThreatEventType.CREDENTIAL_LEAK}>Credential Leak</option>
            <option value={ThreatEventType.UNAUTHORIZED_IP}>Unauthorized IP</option>
            <option value={ThreatEventType.PHISHING_ATTEMPT}>Phishing Attempt</option>
          </select>
          <button
            onClick={refreshThreats}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreatFilterBar;
