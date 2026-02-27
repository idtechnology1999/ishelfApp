import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readerAuth } from "../readerAPI";
import Toast from "../Toast";

export default function ForgotPassword2() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" | "warning" });
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('resetEmail').then(e => e && setEmail(e));
  }, []);

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: "", type: "success" });
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow single digit
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      await readerAuth.forgotPassword(email);
      setTimer(600);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      showToast("New code sent!", "success");
    } catch (error: any) {
      showToast("Failed to resend code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      showToast("Please enter complete code", "error");
      return;
    }

    setLoading(true);
    try {
      await readerAuth.verifyCode(email, fullCode);
      await AsyncStorage.setItem('resetCode', fullCode);
      showToast("Code verified!", "success");
      setTimeout(() => router.replace("/Reader/ForgotPassword3"), 1000);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Invalid code", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
            onPress={() => router.replace("/Reader/ForgotPassword1")}
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

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter Code</Text>
          </View>

          {/* Code Input */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                accessibilityLabel={`Code digit ${index + 1}`}
              />
            ))}
          </View>

          {/* Resend Timer */}
          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResend}
            disabled={timer > 0}
          >
            <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
              Resend in {formatTime(timer)}
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityLabel="Submit code"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>

          {toast.visible && <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />}
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
    marginBottom: 50,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE8E6", // Light coral background
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

  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },

  codeInput: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },

  resendContainer: {
    alignItems: "center",
    marginBottom: 32,
  },

  resendText: {
    fontSize: 14,
    color: "#E85D54", // I-SHELF coral red
    fontWeight: "500",
  },

  resendTextDisabled: {
    color: "#999",
  },

  submitButton: {
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

  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});