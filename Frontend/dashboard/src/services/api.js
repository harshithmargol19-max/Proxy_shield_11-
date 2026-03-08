import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shield Identity endpoints (matches backend /api/shield-identity)
export const fetchIdentities = async () => {
  const response = await api.get('/shield-identity');
  return response.data;
};

export const fetchIdentityById = async (id) => {
  const response = await api.get(`/shield-identity/${id}`);
  return response.data;
};

export const createIdentity = async (data) => {
  const response = await api.post('/shield-identity', data);
  return response.data;
};

export const updateIdentity = async (id, data) => {
  const response = await api.put(`/shield-identity/${id}`, data);
  return response.data;
};

export const updateIdentityStatus = async (id, status) => {
  const response = await api.put(`/shield-identity/${id}`, { status });
  return response.data;
};

export const burnIdentity = async (id) => {
  const response = await api.put(`/shield-identity/${id}`, { status: 'burned' });
  return response.data;
};

export const deleteIdentity = async (id) => {
  const response = await api.delete(`/shield-identity/${id}`);
  return response.data;
};

// Fetch activity logs for a shield identity
export const fetchIdentityLogs = async (shieldId) => {
  const response = await api.get(`/shield-access/by-shield/${shieldId}`);
  return response.data;
};

export default api;
