// axiosInstance.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Public routes that don't need Authorization
const PUBLIC_ROUTES = ['/login', '/register', '/auth/sign-in', '/auth/login'];

// Create an Axios instance with a base URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://your-production-api.com' // Production API
    : 'http://10.0.0.217:3000', // Development API
  timeout: 5000, // Set timeout for requests
});

// Add request interceptor
// axiosInstance.interceptors.request.use(
//   (config: any) => {
//     // Check if the route is public
//     if (!PUBLIC_ROUTES.includes(config.url || '')) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers = {
//           ...config.headers,
//           Authorization: `Bearer ${token}`,
//         };
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     if (error.response?.status === 401) {
//       console.error('Unauthorized! Redirecting to login...');
//       // Redirect to login page or handle unauthorized access
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
