import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getMockRotationLogs } from '../services/mockRotationData';
import { RotationType, RotationEventType, EventConfig, defaultRotationFilter } from '../types/rotation';

const RotationContext = createContext(null);

export const useRotationLogs = () => {
  const context = useContext(RotationContext);
  if (!context) {
    throw new Error('useRotationLogs must be used within RotationProvider');
  }
  return context;
};

// Transform backend data to match rotate.txt format
const transformRotationLog = (log) => {
  const service = log.shield_id?.linked_services?.[0] || 'Unknown Service';
  const oldIdentity = log.shield_id?.proxy_email || 'N/A';
  const newIdentity = log.new_shield_id?.proxy_email || 'N/A';
  
  // Map rotation_type to event_type
  let eventType;
  if (log.rotation_type === RotationType.AUTO) {
    eventType = RotationEventType.IDENTITY_BURN;
  } else {
    eventType = RotationEventType.NEW_IDENTITY;
  }
  
  // Format time
  const date = new Date(log.timestamp);
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  return {
    id: log._id,
    timestamp: timeStr,
    fullDate: log.timestamp,
    service_name: service,
    event_type: eventType,
    reason: log.reason || 'Unknown reason',
    old_identity: oldIdentity,
    new_identity: newIdentity,
    rotation_type: log.rotation_type,
    rawLog: log,
  };
};

export const RotationProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(defaultRotationFilter);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMockRotationLogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to load rotation logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const transformedLogs = useMemo(() => logs.map(transformRotationLog), [logs]);

  const filteredLogs = useMemo(() => {
    return transformedLogs
      .filter((log) => {
        const matchesSearch =
          filter.search === '' ||
          log.service_name.toLowerCase().includes(filter.search.toLowerCase()) ||
          log.old_identity.toLowerCase().includes(filter.search.toLowerCase()) ||
          log.new_identity.toLowerCase().includes(filter.search.toLowerCase());
        const matchesEventType = filter.eventType === 'all' || log.event_type === filter.eventType;
        const matchesRotationType = filter.rotationType === 'all' || log.rotation_type === filter.rotationType;
        return matchesSearch && matchesEventType && matchesRotationType;
      })
      .sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));
  }, [transformedLogs, filter]);

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const stats = useMemo(() => ({
    total: logs.length,
    auto: logs.filter((l) => l.rotation_type === RotationType.AUTO).length,
    manual: logs.filter((l) => l.rotation_type === RotationType.MANUAL).length,
    burned: transformedLogs.filter((l) => l.event_type === RotationEventType.IDENTITY_BURN).length,
    newIdentity: transformedLogs.filter((l) => l.event_type === RotationEventType.NEW_IDENTITY).length,
  }), [logs, transformedLogs]);

  return (
    <RotationContext.Provider
      value={{
        logs: filteredLogs,
        allLogs: transformedLogs,
        rawLogs: logs,
        loading,
        error,
        filter,
        updateFilter,
        refreshLogs: loadLogs,
        stats,
      }}
    >
      {children}
    </RotationContext.Provider>
  );
};

export default RotationContext;
