import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    console.log('Interceptor - Token exists:', token ? 'Yes' : 'No');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor - Added Authorization header');
      console.log('Interceptor - Full URL:', config.baseURL + config.url);
    } else {
      console.log('Interceptor - No token found');
    }
    
    return config;
  },
  (error) => {
    console.error('Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;