import apiClient from './apiClient';

export const adminService = {
  async getStats() {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  async getUsers() {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },

  async verifyListing(id, status = 'VERIFIED') {
    const res = await apiClient.patch(`/admin/verify-listing/${id}`, { status });
    return res.data;
  }
};
