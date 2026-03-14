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

export default function EditAcademic() {
  useReaderAuth();
  const router = useRouter();
  const [university, setUniversity] = useState("");
  const [level, setLevel] = useState("");
  const [course, setCourse] = useState("");
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
          setUniversity(response.data.institution || '');
          setLevel(response.data.level || '');
          setCourse(response.data.department || '');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await readerProfile.updateAcademic(university, level, course);
      if (response.reader) {
        await AsyncStorage.setItem('readerData', JSON.stringify(response.reader));
      }
      Alert.alert('Success', 'Academic details updated successfully');
      router.back();
    } catch (error: any) {
      console.error('Error updating academic details:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update academic details');
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
            <Text style={styles.headerTitle}>Academic Details</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* University Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>University</Text>
              <TextInput
                style={styles.input}
                value={university}
                onChangeText={setUniversity}
                placeholder="Enter your university"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Level Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Level</Text>
              <TextInput
                style={styles.input}
                value={level}
                onChangeText={setLevel}
                placeholder="Enter your level"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Course Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Course of study</Text>
              <TextInput
                style={styles.input}
                value={course}
                onChangeText={setCourse}
                placeholder="Enter your course"
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