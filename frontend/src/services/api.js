import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

const api = axios.create({
  baseURL: baseURL,
});

// Generate or fetch a persistent unique user ID for this browser session to isolate data
const getUserId = () => {
  let userId = localStorage.getItem("waste_guide_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("waste_guide_user_id", userId);
  }
  return userId;
};

// Intercept all outgoing requests to inject the unique user ID in the headers
api.interceptors.request.use(
  (config) => {
    const userId = getUserId();
    if (userId) {
      config.headers["x-user-id"] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Scan waste item using the AI model
export const scanWaste = async (item) => {
  const response = await api.post("/scan", { item });
  return response.data;
};

// Fetch all scan history for list and analytics dashboard
export const getHistory = async () => {
  const response = await api.get("/history");
  return response.data;
};

// Fetch collection centers for the interactive map
export const getCenters = async () => {
  const response = await api.get("/centers");
  return response.data;
};

export default api;