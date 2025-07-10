// lib/api.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
const Api = {
  // Contact APIs
  createContact: (data) => apiClient.post('/contacts', data),
  getContacts: (page = 1, limit = 10) => apiClient.get(`/contacts?page=${page}&limit=${limit}`),
  getContactById: (id) => apiClient.get(`/contacts/${id}`),
  deleteContact: (id) => apiClient.delete(`/contacts/${id}`),

  // Health Check
  healthCheck: () => apiClient.get('/health'),
};

export default Api;
