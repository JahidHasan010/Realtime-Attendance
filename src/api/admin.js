import { axiosInstance } from './auth';

const adminAPI = {
  getStudents: async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default adminAPI;