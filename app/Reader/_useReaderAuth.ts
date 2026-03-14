import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useReaderAuth = () => {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('readerToken');
      if (!token) {
        router.replace('/Reader/Login');
      }
    } catch (error) {
      router.replace('/Reader/Login');
    }
  };
};
