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

  getReferralCode: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get('/profile/referral', {
      headers: { Authorization: `Bearer ${token}` }
    });
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

export const readerBooks = {
  getAllBooks: async (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const response = await readerAPI.get(`/books?${params.toString()}`);
    return response.data;
  },

  getBookDetails: async (bookId: string) => {
    const response = await readerAPI.get(`/books/${bookId}`);
    return response.data;
  },

  recordPurchase: async (bookId: string, paymentReference: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.post('/books/purchase',
      { bookId, paymentReference },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getMyPurchases: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get('/books/my/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  downloadBook: async (bookId: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get(`/books/download/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    return response;
  },

  getBookContent: async (bookId: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get(`/books/read/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const readerCart = {
  getCartItems: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get('/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  addToCart: async (bookId: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await readerAPI.post('/cart/add',
      { bookId },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    return response.data;
  },

  removeFromCart: async (bookId: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.delete(`/cart/remove/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  clearCart: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.delete('/cart/clear', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const readerPayment = {
  initializePayment: async (bookId: string, email: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.post('/payment/initialize',
      { bookId, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  initializeCartPayment: async (bookIds: string[], email: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.post('/payment/initialize-cart',
      { bookIds, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get(`/payment/verify/${reference}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const readerReferral = {
  getNotifications: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get('/referral/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getSummary: async () => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.get('/referral/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  saveBankAccount: async (accountNumber: string, accountName: string, bankName: string, bankCode: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.post('/referral/bank-account',
      { accountNumber, accountName, bankName, bankCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  requestPayout: async (earningId: string) => {
    const token = await AsyncStorage.getItem('readerToken');
    const response = await readerAPI.post(`/referral/request-payout/${earningId}`, {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default readerAPI;
