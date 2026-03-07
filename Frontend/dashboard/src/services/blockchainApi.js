import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAuditLogs = async () => {
  const response = await api.get('/audit-log');
  return response.data;
};

export const fetchAuditLogById = async (id) => {
  const response = await api.get(`/audit-log/${id}`);
  return response.data;
};

export const createAuditLog = async (data) => {
  const response = await api.post('/audit-log', data);
  return response.data;
};

export default api;
