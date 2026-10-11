import apiClient from './apiClient';

export const discountService = {
  async getAll() {
    const res = await apiClient.get('/discounts');
    return res.data;
  },

  async create(discountData) {
    const res = await apiClient.post('/discounts', discountData);
    return res.data;
  }
};
