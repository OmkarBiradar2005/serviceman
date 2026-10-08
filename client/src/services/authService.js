import axiosInstance from '../utils/axiosInstance';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/auth/profile', userData);
    return response.data;
  }
};

export default authService;
