import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.i-shelf.app";

type ChatMessage = {
  _id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: string;
};

type Stage = "intro" | "choice" | "email" | "name" | "chat";
type Identity =
  | { mode: "account"; email: string; name: string }
  | { mode: "guest"; guestId: string; guestName: string };

const generateGuestId = () =>
  `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function SupportWidget() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const [identity, setIdentity] = useState<Identity | null>(null);

  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const [nameInput, setNameInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const openWidget = async () => {
    setVisible(true);
    setStage("intro");
    setVerifyMsg("");
  };

  const closeWidget = () => {
    setVisible(false);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const startChatFlow = () => setStage("choice");

  const chooseHasAccount = () => setStage("email");

  const chooseNewUser = async () => {
    const savedId = await AsyncStorage.getItem("guestChatId");
    const savedName = await AsyncStorage.getItem("guestChatName");
    if (savedId && savedName) {
      setIdentity({ mode: "guest", guestId: savedId, guestName: savedName });
      setStage("chat");
    } else {
      setStage("name");
    }
  };

  const handleVerifyEmail = async () => {
    if (!email.trim()) return;
    setVerifying(true);
    setVerifyMsg("");
    try {
      const res = await axios.post(`${API_URL}/api/delete-account-chat/verify`, {
        email: email.trim(),
      });
      if (res.data.found) {
        setIdentity({ mode: "account", email: email.trim(), name: res.data.name });
        setStage("chat");
      } else {
        setVerifyMsg("No account found with this email.");
      }
    } catch {
      setVerifyMsg("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleStartGuestChat = async () => {
    if (!nameInput.trim()) return;
    const guestId = generateGuestId();
    const guestName = nameInput.trim();
    await AsyncStorage.setItem("guestChatId", guestId);
    await AsyncStorage.setItem("guestChatName", guestName);
    setIdentity({ mode: "guest", guestId, guestName });
    setStage("chat");
  };

  useEffect(() => {
    if (stage !== "chat" || !identity) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    const fetchMessages = async () => {
      try {
        const url =
          identity.mode === "account"
            ? `${API_URL}/api/delete-account-chat/messages/${encodeURIComponent(identity.email)}`
            : `${API_URL}/api/guest-chat/messages/${encodeURIComponent(identity.guestId)}`;
        const res = await axios.get(url);
        setMessages(res.data);
      } catch {
        /* ignore */
      }
    };

    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [stage, identity]);

  const handleSend = async () => {
    if (!messageText.trim() || !identity || sending) return;
    setSending(true);
    try {
      if (identity.mode === "account") {
        await axios.post(`${API_URL}/api/delete-account-chat/messages`, {
          email: identity.email,
          text: messageText.trim(),
        });
      } else {
        await axios.post(`${API_URL}/api/guest-chat/messages`, {
          guestId: identity.guestId,
          guestName: identity.guestName,
          text: messageText.trim(),
        });
      }
      setMessageText("");
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={openWidget}
        activeOpacity={0.85}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" onRequestClose={closeWidget} transparent>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheet}
          >
            <View style={styles.header}>
              {stage !== "intro" && stage !== "chat" && (
                <TouchableOpacity onPress={() => setStage(stage === "email" || stage === "name" ? "choice" : "intro")}>
                  <Ionicons name="chevron-back" size={24} color="#E85D54" />
                </TouchableOpacity>
              )}
              {(stage === "intro" || stage === "chat") && <View style={{ width: 24 }} />}
              <Text style={styles.headerTitle}>Support</Text>
              <TouchableOpacity onPress={closeWidget}>
                <Ionicons name="close" size={26} color="#999" />
              </TouchableOpacity>
            </View>

            {stage === "intro" && (
              <View style={styles.centeredContent}>
                <View style={styles.iconCircle}>
                  <Ionicons name="people" size={56} color="#E85D54" />
                </View>
                <Text style={styles.introText}>Chat with our support team</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={startChatFlow}>
                  <Text style={styles.primaryButtonText}>Chat Now</Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === "choice" && (
              <View style={styles.centeredContent}>
                <Text style={styles.introText}>Do you already have an account with us?</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={chooseHasAccount}>
                  <Text style={styles.primaryButtonText}>Yes, I have an account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={chooseNewUser}>
                  <Text style={styles.secondaryButtonText}>No, I'm new here</Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === "email" && (
              <View style={styles.formContent}>
                <Text style={styles.label}>Enter your email to start chatting</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#bbb"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onSubmitEditing={handleVerifyEmail}
                />
                {!!verifyMsg && <Text style={styles.errorText}>{verifyMsg}</Text>}
                <TouchableOpacity
                  style={[styles.primaryButton, (verifying || !email.trim()) && styles.buttonDisabled]}
                  onPress={handleVerifyEmail}
                  disabled={verifying || !email.trim()}
                >
                  {verifying ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Start Chat</Text>}
                </TouchableOpacity>
              </View>
            )}

            {stage === "name" && (
              <View style={styles.formContent}>
                <Text style={styles.label}>What should we call you?</Text>
                <TextInput
                  style={styles.input}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Enter your name"
                  placeholderTextColor="#bbb"
                  autoCapitalize="words"
                  onSubmitEditing={handleStartGuestChat}
                />
                <TouchableOpacity
                  style={[styles.primaryButton, !nameInput.trim() && styles.buttonDisabled]}
                  onPress={handleStartGuestChat}
                  disabled={!nameInput.trim()}
                >
                  <Text style={styles.primaryButtonText}>Start Chat</Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === "chat" && identity && (
              <>
                <View style={styles.chatIdentityRow}>
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarSmallText}>
                      {(identity.mode === "account" ? identity.name : identity.guestName).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.chatIdentityName}>
                    {identity.mode === "account" ? identity.name : identity.guestName}
                  </Text>
                </View>

                <ScrollView
                  ref={scrollRef}
                  style={styles.messagesContainer}
                  contentContainerStyle={styles.messagesContent}
                  onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                  {messages.length === 0 && (
                    <Text style={styles.emptyChatText}>No messages yet. Say hello!</Text>
                  )}
                  {messages.map((m) => (
                    <View
                      key={m._id}
                      style={[styles.messageBubble, m.sender === "user" ? styles.userMessage : styles.supportMessage]}
                    >
                      <Text style={[styles.messageText, m.sender === "user" && styles.userMessageText]}>{m.text}</Text>
                      <Text style={[styles.messageTime, m.sender === "user" && styles.userMessageTime]}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.chatInput}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    multiline
                  />
                  <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending}>
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E85D54",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "78%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#E85D54" },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFE8E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  introText: { fontSize: 16, fontWeight: "600", color: "#222", textAlign: "center" },
  primaryButton: {
    backgroundColor: "#E85D54",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 26,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#E85D54",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 26,
    width: "100%",
    alignItems: "center",
  },
  secondaryButtonText: { color: "#E85D54", fontWeight: "600", fontSize: 15 },
  buttonDisabled: { opacity: 0.5 },
  formContent: { flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
  },
  errorText: { color: "#DC2626", fontSize: 13 },
  chatIdentityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E85D54",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: { color: "#FFF", fontWeight: "700" },
  chatIdentityName: { fontSize: 15, fontWeight: "600", color: "#333" },
  messagesContainer: { flex: 1, paddingHorizontal: 20 },
  messagesContent: { paddingVertical: 8, gap: 12 },
  emptyChatText: { textAlign: "center", color: "#999", marginTop: 40, fontSize: 13 },
  messageBubble: { maxWidth: "78%", padding: 14, borderRadius: 18 },
  supportMessage: { backgroundColor: "#E85D54", alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  userMessage: { backgroundColor: "#FFE8E6", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  messageText: { fontSize: 14, color: "#FFFFFF", lineHeight: 19 },
  userMessageText: { color: "#333333" },
  messageTime: { fontSize: 10, color: "#FFFFFF", opacity: 0.7, marginTop: 4, textAlign: "right" },
  userMessageTime: { color: "#666666" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#FFD4D1",
  },
  chatInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E85D54",
    alignItems: "center",
    justifyContent: "center",
  },
});
