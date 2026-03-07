import { Search, Filter, RefreshCw } from 'lucide-react';
import { useIdentities } from '../context/IdentityContext';
import { IdentityStatus } from '../types/identity';

const FilterBar = () => {
  const { filter, updateFilter, refreshIdentities, stats } = useIdentities();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by website or email..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter.status}
              onChange={(e) => updateFilter({ status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value={IdentityStatus.ACTIVE}>Active</option>
              <option value={IdentityStatus.SUSPICIOUS}>Suspicious</option>
              <option value={IdentityStatus.BURNED}>Burned</option>
            </select>
          </div>
          <button onClick={refreshIdentities} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-600">Active: <strong>{stats.active}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-sm text-gray-600">Suspicious: <strong>{stats.suspicious}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm text-gray-600">Burned: <strong>{stats.burned}</strong></span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">Total: <strong>{stats.total}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
