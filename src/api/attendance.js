import { axiosInstance } from './auth';

const attendanceAPI = {
  recognizeFace: async (frameData) => {
    try {
      const response = await axiosInstance.post('/attendance/recognize', {
        frame: frameData
      });
      return response.data;
    } catch (error) {
      console.error('Error recognizing face:', error);
      throw error;
    }
  }
};

export default attendanceAPI;