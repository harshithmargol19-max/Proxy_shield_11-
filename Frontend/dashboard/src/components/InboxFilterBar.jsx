import { Search, Filter, RefreshCw } from 'lucide-react';
import { useMessages } from '../context/SmsContext';
import { MessageType, MessageStatus } from '../types/sms';

const InboxFilterBar = () => {
  const { filter, updateFilter, refreshMessages, stats } = useMessages();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by sender, subject, or service..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter.messageType}
            onChange={(e) => updateFilter({ messageType: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value={MessageType.EMAIL}>Email</option>
            <option value={MessageType.SMS}>SMS</option>
          </select>
          <select
            value={filter.securityStatus}
            onChange={(e) => updateFilter({ securityStatus: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="safe">Safe</option>
            <option value="suspicious">Suspicious</option>
            <option value="phishing">Phishing</option>
          </select>
          <button
            onClick={refreshMessages}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxFilterBar;
