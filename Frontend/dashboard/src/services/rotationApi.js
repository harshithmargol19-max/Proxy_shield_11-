import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRotationLogs = async () => {
  const response = await api.get('/identity-rotation');
  return response.data;
};

export const fetchRotationLogById = async (id) => {
  const response = await api.get(`/identity-rotation/${id}`);
  return response.data;
};

export const createRotationLog = async (data) => {
  const response = await api.post('/identity-rotation', data);
  return response.data;
};

export default api;
