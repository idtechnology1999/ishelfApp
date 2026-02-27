import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { authorAPI } from '../authorAPI';
import Toast from '../Toast';
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import { StaticBackgroundPattern } from "../../components/BackgroundPattern";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'warning' });

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ visible: true, message, type });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      await authorAPI.login(email, password);
      
      showToast('Welcome Back! 👋', 'success');
      
      setTimeout(() => {
        router.replace("/Author/(AuthorTabs)");
      }, 1000);
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Invalid credentials';
      
      if (status === 403) {
        showToast(message, 'warning');
      } else {
        showToast(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeRight={() => router.replace("/Author/OnboardingScreen3")}
    >
      <StaticBackgroundPattern />
      <SafeAreaView style={styles.container}>
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={() => setToast({ ...toast, visible: false })}
        />
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
              onPress={() => router.replace("/Author/OnboardingScreen3")}
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

              <Text style={styles.title}>Log In</Text>
              <Text style={styles.subtitle}>
                Log in to continue your reading journey
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

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder=""
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Password input"
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

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push("/Author/ForgotPassword1")}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
                accessibilityLabel="Log in button"
              >
                <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/Author/SignUp1")}>
                  <Text style={styles.signupLink}>Signup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureRecognizer>
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
  },

  form: {
    flex: 1,
  },

  inputContainer: {
    marginBottom: 20,
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

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: "#E85D54", // I-SHELF coral red
    fontWeight: "500",
  },

  loginButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  signupText: {
    fontSize: 15,
    color: "#666",
  },

  signupLink: {
    fontSize: 15,
    color: "#E85D54", // I-SHELF coral red
    fontWeight: "600",
  },
});