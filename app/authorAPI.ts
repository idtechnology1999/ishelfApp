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
    return response.data;
  },

  uploadBook: async (bookData: any) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/book/upload', bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getDraftBook: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/book/draft', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getMyBooks: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/book/my-books', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateBook: async (bookId: string, bookData: any) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.patch(`/api/authors/book/${bookId}`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  uploadCoverImage: async (imageUri: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const formData = new FormData();
    
    // For web, handle blob differently
    if (imageUri.startsWith('blob:') || imageUri.startsWith('http')) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('coverImage', blob, 'cover.jpg');
    } else {
      // For mobile
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('coverImage', {
        uri: imageUri,
        name: filename || 'cover.jpg',
        type,
      } as any);
    }

    const response = await api.post('/api/authors/book/upload-cover', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadPdfFile: async (fileUri: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const formData = new FormData();
    
    // For web, handle blob differently
    if (fileUri.startsWith('blob:') || fileUri.startsWith('http')) {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      formData.append('pdfFile', blob, 'book.pdf');
    } else {
      // For mobile
      const filename = fileUri.split('/').pop();
      formData.append('pdfFile', {
        uri: fileUri,
        name: filename || 'book.pdf',
        type: 'application/pdf',
      } as any);
    }

    const response = await api.post('/api/authors/book/upload-pdf', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getBanks: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/subaccount/banks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  verifyAccount: async (accountNumber: string, bankCode: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/subaccount/verify-account',
      { accountNumber, bankCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  setupSubaccount: async (accountNumber: string, accountName: string, bankName: string, bankCode: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/subaccount/create',
      { accountNumber, accountName, bankName, bankCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getSubaccountStatus: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/subaccount/status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  initiateWithdrawal: async (amount: number) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/withdrawal/initiate',
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getDashboardStats: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getLatestPurchases: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/dashboard/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  initializePayment: async (email: string, amount: number) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/payment/initialize',
      { email, amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get(`/api/authors/payment/verify/${reference}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  checkActivePayment: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/payment/check-active', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  completeBookUpload: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/book/complete', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export default api;
