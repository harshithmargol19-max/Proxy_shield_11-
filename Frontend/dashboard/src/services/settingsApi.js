import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUser = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/user/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};

export default api;
