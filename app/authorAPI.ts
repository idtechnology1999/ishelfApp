import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authorAPI = {
  register: async (authorData: any) => {
    const response = await api.post('/api/authors/register', authorData);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/authors/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authorToken', response.data.token);
      await AsyncStorage.setItem('authorData', JSON.stringify(response.data.author));
    }
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.patch('/api/authors/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.author) {
      await AsyncStorage.setItem('authorData', JSON.stringify(response.data.author));
    }
    return response.data;
  },
};

export default api;
