import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchIdentities, burnIdentity as burnIdentityApi, createIdentity as createIdentityApi } from '../services/api';
import { IdentityStatus, defaultFilter } from '../types/identity';

const IdentityContext = createContext(null);

export const useIdentities = () => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error('useIdentities must be used within IdentityProvider');
  }
  return context;
};

export const IdentityProvider = ({ children }) => {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(defaultFilter);
  const [selectedIdentity, setSelectedIdentity] = useState(null);

  const loadIdentities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchIdentities();
      // Handle API response - data may be nested in response.data
      const rawData = response.data || response;
      // Transform backend data to match frontend expectations
      const transformedData = (Array.isArray(rawData) ? rawData : []).map(identity => ({
        ...identity,
        id: identity._id || identity.id,
        website: identity.linked_services?.[0] || identity.website || 'Unknown',
        shieldEmail: identity.proxy_email || identity.shieldEmail,
        shieldPhone: identity.proxy_phone || identity.shieldPhone,
        creationDate: identity.creation_time || identity.creationDate,
        lastActivity: identity.last_used || identity.lastActivity || 'Never',
      }));
      setIdentities(transformedData);
    } catch (err) {
      setError('Failed to load identities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIdentities();
  }, [loadIdentities]);

  const filteredIdentities = identities
    .filter((identity) => {
      const matchesSearch =
        filter.search === '' ||
        (identity.website || '').toLowerCase().includes(filter.search.toLowerCase()) ||
        (identity.shieldEmail || '').toLowerCase().includes(filter.search.toLowerCase());
      const matchesStatus = filter.status === 'all' || identity.status === filter.status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (filter.sortBy) {
        case 'website':
          comparison = (a.website || '').localeCompare(b.website || '');
          break;
        case 'creationDate':
          comparison = new Date(a.creationDate || 0) - new Date(b.creationDate || 0);
          break;
        case 'lastActivity':
          comparison = (a.lastActivity || '').localeCompare(b.lastActivity || '');
          break;
        case 'status':
          const statusOrder = { [IdentityStatus.ACTIVE]: 0, [IdentityStatus.SUSPICIOUS]: 1, [IdentityStatus.BURNED]: 2 };
          comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
          break;
        default:
          comparison = 0;
      }
      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const getIdentityById = (id) => {
    return identities.find((i) => i.id === id);
  };

  const selectIdentity = (id) => {
    const identity = getIdentityById(id);
    setSelectedIdentity(identity);
  };

  const clearSelection = () => {
    setSelectedIdentity(null);
  };

  const burnIdentityAction = async (id) => {
    setIdentities((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: IdentityStatus.BURNED } : i))
    );
  };

  const createIdentityAction = async (data) => {
    try {
      const response = await createIdentityApi(data);
      // Response structure: { statusCode, message, data: {...identity}, success }
      const newIdentity = response.data || response;
      // Refresh identities to get the new one
      await loadIdentities();
      return { success: true, identity: newIdentity };
    } catch (err) {
      console.error('Failed to create identity:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const stats = {
    total: identities.length,
    active: identities.filter((i) => i.status === IdentityStatus.ACTIVE).length,
    suspicious: identities.filter((i) => i.status === IdentityStatus.SUSPICIOUS).length,
    burned: identities.filter((i) => i.status === IdentityStatus.BURNED).length,
  };

  return (
    <IdentityContext.Provider
      value={{
        identities: filteredIdentities,
        allIdentities: identities,
        loading,
        error,
        filter,
        updateFilter,
        selectedIdentity,
        selectIdentity,
        clearSelection,
        burnIdentity: burnIdentityAction,
        createIdentity: createIdentityAction,
        refreshIdentities: loadIdentities,
        stats,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};

export default IdentityContext;
