
// api/reports.js
import { axiosInstance } from './auth';

const reportsAPI = {
  getAttendanceReport: async (subject, date) => {
    try {
      // 🚀 FORCE QUERY STRING FORMAT: Manually build URL to prevent Axios/Vercel slash issues
      // This ensures the URL is exactly "/reports/?subject=...&date=..."
      const query = new URLSearchParams({ subject, date }).toString();
      const response = await axiosInstance.get(`/reports/?${query}`);
      
      // console.log('Raw Report Response:', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }
};

export default reportsAPI;