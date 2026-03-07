import { ChevronUp, ChevronDown, Eye, AlertTriangle } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import EventTypeBadge from './EventTypeBadge';
import { useThreatEvents } from '../context/ThreatContext';

const ThreatTable = ({ onRowClick }) => {
  const { threats, filter, updateFilter } = useThreatEvents();

  const handleSort = (field) => {
    const newOrder = filter.sortBy === field && filter.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilter({ sortBy: field, sortOrder: newOrder });
  };

  const SortIcon = ({ field }) => {
    if (filter.sortBy !== field) return <span className="w-4 h-4 inline-block" />;
    return filter.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { color: 'text-red-600', bg: 'bg-red-50', label: 'Active' };
      case 'resolved':
        return { color: 'text-green-600', bg: 'bg-green-50', label: 'Resolved' };
      case 'dismissed':
        return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Dismissed' };
      case 'investigating':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Investigating' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', label: status };
    }
  };

  if (threats.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-lg">No threat events found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('detected_at')}
            >
              <SortIcon field="detected_at" /> Detected
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shield Identity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {threats.map((threat) => {
            const statusConfig = getStatusConfig(threat.status);
            return (
              <tr
                key={threat._id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(threat._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <SeverityBadge severity={threat.severity} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EventTypeBadge eventType={threat.event_type} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(threat.detected_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(threat.detected_at).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{threat.shield_id?.shieldEmail || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{threat.shield_id?.website || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(threat._id);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ThreatTable;
