// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
