import apiClient from './apiClient';

export const familyService = {
  async getAll() {
    const res = await apiClient.get('/family');
    return res.data;
  },

  async create(memberData) {
    const res = await apiClient.post('/family', memberData);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/family/${id}`);
    return res.data;
  }
};
