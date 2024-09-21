import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const getProducts = () => api.get('/products');
export const getCategories = () => api.get('/categories');
export const createOrder = (orderData: any) => api.post('/orders', orderData);

// Ajoutez d'autres fonctions selon vos besoins

export const setAuthToken = (token: any) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};