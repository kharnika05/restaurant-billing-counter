import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('royal_feast_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on login page, clear state and redirect
      if (window.location.pathname !== '/login' && window.location.pathname !== '/qr-menu') {
        localStorage.removeItem('royal_feast_token');
        localStorage.removeItem('royal_feast_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
