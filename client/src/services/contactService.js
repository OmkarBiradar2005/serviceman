import axiosInstance from '../utils/axiosInstance';

const contactService = {
  // Submit contact form
  submitContact: (contactData) => {
    return axiosInstance.post('/contact', contactData);
  },

  // Get all contacts (Admin only)
  getAllContacts: (status) => {
    const params = status ? { status } : {};
    return axiosInstance.get('/contact', { params });
  },

  // Update contact status (Admin only)
  updateContactStatus: (id, status) => {
    return axiosInstance.put(`/contact/${id}/status`, { status });
  },

  // Delete contact (Admin only)
  deleteContact: (id) => {
    return axiosInstance.delete(`/contact/${id}`);
  },
};

export default contactService;
