import { axiosInstance } from './auth';

const sessionAPI = {
  startSession: async (subject) => {
    try {
      const response = await axiosInstance.post('/sessions/start', { subject });
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  stopSession: async () => {
    try {
      const response = await axiosInstance.post('/sessions/stop');
      return response.data;
    } catch (error) {
      console.error('Error stopping session:', error);
      throw error;
    }
  },

  getActiveSession: async () => {
    try {
      const response = await axiosInstance.get('/sessions/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active session:', error);
      return { is_active: false, session: null };
    }
  }
};

export default sessionAPI;