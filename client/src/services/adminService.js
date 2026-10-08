import axiosInstance from '../utils/axiosInstance';

const adminService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    const response = await axiosInstance.put(`/admin/users/${id}/status`, {
      isActive
    });
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  }
};

export default adminService;
