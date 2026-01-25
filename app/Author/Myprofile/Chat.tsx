import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: number;
  text: string;
  sender: "user" | "support";
};

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: "support" },
    { id: 2, text: "Hi, I have a question about my purchase", sender: "user" },
    { id: 3, text: "Sure, I'd be happy to help. What would you like to know?", sender: "support" },
    { id: 4, text: "How do I download the book I bought?", sender: "user" },
    { id: 5, text: "You can find your purchased books in the Library section. Just tap on any book to download it.", sender: "support" },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chats</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Chat Info */}
        <View style={styles.chatInfo}>
          <Text style={styles.chatWith}>Chatting with Andrew</Text>
        </View>

        {/* Messages */}
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userMessage : styles.supportMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type Message Here"
            placeholderTextColor="#999999"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={24} color="#FFFFFF" />
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
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A3D91",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  chatInfo: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  chatWith: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0A3D91",
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },

  messagesContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },

  messageBubble: {
    maxWidth: "75%",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },

  supportMessage: {
    backgroundColor: "#0A3D91",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  userMessage: {
    backgroundColor: "#C5E1F5",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 12,
  },

  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#0A3D91",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },

  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A3D91",
    alignItems: "center",
    justifyContent: "center",
  },
});