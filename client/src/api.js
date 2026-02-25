import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('casaperks_token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  
  // Store auth data
  localStorage.setItem('casaperks_token', token);
  localStorage.setItem('casaperks_user', JSON.stringify(user));
  
  return response.data;
};

export const getResidents = () => api.get('/residents');
export const getResident = (id) => api.get(`/residents/${id}`);
export const searchResidents = (query) => api.get(`/residents/search/${query}`);
export const updateResident = (id, data) => api.put(`/residents/${id}`, data);

export const getRewards = () => api.get('/rewards');
export const redeemReward = (residentId, giftCardId, quantity) => 
  api.post('/rewards/redeem', { residentId, giftCardId, quantity });
export const getTransactions = (residentId) => api.get(`/rewards/transactions/${residentId}`);

export const adminGetResidents = () => api.get('/admin/residents');
export const adminAddPoints = (residentId, points, reason) =>
  api.post('/admin/add-points', { residentId, points, reason });
export const adminExport = () => api.get('/admin/export');

export default api;
