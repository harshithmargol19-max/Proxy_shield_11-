import ActivityTypeBadge from './ActivityTypeBadge';

const ActivityItem = ({ activity, isLast, onClick }) => {
  return (
    <div className="relative flex gap-4 pb-8">
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-2xl flex-shrink-0">
        {activity.icon}
      </div>
      
      <div
        onClick={onClick}
        className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ActivityTypeBadge type={activity.activity_type} />
              <span className="text-xs text-gray-500">{activity.timestamp}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{activity.action}</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            {activity.website}
          </span>
        </div>
        <p className="text-sm text-gray-600">{activity.shield_email}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
