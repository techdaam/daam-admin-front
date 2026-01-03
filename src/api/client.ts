import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.danaam.sa/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
