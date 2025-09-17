import axios from 'axios';

// Use Render backend URL, fallback to localhost in dev
// Default to local dev server on port 5000 when REACT_APP_API_URL is not set
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Add timestamp to help prevent caching issues
      config.headers['X-Timestamp'] = new Date().getTime();
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor: handle unauthorized
api.interceptors.response.use(
  (response) => {
    // Check for token expiring soon header
    if (response.headers['x-token-expiring-soon']) {
      // Try to refresh the token in the background
      api.post('/auth/refresh-token')
        .then(refreshResponse => {
          if (refreshResponse.data.token) {
            localStorage.setItem('token', refreshResponse.data.token);
          }
        })
        .catch(console.error);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await api.post('/auth/refresh-token');
        if (refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear the invalid token
        localStorage.removeItem('token');
        
        // Redirect to login with appropriate message
        const currentPath = window.location.pathname;
        let message = 'Please log in to continue.';
        
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&message=${encodeURIComponent(message)}`;
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
