import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getMockShieldIdentities, getMockShieldAccesses, getMockAILogs } from '../services/mockActivityData';
import { ActivityType, ActivityConfig, defaultActivityFilter } from '../types/activity';

const ActivityContext = createContext(null);

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities must be used within ActivityProvider');
  }
  return context;
};

const transformShieldIdentity = (identity) => ({
  id: 'id_' + identity._id,
  activity_type: ActivityType.IDENTITY_CREATED,
  action: 'Generated Shield Identity',
  website: identity.linked_services?.[0] || 'Unknown',
  shield_email: identity.proxy_email,
  timestamp: new Date(identity.creation_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  fullDate: identity.creation_time,
  icon: '🆕',
  metadata: {
    proxy_phone: identity.proxy_phone,
    browser_fingerprint: identity.browser_fingerprint,
    status: identity.status,
    last_used: identity.last_used,
  },
  rawData: identity,
});

const transformShieldAccess = (access, identities) => {
  const identity = identities.find(i => i.proxy_email === access.shield_id);
  return {
    id: 'sa_' + access._id,
    activity_type: ActivityType.LOGIN_DETECTED,
    action: 'Login from ' + access.device_type.charAt(0).toUpperCase() + access.device_type.slice(1),
    website: identity?.linked_services?.[0] || 'Unknown',
    shield_email: access.shield_id,
    timestamp: new Date(access.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    fullDate: access.timestamp,
    icon: '🔐',
    metadata: {
      ip_address: access.ip_address,
      ip_country: access.ip_country,
      device_type: access.device_type,
      browser: access.browser,
      os: access.os,
      login_hour: access.login_hour,
      request_frequency: access.request_frequency,
      is_proxy: access.is_proxy,
    },
    rawData: access,
  };
};

const transformAILog = (log) => ({
  id: 'ai_' + log._id,
  activity_type: ActivityType.AI_ACTION,
  action: log.action,
  website: log.shield_id?.linked_services?.[0] || 'Unknown',
  shield_email: log.shield_id?.proxy_email || 'N/A',
  timestamp: new Date(log.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  fullDate: log.timestamp,
  icon: '🤖',
  metadata: {
    confidence: log.confidence,
    ...log.metadata,
  },
  rawData: log,
});

export const ActivityProvider = ({ children }) => {
  const [identities, setIdentities] = useState([]);
  const [accesses, setAccesses] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(defaultActivityFilter);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [identitiesData, accessesData, aiLogsData] = await Promise.all([
        getMockShieldIdentities(),
        getMockShieldAccesses(),
        getMockAILogs(),
      ]);
      setIdentities(identitiesData);
      setAccesses(accessesData);
      setAiLogs(aiLogsData);
    } catch (err) {
      setError('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const allActivities = useMemo(() => {
    const identityActivities = identities.map(transformShieldIdentity);
    const accessActivities = accesses.map(a => transformShieldAccess(a, identities));
    const aiActivities = aiLogs.map(transformAILog);
    
    return [...identityActivities, ...accessActivities, ...aiActivities]
      .sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));
  }, [identities, accesses, aiLogs]);

  const filteredActivities = useMemo(() => {
    return allActivities.filter((activity) => {
      const matchesSearch =
        filter.search === '' ||
        activity.website.toLowerCase().includes(filter.search.toLowerCase()) ||
        activity.action.toLowerCase().includes(filter.search.toLowerCase()) ||
        activity.shield_email.toLowerCase().includes(filter.search.toLowerCase());
      const matchesType = filter.activityType === 'all' || activity.activity_type === filter.activityType;
      const matchesWebsite = filter.website === 'all' || activity.website === filter.website;
      return matchesSearch && matchesType && matchesWebsite;
    });
  }, [allActivities, filter]);

  const websites = useMemo(() => {
    const set = new Set(allActivities.map(a => a.website));
    return ['all', ...Array.from(set)];
  }, [allActivities]);

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const selectActivity = (id) => {
    const activity = allActivities.find(a => a.id === id);
    setSelectedActivity(activity);
  };

  const clearSelection = () => {
    setSelectedActivity(null);
  };

  const stats = useMemo(() => ({
    total: allActivities.length,
    identityCreated: allActivities.filter(a => a.activity_type === ActivityType.IDENTITY_CREATED).length,
    loginDetected: allActivities.filter(a => a.activity_type === ActivityType.LOGIN_DETECTED).length,
    aiAction: allActivities.filter(a => a.activity_type === ActivityType.AI_ACTION).length,
  }), [allActivities]);

  return (
    <ActivityContext.Provider
      value={{
        activities: filteredActivities,
        allActivities,
        loading,
        error,
        filter,
        updateFilter,
        websites,
        selectedActivity,
        selectActivity,
        clearSelection,
        refreshActivities: loadActivities,
        stats,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContext;
