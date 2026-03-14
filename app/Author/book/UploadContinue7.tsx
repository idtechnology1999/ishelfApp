import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
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

export default function Upload7() {
  const router = useRouter();
  const [tags, setTags] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDraftBook();
  }, []);

  const loadDraftBook = async () => {
    try {
      const response = await authorAPI.getDraftBook();
      if (response.book && response.book.keywords) {
        setTags(response.book.keywords.join(", "));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!acceptTerms) {
      Alert.alert("Terms & Conditions", "Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const keywords = tags.split(",").map(k => k.trim()).filter(k => k);
      // Save final keywords
      await authorAPI.uploadBook({ keywords });
      // Complete the book upload (marks payment as exhausted)
      await authorAPI.completeBookUpload();
      router.replace("/Author/book/UploadSuccessful");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to complete upload");
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
              <Text style={styles.progressTitle}>
                Additional Smart Features
              </Text>
              <Text style={styles.progressCounter}>6/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Tag/Keyword */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Keywords (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={tags}
                onChangeText={setTags}
                placeholder="e.g. Mathematics, Calculus, Engineering"
              />
            </View>

            {/* Accept Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                <Text style={styles.termsLink}>Accept Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Upload Button - Fixed at bottom */}
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
    color: "#E85D54", // I-SHELF coral red
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
    color: "#E85D54", // I-SHELF coral red
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
    backgroundColor: "#E85D54", // I-SHELF coral red - 100% complete
  },

  form: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  uploadSection: {
    marginBottom: 32,
  },

  uploadLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },

  uploadBox: {
    borderWidth: 2,
    borderColor: "#E85D54", // I-SHELF coral red
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FFF9F8", // Very light coral tint
  },

  uploadTextContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  uploadMainText: {
    fontSize: 15,
    marginBottom: 8,
  },

  uploadLink: {
    color: "#E85D54", // I-SHELF coral red
    fontWeight: "600",
  },

  uploadOr: {
    color: "#666",
  },

  uploadDrag: {
    color: "#333",
  },

  uploadSubText: {
    fontSize: 13,
    color: "#999",
  },

  fileSelectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },

  fileSelectedText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
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
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFD4D1", // Light coral border
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  checkboxChecked: {
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderColor: "#E85D54",
  },

  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  termsLink: {
    color: "#E85D54", // I-SHELF coral red
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
    borderTopColor: "#FFD4D1", // Light coral border
  },

  uploadButton: {
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

  uploadButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});