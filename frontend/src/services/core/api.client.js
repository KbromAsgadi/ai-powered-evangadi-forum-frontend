
import axios from 'axios';

// Define the API URL OUTSIDE axios.create()
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://ai-powered-evangadi-forum-backend-ydsq.onrender.com/api';

/**
 * Configured axios instance for API communication.
 */
const apiClient = axios.create({
  baseURL: API_URL,
  // AI endpoints can take longer on free-tier hosting.
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Attach the JWT token to requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Handle global 401 unauthorized errors.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes('/api/auth/login') ||
      error.config?.url?.includes('/api/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }

    return Promise.reject(error);
  },
);

export { apiClient };
