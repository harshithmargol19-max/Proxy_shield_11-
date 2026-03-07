import ActivityItem from './ActivityItem';
import { useActivities } from '../context/ActivityContext';

const ActivityTimeline = ({ onItemClick }) => {
  const { activities } = useActivities();

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-500 text-lg">No activities found</p>
        <p className="text-gray-400 text-sm mt-2">Extension activities will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === activities.length - 1}
          onClick={() => onItemClick(activity.id)}
        />
      ))}
    </div>
  );
};

export default ActivityTimeline;
