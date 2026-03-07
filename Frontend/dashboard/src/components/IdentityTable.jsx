import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useIdentities } from '../context/IdentityContext';

const IdentityTable = ({ onRowClick }) => {
  const { identities, filter, updateFilter } = useIdentities();

  const handleSort = (field) => {
    const newOrder = filter.sortBy === field && filter.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilter({ sortBy: field, sortOrder: newOrder });
  };

  const SortIcon = ({ field }) => {
    if (filter.sortBy !== field) return <span className="w-4 h-4 inline-block" />;
    return filter.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />;
  };

  if (identities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No identities found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('website')}
            >
              <SortIcon field="website" /> Website
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('shieldEmail')}
            >
              Shield Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              <SortIcon field="status" /> Status
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('creationDate')}
            >
              <SortIcon field="creationDate" /> Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {identities.map((identity) => (
            <tr key={identity.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onRowClick(identity.id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{identity.website}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{identity.shieldEmail}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{identity.virtualPhone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={identity.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{new Date(identity.creationDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{identity.lastActivity}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button onClick={(e) => { e.stopPropagation(); onRowClick(identity.id); }} className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IdentityTable;
