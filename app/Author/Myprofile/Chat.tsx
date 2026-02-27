import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Message = {
  _id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: string;
};

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('authorToken');
      const response = await axios.get(`${API_URL}/api/authors/support/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      try {
        const token = await AsyncStorage.getItem('authorToken');
        await axios.post(`${API_URL}/api/authors/support/messages`, {
          text: message
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("");
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
            onPress={() => router.replace('/Author/Myprofile/Support')}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chats</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Chat Info */}
        <View style={styles.chatInfo}>
          <Text style={styles.chatWith}>Support Team</Text>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View
              key={msg._id}
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userMessage : styles.supportMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                msg.sender === "user" && styles.userMessageText
              ]}>{msg.text}</Text>
              <Text style={[
                styles.messageTime,
                msg.sender === "user" && styles.userMessageTime
              ]}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
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
    color: "#E85D54", // I-SHELF coral red
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
    color: "#E85D54", // I-SHELF coral red
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
    backgroundColor: "#E85D54", // I-SHELF coral red
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  userMessage: {
    backgroundColor: "#FFE8E6", // Light coral
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 20,
  },

  userMessageText: {
    color: "#333333", // Dark text for light background
  },

  messageTime: {
    fontSize: 11,
    color: "#FFFFFF",
    opacity: 0.7,
    marginTop: 4,
    textAlign: 'right',
  },

  userMessageTime: {
    color: "#666666",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#FFD4D1", // Light coral border
    gap: 12,
  },

  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
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
    backgroundColor: "#E85D54", // I-SHELF coral red
    alignItems: "center",
    justifyContent: "center",
  },
});