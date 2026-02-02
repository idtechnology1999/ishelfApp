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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp3() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [areasOfExpertise, setAreasOfExpertise] = useState("");
  const [shortBio, setShortBio] = useState("");

  const handleContinue = () => {
    // Add validation here if needed
    if (displayName && areasOfExpertise && shortBio) {
      router.replace("/Author/SignUp4");
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
            onPress={() => router.replace("/Author/SignUp2")}
            accessibilityLabel="Go back to previous step"
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete the Sign Up process</Text>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Author / Publisher Details</Text>

            {/* Display Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Display Name or Pen Name</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                autoCorrect={false}
                accessibilityLabel="Display name input"
              />
            </View>

            {/* Areas of Expertise Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Areas of Expertise (e.g., Psychology, Engineering, Literature)
              </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={areasOfExpertise}
                onChangeText={setAreasOfExpertise}
                autoCapitalize="words"
                autoCorrect={false}
                accessibilityLabel="Areas of expertise input"
              />
            </View>

            {/* Short Bio Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Short Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder=""
                value={shortBio}
                onChangeText={setShortBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={true}
                accessibilityLabel="Short bio input"
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              accessibilityLabel="Continue to next step"
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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
    marginBottom: 30,
  },

  header: {
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 20,
  },

  progressBarContainer: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },

  progressBarFilled: {
    flex: 2,
    backgroundColor: "#E85D54", // I-SHELF coral red
  },

  progressBarEmpty: {
    flex: 1,
    backgroundColor: "#FFE8E6", // Light coral
  },

  form: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
  },

  inputContainer: {
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
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

  textArea: {
    height: 120,
    paddingTop: 16,
    paddingBottom: 16,
  },

  continueButton: {
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

  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});