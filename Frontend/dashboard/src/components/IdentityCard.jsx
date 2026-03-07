import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useIdentities } from '../context/IdentityContext';

const IdentityCard = ({ onCardClick }) => {
  const { identities } = useIdentities();

  if (identities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No identities found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {identities.map((identity) => (
        <div
          key={identity.id}
          onClick={() => onCardClick(identity.id)}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{identity.website}</h3>
              <p className="text-sm text-gray-500">{identity.shieldEmail}</p>
            </div>
            <StatusBadge status={identity.status} />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="text-gray-900">{identity.virtualPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created:</span>
              <span className="text-gray-900">{new Date(identity.creationDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Activity:</span>
              <span className="text-gray-900">{identity.lastActivity}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
            <button onClick={(e) => { e.stopPropagation(); onCardClick(identity.id); }} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center gap-1">
              <Eye className="w-4 h-4" /> View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IdentityCard;
