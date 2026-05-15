import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.i-shelf.app";

const ID_TYPES = [
  { value: "nin", label: "National Identification Number (NIN)" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "international_passport", label: "International Passport" },
];

export default function DeleteAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<"info" | "form" | "success">("info");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim()) { Alert.alert("Required", "Please enter your full name"); return; }
    if (!email.trim()) { Alert.alert("Required", "Please enter your email address"); return; }
    if (!idType) { Alert.alert("Required", "Please select an ID type"); return; }
    if (!idNumber.trim()) { Alert.alert("Required", "Please enter your ID number"); return; }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/delete-account/submit`, {
        fullName: fullName.trim(),
        email: email.trim(),
        idType,
        idNumber: idNumber.trim(),
        reason: reason.trim(),
      });
      setStep("success");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
            </View>
            <Text style={styles.successTitle}>Request Submitted</Text>
            <Text style={styles.successText}>
              Your account deletion request has been received. We will review your details and
              contact you at {email} within 7 business days.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
              <Text style={styles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#E85D54" />
          </TouchableOpacity>

          {step === "info" && (
            <>
              <View style={styles.header}>
                <View style={styles.logoCircle}>
                  <Ionicons name="trash-outline" size={36} color="#E85D54" />
                </View>
                <Text style={styles.title}>Delete Your iShelf Account</Text>
                <Text style={styles.subtitle}>
                  We need to verify your identity before processing your deletion request.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>How It Works</Text>
                <View style={styles.stepBox}>
                  <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.stepText}>Fill the request form with your details and a valid government ID</Text>
                  </View>
                  <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.stepText}>Our admin team reviews your request within 7 business days</Text>
                  </View>
                  <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>You'll receive a confirmation email once your account is deleted</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Required Identification</Text>
                <Text style={styles.text}>
                  For security purposes, you must provide one of the following government-issued IDs:
                </Text>
                <View style={styles.idChips}>
                  {ID_TYPES.map((item) => (
                    <View key={item.value} style={styles.idChip}>
                      <Ionicons name="shield-checkmark-outline" size={16} color="#E85D54" />
                      <Text style={styles.idChipText}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Need Help?</Text>
                <Text style={styles.text}>
                  Prefer to speak directly with our team? Contact us through the in-app chat for assistance.
                </Text>
                <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert("Contact Admin", "Please go to Profile → Support to chat with our admin team directly.")}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#E85D54" />
                  <Text style={styles.chatButtonText}>Chat with Admin</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={() => setStep("form")}>
                <Text style={styles.primaryButtonText}>Start Deletion Request</Text>
              </TouchableOpacity>

              <View style={styles.noteBox}>
                <Ionicons name="information-circle-outline" size={18} color="#856404" />
                <Text style={styles.noteText}>
                  Your data is handled in accordance with our privacy policy. Retained data (transaction records, logs) may be kept for up to 90 days for legal compliance.
                </Text>
              </View>
            </>
          )}

          {step === "form" && (
            <>
              <View style={styles.header}>
                <View style={styles.logoCircle}>
                  <Ionicons name="document-text-outline" size={36} color="#E85D54" />
                </View>
                <Text style={styles.title}>Deletion Request</Text>
                <Text style={styles.subtitle}>
                  Fill in your details accurately. Your ID information will be verified.
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#bbb"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  placeholderTextColor="#bbb"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>ID Type <Text style={styles.required}>*</Text></Text>
                <View style={styles.idSelector}>
                  {ID_TYPES.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.idOption, idType === item.value && styles.idOptionActive]}
                      onPress={() => setIdType(item.value)}
                    >
                      <Ionicons
                        name={idType === item.value ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={idType === item.value ? "#E85D54" : "#999"}
                      />
                      <Text style={[styles.idOptionText, idType === item.value && styles.idOptionTextActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>ID Number <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={idNumber}
                  onChangeText={setIdNumber}
                  placeholder="Enter your ID number"
                  placeholderTextColor="#bbb"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Reason (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Tell us why you'd like to delete your account..."
                  placeholderTextColor="#bbb"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Submit Request</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.backLink} onPress={() => setStep("info")}>
                <Ionicons name="arrow-back" size={16} color="#E85D54" />
                <Text style={styles.backLinkText}>Back to overview</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.footer}>&copy; {new Date().getFullYear()} iShelf</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { paddingVertical: 10, alignSelf: "flex-start", marginBottom: 8 },
  header: { alignItems: "center", marginBottom: 24 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#FFE8E6",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#E85D54", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", paddingHorizontal: 10, lineHeight: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#E85D54", marginBottom: 10 },
  text: { fontSize: 14, color: "#444", lineHeight: 21, marginBottom: 8 },
  stepBox: {
    backgroundColor: "#FFF5F4", borderRadius: 12,
    padding: 16, marginBottom: 8,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  stepNumber: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#E85D54",
    alignItems: "center", justifyContent: "center",
    marginTop: -1,
  },
  stepNumberText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  stepText: { flex: 1, fontSize: 14, color: "#444", lineHeight: 20 },
  idChips: { gap: 8 },
  idChip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB",
    borderRadius: 8, padding: 12,
  },
  idChipText: { fontSize: 14, color: "#333", fontWeight: "500", flex: 1 },
  chatButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    borderWidth: 1.5, borderColor: "#E85D54", borderRadius: 12,
    padding: 14, marginTop: 4,
  },
  chatButtonText: { fontSize: 15, fontWeight: "600", color: "#E85D54" },
  primaryButton: {
    height: 52, backgroundColor: "#E85D54", borderRadius: 26,
    alignItems: "center", justifyContent: "center",
    marginTop: 8,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  noteBox: {
    flexDirection: "row", backgroundColor: "#FFF3CD",
    borderWidth: 1, borderColor: "#FFEAA7",
    borderRadius: 8, padding: 12, marginTop: 16, gap: 8,
  },
  noteText: { flex: 1, fontSize: 13, color: "#856404", lineHeight: 18 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  required: { color: "#E85D54" },
  input: {
    height: 50, borderWidth: 1.5, borderColor: "#FFD4D1",
    borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: "#333",
  },
  textArea: { height: 100, paddingTop: 14 },
  idSelector: { gap: 8 },
  idOption: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 10,
    padding: 14,
  },
  idOptionActive: { borderColor: "#E85D54", backgroundColor: "#FFF5F4" },
  idOptionText: { fontSize: 14, color: "#666", flex: 1 },
  idOptionTextActive: { color: "#E85D54", fontWeight: "600" },
  backLink: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 16,
  },
  backLinkText: { fontSize: 14, color: "#E85D54", fontWeight: "500" },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 },
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 12 },
  successText: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 21, paddingHorizontal: 20, marginBottom: 32 },
  footer: { textAlign: "center", fontSize: 12, color: "#999", marginTop: 24 },
});
