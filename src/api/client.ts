import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const apiClient = axios.create({
  baseURL: `${supabaseUrl}/functions/v1/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.message || 'API Error'));
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Having trouble connecting. Please wait...'));
    }
    return Promise.reject(error);
  },
);
