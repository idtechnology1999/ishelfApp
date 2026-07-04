import React, { useState, useEffect, useRef } from "react";
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
import * as DocumentPicker from "expo-document-picker";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.i-shelf.app";

const ID_TYPES = [
  { value: "nin", label: "National Identification Number (NIN)" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "international_passport", label: "International Passport" },
];

type ChatMessage = {
  _id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: string;
};

type IdFile = { uri: string; name: string; mimeType: string };

export default function DeleteAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "chat" | "form" | "success">("email");

  // Email verification
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Deletion form
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [reason, setReason] = useState("");
  const [idFile, setIdFile] = useState<IdFile | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (step !== "chat" || !email) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/delete-account-chat/messages/${encodeURIComponent(email)}`);
        if (res.ok) setChatMessages(await res.json());
      } catch { /* ignore */ }
    };
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [step, email]);

  const handleVerify = async () => {
    if (!email.trim()) return;
    setVerifying(true);
    setVerifyMsg("");
    try {
      const res = await fetch(`${API_URL}/api/delete-account-chat/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.found) {
        setUserName(data.name);
        setUserType(data.userType);
        setFullName(data.name);
        setStep("chat");
      } else {
        setVerifyMsg("No account found with this email. You can submit a deletion request instead.");
        setStep("form");
      }
    } catch {
      setVerifyMsg("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatText.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      const res = await fetch(`${API_URL}/api/delete-account-chat/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, text: chatText.trim() }),
      });
      if (res.ok) {
        const message = await res.json();
        setChatMessages((prev) => [...prev, message]);
        setChatText("");
      }
    } catch { /* ignore */ }
    finally { setSendingChat(false); }
  };

  const pickIdDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setIdFile({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || "application/octet-stream",
        });
      }
    } catch {
      Alert.alert("Error", "Could not open file picker. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) { Alert.alert("Required", "Please enter your full name"); return; }
    if (!email.trim()) { Alert.alert("Required", "Please enter your email address"); return; }
    if (!idType) { Alert.alert("Required", "Please select an ID type"); return; }
    if (!idNumber.trim()) { Alert.alert("Required", "Please enter your ID number"); return; }
    if (!idFile) { Alert.alert("Required", "Please upload a government-issued ID"); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("idType", idType);
      formData.append("idNumber", idNumber.trim());
      formData.append("reason", reason.trim());

      if (Platform.OS === "web") {
        const fetchRes = await fetch(idFile.uri);
        const blob = await fetchRes.blob();
        const file = new File([blob], idFile.name, { type: idFile.mimeType || blob.type });
        formData.append("idImage", file);
      } else {
        formData.append("idImage", {
          uri: idFile.uri,
          name: idFile.name,
          type: idFile.mimeType,
        } as any);
      }

      const res = await fetch(`${API_URL}/api/delete-account/submit`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStep("success");
      } else {
        Alert.alert("Error", data.message || "Failed to submit request. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#E85D54" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="trash-outline" size={36} color="#E85D54" />
            </View>
            <Text style={styles.title}>Delete Account</Text>
            <Text style={styles.subtitle}>
              Enter your email to get started. You can chat with support or submit a formal deletion request.
            </Text>
          </View>

          {/* Email verification */}
          <View style={styles.verifyBox}>
            <Text style={styles.label}>Your email address</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={step === "email"}
              />
              {step === "email" && (
                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={verifying || !email.trim()}
                  style={[styles.verifyButton, (verifying || !email.trim()) && { opacity: 0.5 }]}
                >
                  {verifying ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.verifyButtonText}>Verify</Text>}
                </TouchableOpacity>
              )}
            </View>
            {!!verifyMsg && <Text style={styles.verifyMsg}>{verifyMsg}</Text>}
          </View>

          {/* Chat section */}
          {step === "chat" && (
            <>
              <View style={styles.userCard}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>{userName.charAt(0).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.userCardName}>{userName}</Text>
                  <Text style={styles.userCardMeta}>{userType} • {email}</Text>
                </View>
              </View>

              <View style={styles.chatBox}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatHeaderText}>Chat with Support</Text>
                  <TouchableOpacity onPress={() => setStep("form")}>
                    <Text style={styles.chatLink}>Or fill deletion form →</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.chatMessages} nestedScrollEnabled>
                  {chatMessages.length === 0 && (
                    <Text style={styles.chatEmpty}>No messages yet. Send a message to our support team.</Text>
                  )}
                  {chatMessages.map((m) => (
                    <View key={m._id} style={[styles.msgRow, m.sender === "user" ? styles.msgRowUser : styles.msgRowAdmin]}>
                      <View style={[styles.msgBubble, m.sender === "user" ? styles.msgBubbleUser : styles.msgBubbleAdmin]}>
                        <Text style={[styles.msgText, m.sender === "user" && { color: "#FFFFFF" }]}>{m.text}</Text>
                        <Text style={[styles.msgTime, m.sender === "user" && { color: "rgba(255,255,255,0.7)" }]}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.chatInputRow}>
                  <TextInput
                    style={styles.chatInput}
                    value={chatText}
                    onChangeText={setChatText}
                    placeholder="Type your message..."
                    placeholderTextColor="#bbb"
                  />
                  <TouchableOpacity
                    onPress={sendChatMessage}
                    disabled={!chatText.trim() || sendingChat}
                    style={[styles.sendButton, (!chatText.trim() || sendingChat) && { opacity: 0.5 }]}
                  >
                    <Ionicons name="send" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Deletion request form */}
          {step === "form" && (
            <>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Submit a Deletion Request</Text>
                <Text style={styles.infoText}>
                  Fill in your details and reason for deletion. We'll review and contact you within 7 business days.
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter your full name" placeholderTextColor="#bbb" autoCapitalize="words" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>ID Type <Text style={styles.required}>*</Text></Text>
                <View style={{ gap: 8 }}>
                  {ID_TYPES.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.idOption, idType === item.value && styles.idOptionActive]}
                      onPress={() => setIdType(item.value)}
                    >
                      <Ionicons name={idType === item.value ? "radio-button-on" : "radio-button-off"} size={20} color={idType === item.value ? "#E85D54" : "#999"} />
                      <Text style={[styles.idOptionText, idType === item.value && styles.idOptionTextActive]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>ID Number <Text style={styles.required}>*</Text></Text>
                <TextInput style={styles.input} value={idNumber} onChangeText={setIdNumber} placeholder="Enter your ID number" placeholderTextColor="#bbb" autoCapitalize="characters" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Upload ID (JPG, PNG, PDF) <Text style={styles.required}>*</Text></Text>
                {idFile ? (
                  <View style={styles.fileCard}>
                    <Ionicons name={idFile.mimeType.includes("pdf") ? "document-text-outline" : "image-outline"} size={28} color="#E85D54" />
                    <Text style={styles.fileName} numberOfLines={1}>{idFile.name}</Text>
                    <TouchableOpacity onPress={pickIdDocument} style={styles.changeBtn}>
                      <Text style={styles.changeBtnText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.uploadBox} onPress={pickIdDocument}>
                    <Ionicons name="cloud-upload-outline" size={32} color="#E85D54" />
                    <Text style={styles.uploadText}>Tap to upload ID document</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Reason for deletion <Text style={styles.required}>*</Text></Text>
                <TextInput style={[styles.input, styles.textArea]} value={reason} onChangeText={setReason} placeholder="Tell us why you'd like to delete your account..." placeholderTextColor="#bbb" multiline numberOfLines={4} textAlignVertical="top" />
              </View>

              <TouchableOpacity style={[styles.primaryButton, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Submit Request</Text>}
              </TouchableOpacity>

              {userName ? (
                <TouchableOpacity style={styles.backLink} onPress={() => setStep("chat")}>
                  <Ionicons name="arrow-back" size={16} color="#E85D54" />
                  <Text style={styles.backLinkText}>Back to chat</Text>
                </TouchableOpacity>
              ) : null}
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

  verifyBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1, borderColor: "#E5E7EB",
    borderRadius: 12, padding: 16, marginBottom: 20,
  },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  verifyButton: {
    backgroundColor: "#E85D54", borderRadius: 8,
    paddingHorizontal: 18, height: 48,
    alignItems: "center", justifyContent: "center",
  },
  verifyButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  verifyMsg: { fontSize: 13, color: "#666", marginTop: 10 },

  userCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, backgroundColor: "#F0FDF4",
    borderWidth: 1, borderColor: "#BBF7D0",
    borderRadius: 10, marginBottom: 16,
  },
  avatarSmall: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#E85D54",
    alignItems: "center", justifyContent: "center",
  },
  avatarSmallText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  userCardName: { fontWeight: "600", color: "#111827", fontSize: 15 },
  userCardMeta: { fontSize: 12, color: "#6B7280" },

  chatBox: {
    borderWidth: 1, borderColor: "#E5E7EB",
    borderRadius: 12, overflow: "hidden", marginBottom: 20,
  },
  chatHeader: {
    backgroundColor: "#E85D54", padding: 14,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  chatHeaderText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  chatLink: { color: "#FFFFFF", fontSize: 12, textDecorationLine: "underline" },
  chatMessages: { height: 280, backgroundColor: "#F9FAFB", padding: 12 },
  chatEmpty: { textAlign: "center", color: "#9CA3AF", fontSize: 13, marginTop: 40 },
  msgRow: { marginBottom: 10, flexDirection: "row" },
  msgRowUser: { justifyContent: "flex-end" },
  msgRowAdmin: { justifyContent: "flex-start" },
  msgBubble: { maxWidth: "78%", padding: 10, borderRadius: 12 },
  msgBubbleUser: { backgroundColor: "#E85D54" },
  msgBubbleAdmin: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#F0F0F0" },
  msgText: { fontSize: 13, color: "#111827", lineHeight: 18 },
  msgTime: { fontSize: 10, color: "#9CA3AF", marginTop: 4, textAlign: "right" },
  chatInputRow: {
    flexDirection: "row", gap: 8, padding: 10,
    borderTopWidth: 1, borderTopColor: "#E5E7EB", backgroundColor: "#FFFFFF",
  },
  chatInput: {
    flex: 1, borderWidth: 1, borderColor: "#D1D5DB",
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: "#333",
  },
  sendButton: {
    backgroundColor: "#E85D54", borderRadius: 8,
    width: 42, alignItems: "center", justifyContent: "center",
  },

  infoBox: {
    backgroundColor: "#FEF2F2", borderLeftWidth: 4, borderLeftColor: "#E85D54",
    borderRadius: 8, padding: 14, marginBottom: 18,
  },
  infoTitle: { fontWeight: "600", color: "#111827", fontSize: 14, marginBottom: 4 },
  infoText: { fontSize: 13, color: "#6B7280", lineHeight: 18 },

  formGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  required: { color: "#E85D54" },
  input: {
    height: 50, borderWidth: 1.5, borderColor: "#FFD4D1",
    borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: "#333",
  },
  textArea: { height: 100, paddingTop: 14 },

  idOption: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 10, padding: 14,
  },
  idOptionActive: { borderColor: "#E85D54", backgroundColor: "#FFF5F4" },
  idOptionText: { fontSize: 14, color: "#666", flex: 1 },
  idOptionTextActive: { color: "#E85D54", fontWeight: "600" },

  uploadBox: {
    borderWidth: 2, borderColor: "#FFD4D1", borderStyle: "dashed",
    borderRadius: 12, height: 110, alignItems: "center", justifyContent: "center",
    backgroundColor: "#FFF9F9", gap: 6,
  },
  uploadText: { fontSize: 14, fontWeight: "600", color: "#E85D54" },
  fileCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1, borderColor: "#FFD4D1", borderRadius: 12,
    padding: 12, backgroundColor: "#FFF9F9",
  },
  fileName: { flex: 1, fontSize: 13, fontWeight: "600", color: "#333" },
  changeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "#E85D54" },
  changeBtnText: { fontSize: 12, color: "#E85D54", fontWeight: "600" },

  primaryButton: {
    height: 52, backgroundColor: "#E85D54", borderRadius: 26,
    alignItems: "center", justifyContent: "center", marginTop: 8,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },

  backLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 },
  backLinkText: { fontSize: 14, color: "#E85D54", fontWeight: "500" },

  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 8 },
  successTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginTop: 4 },
  successText: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 21, paddingHorizontal: 20, marginBottom: 24 },

  footer: { textAlign: "center", fontSize: 12, color: "#999", marginTop: 24 },
});
