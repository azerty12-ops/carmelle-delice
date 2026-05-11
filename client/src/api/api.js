import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export const createOrder = (data) => API.post('/orders', data);
export const getOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
export const getOrderStats = () => API.get('/orders/stats');
export const createReservation = (data) => API.post('/reservations', data);
export const sendMessage = (data) => API.post('/contact', data);

export const validatePromo = (code) => API.post('/promos/validate', { code });
export const getPromos = () => API.get('/promos');
export const createPromo = (data) => API.post('/promos', data);
export const deletePromo = (id) => API.delete(`/promos/${id}`);
