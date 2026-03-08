import { useState } from 'react';
import { Shield, LayoutGrid, List, Plus } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import IdentityTable from '../components/IdentityTable';
import IdentityCard from '../components/IdentityCard';
import IdentityDetailModal from '../components/IdentityDetailModal';
import CreateIdentityModal from '../components/CreateIdentityModal';
import { useIdentities } from '../context/IdentityContext';

const IdentityControlCenter = () => {
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { loading, error, selectIdentity } = useIdentities();

  const handleIdentityClick = (id) => {
    selectIdentity(id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading identities...</p>
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
              <Shield className="w-10 h-10 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Identity Control Center</h1>
                <p className="text-sm text-gray-500">Manage your Shield Identities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
                New Identity
              </button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`} title="Table View">
                <List className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`} title="Card View">
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {viewMode === 'table' ? (
            <IdentityTable onRowClick={handleIdentityClick} />
          ) : (
            <IdentityCard onCardClick={handleIdentityClick} />
          )}
        </div>
      </main>
      <IdentityDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CreateIdentityModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default IdentityControlCenter;
