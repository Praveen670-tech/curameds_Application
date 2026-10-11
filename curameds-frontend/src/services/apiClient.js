import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8181/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('curameds_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected route, token could be expired
      // Do not auto-redirect if we are checking public pages
      if (window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/admin') ||
          window.location.pathname.startsWith('/patient') ||
          window.location.pathname.startsWith('/donor') ||
          window.location.pathname.startsWith('/ngo') ||
          window.location.pathname.startsWith('/medicalshop')) {
        localStorage.removeItem('curameds_token');
        localStorage.removeItem('curameds_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
