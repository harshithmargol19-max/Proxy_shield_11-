import { Shield, CheckCircle, RotateCw, Flame, LogIn, Filter } from 'lucide-react';
import { useBlockchainLogs } from '../context/BlockchainContext';
import { AuditAction } from '../types/blockchain';

const BlockchainStats = () => {
  const { stats } = useBlockchainLogs();

  const statCards = [
    {
      title: 'Total Events',
      value: stats.total,
      icon: Shield,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Verified',
      value: stats.verified,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Rotations',
      value: stats.rotation,
      icon: RotateCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Burned',
      value: stats.burn,
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Logins',
      value: stats.login,
      icon: LogIn,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Filtered',
      value: stats.filtered,
      icon: Filter,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className={`bg-white rounded-lg shadow-sm border ${stat.borderColor} p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockchainStats;
