import { useState } from 'react';
import { ShieldAlert, LayoutGrid, List } from 'lucide-react';
import ThreatStats from '../components/ThreatStats';
import ThreatFilterBar from '../components/ThreatFilterBar';
import ThreatTable from '../components/ThreatTable';
import ThreatCard from '../components/ThreatCard';
import ThreatDetailModal from '../components/ThreatDetailModal';
import { useThreatEvents } from '../context/ThreatContext';

const ThreatPanel = () => {
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, selectThreat } = useThreatEvents();

  const handleThreatClick = (id) => {
    selectThreat(id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading threat events...</p>
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
              <ShieldAlert className="w-10 h-10 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Threat Panel</h1>
                <p className="text-sm text-gray-500">Monitor and manage security threats</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Card View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ThreatStats />
        <ThreatFilterBar />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {viewMode === 'table' ? (
            <ThreatTable onRowClick={handleThreatClick} />
          ) : (
            <ThreatCard onCardClick={handleThreatClick} />
          )}
        </div>
      </main>
      <ThreatDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ThreatPanel;
