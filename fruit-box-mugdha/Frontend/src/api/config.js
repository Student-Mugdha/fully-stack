import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading state if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    // Handle different error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem("token");
          localStorage.removeItem("Vendors");
          // Let components handle the navigation
          error.isAuthError = true;
          break;
        case 403:
          // Handle forbidden access
          console.error("Access forbidden");
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Server error");
          break;
        default:
          console.error("An error occurred");
      }
    } else if (error.request) {
      // Handle network errors
      console.error("Network error - no response received");
    } else {
      // Handle other errors
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
