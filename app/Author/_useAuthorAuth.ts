import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthorAuth = () => {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authorToken');
      if (!token) {
        router.replace('/Author/Login');
      }
    } catch (error) {
      router.replace('/Author/Login');
    }
  };
};
