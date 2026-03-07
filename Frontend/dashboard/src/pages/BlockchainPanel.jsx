import { useState } from 'react';
import { Link } from 'lucide-react';
import BlockchainStats from '../components/BlockchainStats';
import BlockchainFilterBar from '../components/BlockchainFilterBar';
import BlockchainTable from '../components/BlockchainTable';
import BlockchainLogDetail from '../components/BlockchainLogDetail';
import { useBlockchainLogs } from '../context/BlockchainContext';

const BlockchainPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, selectLog } = useBlockchainLogs();

  const handleLogClick = (id) => {
    selectLog(id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blockchain logs...</p>
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
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Link className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blockchain Verification</h1>
                <p className="text-sm text-gray-500">Immutable audit log records</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlockchainStats />
        <BlockchainFilterBar />
        <BlockchainTable onRowClick={handleLogClick} />
      </main>
      <BlockchainLogDetail isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BlockchainPanel;
