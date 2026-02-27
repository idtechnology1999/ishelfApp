import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const readerAPI = axios.create({
  baseURL: `${API_URL}/api/readers`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const readerAuth = {
  register: async (fullName: string, email: string, institution: string, password: string) => {
    const response = await readerAPI.post('/register', {
      fullName,
      email,
      institution,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await readerAPI.post('/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('readerToken', response.data.token);
      await AsyncStorage.setItem('readerData', JSON.stringify(response.data.reader));
    }
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await readerAPI.post('/forgot-password', { email });
    return response.data;
  },

  verifyCode: async (email: string, code: string) => {
    const response = await readerAPI.post('/verify-code', { email, code });
    return response.data;
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    const response = await readerAPI.post('/reset-password', { email, code, newPassword });
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('readerToken');
    await AsyncStorage.removeItem('readerData');
    await AsyncStorage.removeItem('readerProfileImage');
  },
};

export const readerProfile = {
  getProfile: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateBio: async (fullName: string, email: string, phone: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.put('/profile/bio', 
      { fullName, email, phone },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.reader) {
      await AsyncStorage.setItem('readerData', JSON.stringify(response.data.reader));
    }
    return response.data;
  },

  updateAcademic: async (institution: string, level: string, department: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.put('/profile/academic',
      { institution, level, department },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.reader) {
      await AsyncStorage.setItem('readerData', JSON.stringify(response.data.reader));
    }
    return response.data;
  },

  uploadProfileImage: async (imageUri: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\ w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('profileImage', {
      uri: imageUri,
      name: filename || 'profile.jpg',
      type,
    } as any);

    const response = await readerAPI.post('/profile/image', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default readerAPI;
