import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach access token to each request
API.interceptors.request.use((config) => {
  // ALWAYS get token from cookies (to match middleware)
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors for non-refresh requests
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting to refresh token...");
        
        // Call refresh endpoint
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "/api"}/user/refresh`,
          {},
          { 
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        const newAccessToken = refreshResponse.data.access_token;
        
        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        console.log("✅ Token refreshed successfully");

        // CRITICAL: Update BOTH Zustand AND Cookies
        useAuthStore.getState().setAccessToken(newAccessToken);
        Cookies.set("access_token", newAccessToken, { expires: 1, path: "/" });

        // Update Authorization header for retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", refreshError);
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Clear all auth data
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user");
        useAuthStore.getState().logout();
        
        // Redirect to login if in browser
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;