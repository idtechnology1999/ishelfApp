import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.i-shelf.app';

console.log('[authorAPI] Using API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.message?.includes('Session expired')) {
      await AsyncStorage.multiRemove(['authorToken', 'authorData', 'authorProfileImage']);
    }
    return Promise.reject(error);
  }
);

export const authorAPI = {
  register: async (authorData: any) => {
    // Use fetch instead of axios — axios has known issues with FormData on React Native Android
    const response = await fetch(`${API_URL}/api/authors/register`, {
      method: 'POST',
      body: authorData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data, status: response.status } };
    }
    return data;
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
      },
    });
    return response.data;
  },

  updateBookCoverImage: async (bookId: string, imageUri: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const formData = new FormData();

    if (imageUri.startsWith('blob:') || imageUri.startsWith('http')) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('coverImage', blob, 'cover.jpg');
    } else {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('coverImage', { uri: imageUri, name: filename || 'cover.jpg', type } as any);
    }

    const response = await api.post(`/api/authors/book/${bookId}/upload-cover`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateBookPdfFile: async (bookId: string, fileUri: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const formData = new FormData();

    if (fileUri.startsWith('blob:') || fileUri.startsWith('http')) {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      formData.append('pdfFile', blob, 'book.pdf');
    } else {
      const filename = fileUri.split('/').pop();
      formData.append('pdfFile', { uri: fileUri, name: filename || 'book.pdf', type: 'application/pdf' } as any);
    }

    const response = await api.post(`/api/authors/book/${bookId}/upload-pdf`, formData, {
      headers: { Authorization: `Bearer ${token}` },
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

  getPaymentMode: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/withdrawal/payment-mode', {
      headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getWithdrawalHistory: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/withdrawal/history', {
      headers: { Authorization: `Bearer ${token}` }
    });
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

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/authors/forgot-password', { email });
    return response.data;
  },

  verifyCode: async (email: string, code: string) => {
    const response = await api.post('/api/authors/verify-code', { email, code });
    return response.data;
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    const response = await api.post('/api/authors/reset-password', { email, code, newPassword });
    return response.data;
  },

  completeBookUpload: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.post('/api/authors/book/complete', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getNotifications: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.get('/api/authors/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.patch(`/api/authors/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const token = await AsyncStorage.getItem('authorToken');
    const response = await api.patch('/api/authors/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export default api;
