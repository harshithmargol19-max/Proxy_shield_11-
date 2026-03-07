import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchIdentities = async () => {
  const response = await api.get('/identities');
  return response.data;
};

export const fetchIdentityById = async (id) => {
  const response = await api.get(`/identities/${id}`);
  return response.data;
};

export const updateIdentityStatus = async (id, status) => {
  const response = await api.patch(`/identities/${id}/status`, { status });
  return response.data;
};

export const burnIdentity = async (id) => {
  const response = await api.post(`/identities/${id}/burn`);
  return response.data;
};

export const fetchIdentityLogs = async (id) => {
  const response = await api.get(`/identities/${id}/logs`);
  return response.data;
};

export default api;
