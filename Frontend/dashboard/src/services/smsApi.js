import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMessages = async () => {
  const response = await api.get('/communication-proxy');
  return response.data;
};

export const fetchMessageById = async (id) => {
  const response = await api.get(`/communication-proxy/${id}`);
  return response.data;
};

export const createMessage = async (data) => {
  const response = await api.post('/communication-proxy', data);
  return response.data;
};

export default api;
