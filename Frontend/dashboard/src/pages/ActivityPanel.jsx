import { useState } from 'react';
import { Activity } from 'lucide-react';
import ActivityStats from '../components/ActivityStats';
import ActivityFilterBar from '../components/ActivityFilterBar';
import ActivityTimeline from '../components/ActivityTimeline';
import ActivityDetailModal from '../components/ActivityDetailModal';
import { useActivities } from '../context/ActivityContext';

const ActivityPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, selectActivity } = useActivities();

  const handleActivityClick = (id) => {
    selectActivity(id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Extension Activity</h1>
                <p className="text-sm text-gray-500">Browser extension activity log</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActivityStats />
        <ActivityFilterBar />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ActivityTimeline onItemClick={handleActivityClick} />
        </div>
      </main>
      <ActivityDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ActivityPanel;
