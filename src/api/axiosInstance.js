import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://spd-lab-backend-db797613f87b.herokuapp.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// Request interceptor — attach token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('userToken');
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
