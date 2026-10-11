import apiClient from './apiClient';

export const inventoryService = {
  async getAll() {
    const res = await apiClient.get('/inventory');
    return res.data;
  },

  async create(itemData) {
    const res = await apiClient.post('/inventory', itemData);
    return res.data;
  },

  async update(id, itemData) {
    const res = await apiClient.put(`/inventory/${id}`, itemData);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/inventory/${id}`);
    return res.data;
  }
};
