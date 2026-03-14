import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminSetup() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/invite/verify/${token}`);
      setEmail(response.data.email);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Invalid or expired invitation link');
      router.replace('/admin/Login');
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/admin/invite/setup`, {
        token,
        fullName,
        password
      });

      Alert.alert('Success', 'Account setup completed', [
        { text: 'OK', onPress: () => router.replace('/admin/Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Setup failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E85D54" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Admin Setup</Text>
      <Text style={styles.subtitle}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Complete Setup</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E85D54',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    backgroundColor: '#E85D54',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
