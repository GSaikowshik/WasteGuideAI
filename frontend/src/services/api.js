import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

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