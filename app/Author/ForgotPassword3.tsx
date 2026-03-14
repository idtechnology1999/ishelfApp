import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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

export default function ForgotPassword3() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    AsyncStorage.getItem('resetEmail').then(e => e && setEmail(e));
    AsyncStorage.getItem('resetCode').then(c => c && setCode(c));
  }, []);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authorAPI.resetPassword(email, code, password);
      await AsyncStorage.removeItem('resetEmail');
      await AsyncStorage.removeItem('resetCode');
      Alert.alert("Success", "Password reset successful!");
      router.replace("/Author/ForgotPasswordDone");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password");
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
            onPress={() => router.replace("/Author/ForgotPassword2")}
            accessibilityLabel="Go back"
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

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter New password</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder=""
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="New password input"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  accessibilityLabel={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder=""
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Confirm password input"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setIsConfirmVisible(!isConfirmVisible)}
                  accessibilityLabel={
                    isConfirmVisible ? "Hide password" : "Show password"
                  }
                >
                  <Ionicons
                    name={isConfirmVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, loading && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={loading}
              accessibilityLabel="Reset password button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.resetButtonText}>Reset</Text>
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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

  passwordWrapper: {
    position: "relative",
  },

  passwordInput: {
    paddingRight: 50,
  },

  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 15,
  },

  resetButton: {
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

  resetButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});