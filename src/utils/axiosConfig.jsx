import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8001/api", // Set base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Set default headers
    // Add any other headers you need, such as Authorization
  },
});

// Optional: Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here, e.g., adding a token
    const token = localStorage.getItem("token"); // Example: retrieve token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Set Authorization header
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here if needed
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
