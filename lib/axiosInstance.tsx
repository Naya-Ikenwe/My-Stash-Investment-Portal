import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";

const API = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: "/api",
  withCredentials: true, // important if using cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage if no cookie yet
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// // 1. Request Interceptor: Attach Token
// apiClient.interceptors.request.use(
//   (config) => {
//     // Read token directly from Zustand store (even outside React components)
//     const token = useAuthStore.getState().token;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// 2. Response Interceptor: Handle Global Errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If 401 (Unauthorized), clear store and redirect to login
      useAuthStore.getState().logout();

      // Optional: Force redirect if not handled by router
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default API;
