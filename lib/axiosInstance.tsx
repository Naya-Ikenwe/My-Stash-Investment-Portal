import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";

const API = axios.create({
  baseURL: "/api", // now reads from env
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from Zustand store if available
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default API;
