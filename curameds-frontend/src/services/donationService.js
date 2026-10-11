import apiClient from './apiClient';

export const donationService = {
  async getAll() {
    const res = await apiClient.get('/donations');
    return res.data;
  },

  async getMy() {
    const res = await apiClient.get('/donations/my');
    return res.data;
  },

  async create(donationData) {
    const res = await apiClient.post('/donations', donationData);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await apiClient.put(`/donations/${id}/status`, { status });
    return res.data;
  }
};
