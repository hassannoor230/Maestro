import axios from 'axios';

const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || '/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMenu = (params?: Record<string, string>) => API.get('/menu', { params });
export const getSettings = () => API.get('/settings');
export const getReviews = () => API.get('/reviews');
export const createReservation = (data: any) => API.post('/reservations', data);
export const login = (email: string, password: string) => API.post('/auth/login', { email, password });
export const getDashboard = (token: string) => API.get('/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
export const getReservations = (token: string) => API.get('/admin/reservations', { headers: { Authorization: `Bearer ${token}` } });
export const updateReservation = (id: string, status: string, token: string) =>
  API.patch(`/admin/reservations/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });

// Menu Admin
export const getAdminMenu = (token: string) => API.get('/admin/menu', { headers: { Authorization: `Bearer ${token}` } });
export const createMenuItem = (data: any, token: string) => API.post('/admin/menu', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateMenuItem = (id: string, data: any, token: string) => API.put(`/admin/menu/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteMenuItem = (id: string, token: string) => API.delete(`/admin/menu/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Settings Admin
export const updateSettings = (data: any, token: string) => API.put('/admin/settings', data, { headers: { Authorization: `Bearer ${token}` } });

// Image Upload
export const uploadImage = (file: File, token: string) => {
  const formData = new FormData();
  formData.append('image', file);
  return API.post('/admin/upload', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
};

// Reviews Admin
export const getAdminReviews = (token: string) => API.get('/admin/reviews', { headers: { Authorization: `Bearer ${token}` } });
export const createReview = (data: any, token: string) => API.post('/admin/reviews', data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteReview = (id: string, token: string) => API.delete(`/admin/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Messages Admin
export const getAdminMessages = (token: string) => API.get('/admin/messages', { headers: { Authorization: `Bearer ${token}` } });

export default API;
