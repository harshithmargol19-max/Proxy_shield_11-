import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchShieldIdentities = async () => {
  const response = await api.get('/shield-identity');
  return response.data;
};

export const fetchShieldAccesses = async () => {
  const response = await api.get('/shield-access');
  return response.data;
};

export const fetchAILogs = async () => {
  const response = await api.get('/ai-log');
  return response.data;
};

export default api;
