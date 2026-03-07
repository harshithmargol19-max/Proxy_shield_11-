import RotationEvent from './RotationEvent';
import { useRotationLogs } from '../context/RotationContext';

const RotationTimeline = () => {
  const { logs } = useRotationLogs();

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📜</div>
        <p className="text-gray-500 text-lg">No rotation events found</p>
        <p className="text-gray-400 text-sm mt-2">Identity rotations will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-0">
        {logs.map((log, index) => (
          <RotationEvent
            key={log.id}
            log={log}
            isLast={index === logs.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default RotationTimeline;
