import { RotateCw } from 'lucide-react';
import RotationFilterBar from '../components/RotationFilterBar';
import RotationTimeline from '../components/RotationTimeline';
import { useRotationLogs } from '../context/RotationContext';

const RotationPanel = () => {
  const { loading, error } = useRotationLogs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rotation logs...</p>
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <RotateCw className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Identity Rotation Timeline</h1>
                <p className="text-sm text-gray-500">Track identity rotation events</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RotationFilterBar />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <RotationTimeline />
        </div>
      </main>
    </div>
  );
};

export default RotationPanel;
