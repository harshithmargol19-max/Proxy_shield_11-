import { useState } from 'react';
import { Inbox } from 'lucide-react';
import InboxStats from '../components/InboxStats';
import InboxFilterBar from '../components/InboxFilterBar';
import MessageList from '../components/MessageList';
import MessageDetailModal from '../components/MessageDetailModal';
import { useMessages } from '../context/SmsContext';

const InboxPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, selectMessage } = useMessages();

  const handleMessageClick = (id) => {
    selectMessage(id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Inbox className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inbox Dashboard</h1>
                <p className="text-sm text-gray-500">View emails and SMS messages</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InboxStats />
        <InboxFilterBar />
        <MessageList onMessageClick={handleMessageClick} />
      </main>
      <MessageDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default InboxPanel;
