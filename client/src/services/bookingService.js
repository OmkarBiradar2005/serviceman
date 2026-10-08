import axiosInstance from '../utils/axiosInstance';

const bookingService = {
  // Create new booking (Customer)
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  },

  // Get customer's bookings
  getMyBookings: async () => {
    const response = await axiosInstance.get('/bookings/customer/my-bookings');
    return response.data;
  },

  // Get provider's bookings
  getProviderBookings: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/provider/assigned', {
      params
    });
    return response.data;
  },

  // Get all bookings (Admin)
  getAllBookings: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/admin/all', { params });
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status (Provider)
  updateBookingStatus: async (id, status) => {
    const response = await axiosInstance.put(`/bookings/${id}/status`, {
      status
    });
    return response.data;
  },

  // Cancel booking (Customer)
  cancelBooking: async (id, cancellationReason) => {
    const response = await axiosInstance.put(`/bookings/${id}/cancel`, {
      cancellationReason
    });
    return response.data;
  }
};

export default bookingService;
