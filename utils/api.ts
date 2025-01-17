import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL as apiUrl } from '../env';

const API_URL = apiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', accept: 'application/json' },
});

const apiFormData = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'multipart/form-data', accept: 'application/json' },
});

// Interceptor to add the token to the headers
api.interceptors.request.use(async (config) => {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiFormData.interceptors.request.use(async (config) => {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Function to handle response errors
const handleResponseError = async (error: any, navigate: any) => {
  if (error.response?.status === 401) {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    if (!refreshToken) {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      navigate('/login');
      throw error;
    }

    try {
      const refreshResponse = await api.post('authentication/token/refresh/', { refresh: refreshToken });
      const { access, refresh } = refreshResponse.data;
      await SecureStore.setItemAsync('accessToken', access);
      await SecureStore.setItemAsync('refreshToken', refresh);

      // Retry the original request with the new token
      error.config.headers.Authorization = `Bearer ${access}`;
      return api.request(error.config);
    } catch (refreshError) {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      navigate('/login');
      throw refreshError;
    }
  }
  throw error;
};

// Using interceptors to handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // navigate should be passed as a parameter
    return Promise.reject(error);
  }
);

apiFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    // navigate should be passed as a parameter
    return Promise.reject(error);
  }
);

// Exporting functions for API calls
export const apiRequest = (config: any) => api(config);
export const apiFormDataRequest = (config: any) => apiFormData(config);
export const handleResponseErrorWithNavigate = handleResponseError;
