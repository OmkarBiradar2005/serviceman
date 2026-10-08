import axiosInstance from '../utils/axiosInstance';

const reviewService = {
  // Create review (Customer)
  createReview: async (reviewData) => {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a service
  getServiceReviews: async (serviceId, params = {}) => {
    const response = await axiosInstance.get(`/reviews/service/${serviceId}`, {
      params
    });
    return response.data;
  },

  // Get all reviews (Admin)
  getAllReviews: async (params = {}) => {
    const response = await axiosInstance.get('/reviews/admin/all', { params });
    return response.data;
  },

  // Delete review (Admin)
  deleteReview: async (id) => {
    const response = await axiosInstance.delete(`/reviews/${id}`);
    return response.data;
  },

  // Toggle review approval (Admin)
  toggleReviewApproval: async (id) => {
    const response = await axiosInstance.put(`/reviews/${id}/approve`);
    return response.data;
  }
};

export default reviewService;
