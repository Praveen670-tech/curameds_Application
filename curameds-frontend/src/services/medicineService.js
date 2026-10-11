import apiClient from './apiClient';

export const medicineService = {
  async getAll(params = {}) {
    const res = await apiClient.get('/medicines', { params });
    return res.data;
  },

  async getMy() {
    const res = await apiClient.get('/medicines/my');
    return res.data;
  },

  async getById(id) {
    const res = await apiClient.get(`/medicines/${id}`);
    return res.data;
  },

  async create(medicineData) {
    const res = await apiClient.post('/medicines', medicineData);
    return res.data;
  },

  async update(id, medicineData) {
    const res = await apiClient.put(`/medicines/${id}`, medicineData);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/medicines/${id}`);
    return res.data;
  },

  async verify(id, status = 'VERIFIED') {
    const res = await apiClient.patch(`/medicines/${id}/verify`, { status });
    return res.data;
  }
};
