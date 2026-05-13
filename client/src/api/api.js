import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Ajout du token à chaque requête si présent
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('carmel_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createOrder = (data) => API.post('/orders', data);
export const getOrders = () => API.get('/orders');
export const getMyOrders = () => API.get('/orders/my-orders');
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
export const getOrderStats = () => API.get('/orders/stats');
export const trackOrder = (orderNumber) => API.get(`/orders/track/${orderNumber}`);
export const createReservation = (data) => API.post('/reservations', data);
export const getReservations = () => API.get('/reservations');
export const updateReservationStatus = (id, status) => API.patch(`/reservations/${id}/status`, { status });
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);
export const sendMessage = (data) => API.post('/contact', data);
export const getMessages = () => API.get('/contact');

export const validatePromo = (code) => API.post('/promos/validate', { code });
export const getPromos = () => API.get('/promos');
export const createPromo = (data) => API.post('/promos', data);
export const deletePromo = (id) => API.delete(`/promos/${id}`);

export const getMenu = () => API.get('/menu/admin');
export const createMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

export const updateUser = (data) => API.put('/users/profile', data);
export const adminLogin = (password) => API.post('/users/admin-login', { password });
