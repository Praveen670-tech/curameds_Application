import apiClient from './apiClient';

export const authService = {
  async login(username, password) {
    const res = await apiClient.post('/auth/login', { username, password });
    if (res.data && res.data.token) {
      localStorage.setItem('curameds_token', res.data.token);
      localStorage.setItem('curameds_user', JSON.stringify({
        username: res.data.username,
        role: res.data.role
      }));
    }
    return res.data;
  },

  async register(userData) {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  async getCurrentUser() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout() {
    localStorage.removeItem('curameds_token');
    localStorage.removeItem('curameds_user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('curameds_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('curameds_token');
  }
};
