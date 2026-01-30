import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor (add auth token if needed)
apiClient.interceptors.request.use((config) => {
  // NextAuth handles authentication automatically
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;