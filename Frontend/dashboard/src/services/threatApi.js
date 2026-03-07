import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchThreatEvents = async () => {
  const response = await api.get('/threat-event');
  return response.data;
};

export const fetchThreatEventById = async (id) => {
  const response = await api.get(`/threat-event/${id}`);
  return response.data;
};

export const createThreatEvent = async (data) => {
  const response = await api.post('/threat-event', data);
  return response.data;
};

export const updateThreatEvent = async (id, data) => {
  const response = await api.put(`/threat-event/${id}`, data);
  return response.data;
};

export const deleteThreatEvent = async (id) => {
  const response = await api.delete(`/threat-event/${id}`);
  return response.data;
};

export default api;
