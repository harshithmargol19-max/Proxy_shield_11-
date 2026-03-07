import { Search, Filter, RefreshCw } from 'lucide-react';
import { useActivities } from '../context/ActivityContext';
import { ActivityType } from '../types/activity';

const ActivityFilterBar = () => {
  const { filter, updateFilter, refreshActivities, websites } = useActivities();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by website, action, or email..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter.activityType}
            onChange={(e) => updateFilter({ activityType: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value={ActivityType.IDENTITY_CREATED}>Identity Created</option>
            <option value={ActivityType.LOGIN_DETECTED}>Login Detected</option>
            <option value={ActivityType.AI_ACTION}>AI Action</option>
          </select>
          <select
            value={filter.website}
            onChange={(e) => updateFilter({ website: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            {websites.map((site) => (
              <option key={site} value={site}>
                {site === 'all' ? 'All Websites' : site}
              </option>
            ))}
          </select>
          <button
            onClick={refreshActivities}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilterBar;
