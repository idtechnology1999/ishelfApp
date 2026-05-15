import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Upload6() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDraftBook();
  }, []);

  const loadDraftBook = async () => {
    try {
      await authorAPI.getDraftBook();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!confirmed) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm ownership and acceptance of Terms & Conditions."
      );
      return;
    }

    setLoading(true);
    try {
      await authorAPI.completeBookUpload();
      router.replace("/Author/book/UploadSuccessful");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to complete upload"
      );
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
            <Text style={styles.headerTitle}>Upload</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Final Step</Text>
              <Text style={styles.progressCounter}>6/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Combined Confirmation Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setConfirmed(!confirmed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
                {confirmed && (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                I confirm that I am the owner of this content or have full rights
                to publish it, and I accept the{" "}
                <Text style={styles.termsLink}>Terms & Conditions</Text>.
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Upload Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.uploadButton, loading && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload</Text>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#E85D54",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 36,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E85D54",
  },
  progressCounter: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  progressBarContainer: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFilled: {
    flex: 1,
    backgroundColor: "#E85D54",
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFD4D1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#E85D54",
    borderColor: "#E85D54",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  termsLink: {
    color: "#E85D54",
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#FFD4D1",
  },
  uploadButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
