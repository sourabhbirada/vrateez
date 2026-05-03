import axios from "axios";
import { getToken } from "./storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
    (error) => {
      const responseData = error?.response?.data;

      const message =
        responseData?.message ||
        responseData?.error ||
        responseData?.errors?.[0]?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  },
);

export default api;
