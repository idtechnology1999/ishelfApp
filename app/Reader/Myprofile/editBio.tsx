import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readerProfile } from '../../readerAPI';
import axios from 'axios';
import { useReaderAuth } from '../_useReaderAuth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EditBio() {
  useReaderAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem('readerToken');
      if (token) {
        const response = await axios.get(`${API_URL}/api/readers/profile/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setName(response.data.fullName || '');
          setEmail(response.data.email || '');
          setPhone(response.data.phone || '');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await readerProfile.updateBio(name, email, phone);
      if (response.reader) {
        await AsyncStorage.setItem('readerData', JSON.stringify(response.reader));
      }
      Alert.alert('Success', 'Bio updated successfully');
      router.back();
    } catch (error: any) {
      console.error('Error updating bio:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update bio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#E85D54" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bio</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#999999"
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, loading && { opacity: 0.6 }]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  inputGroup: {
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 12,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },

  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#FFD4D1", // Light coral border
    backgroundColor: "#FFFFFF",
  },

  saveButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});