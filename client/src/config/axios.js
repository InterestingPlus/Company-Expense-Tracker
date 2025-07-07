// src/config/axios.js
import axios from "axios";
import { toast } from "react-toastify";
import apiPath from "../isProduction";

const axiosInstance = axios.create({
  baseURL: `${await apiPath()}/api/v1`,
});

// Automatically attach JWT to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 403 response
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 403) {
      localStorage.removeItem("token"); // Remove token
      toast.error("Session expired. Please login again.");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
