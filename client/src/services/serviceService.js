import axiosInstance from '../utils/axiosInstance';

const serviceService = {
  // Get all services with filters
  getServices: async (params = {}) => {
    const response = await axiosInstance.get('/services', { params });
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await axiosInstance.get(`/services/${id}`);
    return response.data;
  },

  // Create new service (Provider)
  createService: async (serviceData) => {
    const response = await axiosInstance.post('/services', serviceData);
    return response.data;
  },

  // Update service (Provider)
  updateService: async (id, serviceData) => {
    const response = await axiosInstance.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service (Provider)
  deleteService: async (id) => {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
  },

  // Get provider's services
  getMyServices: async () => {
    const response = await axiosInstance.get('/services/provider/my-services');
    return response.data;
  }
};

export default serviceService;
