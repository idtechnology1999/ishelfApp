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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword2() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(52);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const handleResend = () => {
    // Reset timer and resend code logic
    setTimer(52);
    setCode(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      // Verify code and navigate
      router.replace("/Author/ForgotPassword3");
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
            onPress={() => router.replace("/Author/ForgotPassword1")}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            {/* Book Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="book" size={40} color="#0A3D91" />
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
            style={styles.submitButton}
            onPress={handleSubmit}
            accessibilityLabel="Submit code"
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
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

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0A3D91",
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
    borderWidth: 1,
    borderColor: "#D0D7E2",
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
    color: "#0A3D91",
    fontWeight: "500",
  },

  resendTextDisabled: {
    color: "#999",
  },

  submitButton: {
    height: 56,
    backgroundColor: "#0A3D91",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A3D91",
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
});