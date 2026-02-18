
// api/reports.js
import { axiosInstance } from './auth';

const reportsAPI = {
  getAttendanceReport: async (subject, date) => {
    try {
      const response = await axiosInstance.get('/reports/', {
        params: { subject, date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }
};

export default reportsAPI;