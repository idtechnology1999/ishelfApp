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

export default function Upload5() {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDraftBook();
  }, []);

  const loadDraftBook = async () => {
    try {
      const response = await authorAPI.getDraftBook();
      if (response.book) {
        setPrice(response.book.price?.toString() || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleContinue = async () => {
    if (!price) {
      Alert.alert("Required Field", "Please enter the pricing");
      return;
    }

    setLoading(true);
    try {
      await authorAPI.uploadBook({ price: parseFloat(price) });
      router.push("/Author/book/UploadContinue6");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save book data");
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
              <Text style={styles.progressTitle}>Pricing & Sales Settings</Text>
              <Text style={styles.progressCounter}>5/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Pricing */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Book Price (₦)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price in Naira"
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>

        {/* Continue Button - Fixed at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
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
    flex: 5,
    backgroundColor: "#E85D54",
  },

  progressBarEmpty: {
    flex: 1,
    backgroundColor: "#FFE8E6",
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

  continueButton: {
    height: 56,
    backgroundColor: "#E85D54",
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

  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});
