import { ActivitySquare, UserPlus, LogIn, Bot } from 'lucide-react';
import { useActivities } from '../context/ActivityContext';
import { ActivityType } from '../types/activity';

const ActivityStats = () => {
  const { stats } = useActivities();

  const statCards = [
    {
      title: 'Total Activities',
      value: stats.total,
      icon: ActivitySquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Identities Created',
      value: stats.identityCreated,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Logins Detected',
      value: stats.loginDetected,
      icon: LogIn,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'AI Actions',
      value: stats.aiAction,
      icon: Bot,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

export default ActivityStats;
