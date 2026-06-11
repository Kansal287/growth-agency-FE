import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  getAdminToken,
  clearAdminToken,
} from "./helpers";

// Configure active baseURL
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

axios.defaults.withCredentials = true;
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach correct token based on current route
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        const token = getAdminToken() || "";
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle JWT Expirations (401 status)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/admin")) {
          clearAdminToken();
          window.location.href = "/admin";
        } else {
          if (path !== "/" && path !== "/login") {
            window.location.href = "/login";
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
