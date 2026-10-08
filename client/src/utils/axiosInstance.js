import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
  // Use Render backend URL in production through Vercel environment variable
  // Falls back to /api for local development if the variable is not set
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is expired or unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;