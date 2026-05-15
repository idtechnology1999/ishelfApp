import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp2() {
  const router = useRouter();
  const [idFile, setIdFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('signupData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.idFile) setIdFile(data.idFile);
      }
    };
    loadData();
  }, []);

  const pickIdDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setIdFile({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || 'application/octet-stream',
        });
      }
    } catch {
      Alert.alert('Error', 'Could not open file picker. Please try again.');
    }
  };

  const handleContinue = async () => {
    if (!idFile) {
      Alert.alert('Required', 'Please upload a government-issued ID document.');
      return;
    }

    const saved = await AsyncStorage.getItem('signupData');
    const data = saved ? JSON.parse(saved) : {};
    await AsyncStorage.setItem('signupData', JSON.stringify({
      ...data,
      idFile,
      governmentId: idFile.name,
    }));
    router.replace("/Author/SignUp3");
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image-outline';
    if (mimeType === 'application/pdf') return 'document-text-outline';
    return 'document-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/Author/SignUp1")}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Identity Verification</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Government-Issued ID</Text>

            {/* Notice */}
            <View style={styles.noticeBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#1D4ED8" style={{ marginRight: 8 }} />
              <Text style={styles.noticeText}>
                Upload any valid government ID — NIN slip, International Passport, Driver's Licence, Voter's Card, or National ID Card. Your full name must match Step 1.
              </Text>
            </View>

            {/* File Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ID Document</Text>

              {idFile ? (
                <View style={styles.fileCard}>
                  <Ionicons name={getFileIcon(idFile.mimeType)} size={32} color="#E85D54" />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>{idFile.name}</Text>
                    <Text style={styles.fileType}>{idFile.mimeType.includes('pdf') ? 'PDF Document' : 'Image File'}</Text>
                  </View>
                  <TouchableOpacity onPress={pickIdDocument} style={styles.changeBtn}>
                    <Text style={styles.changeBtnText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBox} onPress={pickIdDocument}>
                  <Ionicons name="cloud-upload-outline" size={36} color="#E85D54" />
                  <Text style={styles.uploadText}>Tap to upload ID document</Text>
                  <Text style={styles.uploadSubText}>PDF, JPG, PNG accepted</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  backButton: { paddingVertical: 10, alignSelf: "flex-start", marginBottom: 30 },

  header: { marginBottom: 32 },

  title: { fontSize: 28, fontWeight: "700", color: "#E85D54", marginBottom: 20 },

  progressBarContainer: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFilled: { flex: 1, backgroundColor: "#E85D54" },
  progressBarEmpty: { flex: 2, backgroundColor: "#FFE8E6" },

  form: { flex: 1 },

  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 20 },

  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  noticeText: { flex: 1, fontSize: 13, color: '#1E40AF', lineHeight: 19 },

  inputContainer: { marginBottom: 28 },

  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 10 },

  uploadBox: {
    borderWidth: 2,
    borderColor: '#FFD4D1',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F9',
    gap: 6,
  },
  uploadText: { fontSize: 14, fontWeight: '600', color: '#E85D54' },
  uploadSubText: { fontSize: 12, color: '#aaa' },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD4D1',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFF9F9',
    gap: 12,
  },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#333' },
  fileType: { fontSize: 12, color: '#999', marginTop: 2 },
  changeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E85D54',
  },
  changeBtnText: { fontSize: 12, color: '#E85D54', fontWeight: '600' },

  continueButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#E85D54",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
});
