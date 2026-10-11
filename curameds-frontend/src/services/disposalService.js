import apiClient from './apiClient';

export const disposalService = {
  async getAll() {
    const res = await apiClient.get('/disposal');
    return res.data;
  },

  async create(disposalData) {
    const res = await apiClient.post('/disposal', disposalData);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await apiClient.put(`/disposal/${id}/status`, { status });
    return res.data;
  }
};
