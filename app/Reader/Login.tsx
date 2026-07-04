import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { readerAuth } from "../readerAPI";
import Toast from "../Toast";

export default function Login() {
  const router = useRouter();
  const scrollRef = useRef<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" | "warning" });

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: "", type: "success" });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }

    setLoading(true);
    try {
      await readerAuth.login(email, password);
      showToast("Login successful!", "success");
      setTimeout(() => router.push("/Reader/(ReaderTabs)"), 1000);
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 403) {
        if (message?.includes('verified') || message?.toLowerCase().includes('pending')) {
          showToast("Account pending verification. Login back on or before 30 minutes.", "warning");
        } else {
          showToast("Account suspended. Contact support.", "error");
        }
      } else if (status === 404) {
        showToast("Account not found", "error");
      } else {
        showToast(message || "Login failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {toast.visible && <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />}
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#E85D54" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>
            Log in to continue your reading journey
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>E-Mail Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              color="#333"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder=""
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                color="#333"
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log in</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password - below login button */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/Reader/ForgotPassword1")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/Reader/SignUp")}>
              <Text style={styles.signUpLink}>Signup</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <Text style={styles.orText}>Or Continue With</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={32} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={32} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={32} color="#000000" />
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#FFE8E6",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E85D54",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
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
    top: 13,
  },
  loginButton: {
    marginHorizontal: 24,
    marginTop: 30,
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#E85D54",
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: "#333",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E85D54",
  },
  orText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 70,
    height: 70,
    backgroundColor: "#FFE8E6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
