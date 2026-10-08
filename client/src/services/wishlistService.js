import axiosInstance from '../utils/axiosInstance';

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await axiosInstance.get('/wishlist');
    return response.data;
  },

  // Add service to wishlist
  addToWishlist: async (serviceId) => {
    const response = await axiosInstance.post(`/wishlist/${serviceId}`);
    return response.data;
  },

  // Remove service from wishlist
  removeFromWishlist: async (serviceId) => {
    const response = await axiosInstance.delete(`/wishlist/${serviceId}`);
    return response.data;
  },

  // Check if service is in wishlist
  checkWishlist: async (serviceId) => {
    const response = await axiosInstance.get(`/wishlist/check/${serviceId}`);
    return response.data;
  }
};

export default wishlistService;
