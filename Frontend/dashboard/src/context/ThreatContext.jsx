import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMockThreatEvents } from '../services/mockThreatData';
import { ThreatSeverity, defaultThreatFilter } from '../types/threatEvent';

const ThreatContext = createContext(null);

export const useThreatEvents = () => {
  const context = useContext(ThreatContext);
  if (!context) {
    throw new Error('useThreatEvents must be used within ThreatProvider');
  }
  return context;
};

export const ThreatProvider = ({ children }) => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(defaultThreatFilter);
  const [selectedThreat, setSelectedThreat] = useState(null);

  const loadThreats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMockThreatEvents();
      setThreats(data);
    } catch (err) {
      setError('Failed to load threat events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreats();
  }, [loadThreats]);

  const filteredThreats = threats
    .filter((threat) => {
      const matchesSearch =
        filter.search === '' ||
        threat.shield_id?.website?.toLowerCase().includes(filter.search.toLowerCase()) ||
        threat.event_type?.toLowerCase().includes(filter.search.toLowerCase());
      const matchesSeverity = filter.severity === 'all' || threat.severity === filter.severity;
      const matchesEventType = filter.eventType === 'all' || threat.event_type === filter.eventType;
      return matchesSearch && matchesSeverity && matchesEventType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (filter.sortBy) {
        case 'severity':
          const severityOrder = { [ThreatSeverity.HIGH]: 0, [ThreatSeverity.MEDIUM]: 1, [ThreatSeverity.LOW]: 2 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case 'detected_at':
          comparison = new Date(b.detected_at) - new Date(a.detected_at);
          break;
        case 'event_type':
          comparison = a.event_type.localeCompare(b.event_type);
          break;
        default:
          comparison = 0;
      }
      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const selectThreat = (id) => {
    const threat = threats.find((t) => t._id === id);
    setSelectedThreat(threat);
  };

  const clearSelection = () => {
    setSelectedThreat(null);
  };

  const resolveThreat = async (id) => {
    setThreats((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: 'resolved' } : t))
    );
  };

  const dismissThreat = async (id) => {
    setThreats((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: 'dismissed' } : t))
    );
  };

  const stats = {
    total: threats.length,
    high: threats.filter((t) => t.severity === ThreatSeverity.HIGH).length,
    medium: threats.filter((t) => t.severity === ThreatSeverity.MEDIUM).length,
    low: threats.filter((t) => t.severity === ThreatSeverity.LOW).length,
    active: threats.filter((t) => t.status === 'active').length,
    resolved: threats.filter((t) => t.status === 'resolved').length,
  };

  return (
    <ThreatContext.Provider
      value={{
        threats: filteredThreats,
        allThreats: threats,
        loading,
        error,
        filter,
        updateFilter,
        selectedThreat,
        selectThreat,
        clearSelection,
        resolveThreat,
        dismissThreat,
        refreshThreats: loadThreats,
        stats,
      }}
    >
      {children}
    </ThreatContext.Provider>
  );
};

export default ThreatContext;
