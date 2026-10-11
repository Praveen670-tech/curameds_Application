import apiClient from './apiClient';

export const historyService = {
  async getHistory() {
    const res = await apiClient.get('/history');
    return res.data;
  }
};
