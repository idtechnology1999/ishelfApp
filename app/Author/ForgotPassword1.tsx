import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorAPI } from "../authorAPI";

export default function ForgotPassword1() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await authorAPI.forgotPassword(email);
      await AsyncStorage.setItem('resetEmail', email);
      Alert.alert("Success", "Code sent to your email!");
      router.replace("/Author/ForgotPassword2");
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) {
        Alert.alert("Error", "Email not registered");
      } else {
        Alert.alert("Error", error.response?.data?.message || "Failed to send code");
      }
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/Author/Login")}
            accessibilityLabel="Go back to login"
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your Registered E-Mail Address to get a code to reset your password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-Mail Address</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email address input"
              />
            </View>

            {/* Proceed Button */}
            <TouchableOpacity
              style={[styles.proceedButton, loading && styles.buttonDisabled]}
              onPress={handleProceed}
              disabled={loading}
              accessibilityLabel="Proceed button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.proceedButtonText}>Proceed</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  backButton: {
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE8E6", // Light coral matching brand
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logoImage: {
    width: 80,
    height: 80,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 22,
  },

  form: {
    flex: 1,
  },

  inputContainer: {
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
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

  proceedButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  proceedButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});