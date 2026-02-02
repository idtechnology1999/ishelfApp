import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Upload6() {
  const router = useRouter();
  const [copyrightHolder, setCopyrightHolder] = useState("");
  const [copyrightStatement, setCopyrightStatement] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleContinue = () => {
    if (copyrightHolder && copyrightStatement && isConfirmed) {
      router.push("/Author/book/UploadContinue7");
    } else {
      Alert.alert(
        "Required Fields",
        "Please fill in all fields and confirm ownership"
      );
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
              <Text style={styles.progressTitle}>Copyright & Ownership</Text>
              <Text style={styles.progressCounter}>5/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Copyright Holder */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Copyright Holder</Text>
              <TextInput
                style={styles.input}
                value={copyrightHolder}
                onChangeText={setCopyrightHolder}
                placeholder=""
              />
            </View>

            {/* Copyright Statement */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Copyright Statement</Text>
              <TextInput
                style={styles.input}
                value={copyrightStatement}
                onChangeText={setCopyrightStatement}
                placeholder=""
              />
            </View>

            {/* Confirmation Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsConfirmed(!isConfirmed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
                {isConfirmed && (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                "I confirm that I am the owner of this content or have full rights
                to publish it."
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Continue Button - Fixed at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
    flex: 5,
    backgroundColor: "#E85D54", // I-SHELF coral red
  },

  progressBarEmpty: {
    flex: 1,
    backgroundColor: "#FFE8E6", // Light coral
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
    borderColor: "#FFD4D1", // Light coral border
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
    borderColor: "#FFD4D1", // Light coral border
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderColor: "#E85D54",
  },

  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
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

  continueButton: {
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

  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});