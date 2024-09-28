import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_SERVER_API_URI : "",
  headers: {
    Authorization: "Bearer YOUR_GITHUB_TOKEN",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
