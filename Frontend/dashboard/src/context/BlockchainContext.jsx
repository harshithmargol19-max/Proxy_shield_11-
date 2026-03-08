import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAuditLogs } from '../services/blockchainApi';
import { AuditAction, VerificationStatus, defaultBlockchainFilter } from '../types/blockchain';

const BlockchainContext = createContext(null);

export const useBlockchainLogs = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchainLogs must be used within BlockchainProvider');
  }
  return context;
};

const transformAuditLog = (log) => {
  const service = log.shield_id?.linked_services?.[0] || 'Unknown Service';
  const verification_status = log.blockchain_hash ? VerificationStatus.VERIFIED : VerificationStatus.PENDING;
  
  const date = new Date(log.timestamp);
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  const shortHash = log.blockchain_hash 
    ? log.blockchain_hash.substring(0, 10) + '...' 
    : 'N/A';
  
  return {
    id: log._id,
    event: log.action,
    service_name: service,
    timestamp: timeStr,
    fullDate: log.timestamp,
    transaction_hash: log.blockchain_hash || 'N/A',
    short_hash: shortHash,
    verification_status: verification_status,
    shield_email: log.shield_id?.proxy_email || 'N/A',
    metadata: log.metadata || {},
    rawLog: log,
  };
};

export const BlockchainProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(defaultBlockchainFilter);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAuditLogs();
      const data = response.data || response;
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load blockchain logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const transformedLogs = useMemo(() => logs.map(transformAuditLog), [logs]);

  const filteredLogs = useMemo(() => {
    return transformedLogs
      .filter((log) => {
        const matchesSearch =
          filter.search === '' ||
          log.service_name.toLowerCase().includes(filter.search.toLowerCase()) ||
          log.event.toLowerCase().includes(filter.search.toLowerCase()) ||
          log.transaction_hash.toLowerCase().includes(filter.search.toLowerCase());
        const matchesAction = filter.action === 'all' || log.event === filter.action;
        const matchesVerification = filter.verificationStatus === 'all' || log.verification_status === filter.verificationStatus;
        return matchesSearch && matchesAction && matchesVerification;
      })
      .sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));
  }, [transformedLogs, filter]);

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const selectLog = (id) => {
    const log = transformedLogs.find((l) => l.id === id);
    setSelectedLog(log);
  };

  const clearSelection = () => {
    setSelectedLog(null);
  };

  const stats = useMemo(() => ({
    total: logs.length,
    verified: logs.filter((l) => l.blockchain_hash).length,
    rotation: logs.filter((l) => l.action === AuditAction.ROTATION).length,
    burn: logs.filter((l) => l.action === AuditAction.BURN).length,
    login: logs.filter((l) => l.action === AuditAction.LOGIN_ATTEMPT).length,
    filtered: logs.filter((l) => l.action === AuditAction.COMMUNICATION_FILTERED).length,
  }), [logs]);

  return (
    <BlockchainContext.Provider
      value={{
        logs: filteredLogs,
        allLogs: transformedLogs,
        rawLogs: logs,
        loading,
        error,
        filter,
        updateFilter,
        selectedLog,
        selectLog,
        clearSelection,
        refreshLogs: loadLogs,
        stats,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContext;
