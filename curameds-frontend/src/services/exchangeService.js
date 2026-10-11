import apiClient from './apiClient';

export const exchangeService = {
  async getAll() {
    const res = await apiClient.get('/exchanges');
    return res.data;
  },

  async getMy() {
    const res = await apiClient.get('/exchanges/my');
    return res.data;
  },

  async create(exchangeData) {
    const res = await apiClient.post('/exchanges', exchangeData);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await apiClient.put(`/exchanges/${id}/status`, { status });
    return res.data;
  }
};
