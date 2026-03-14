import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Support() {
  const router = useRouter();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  const faqs = [
    {
      id: 1,
      question: "How do I purchase and download a book on iShelf?",
      answer: 'To buy a book on iShelf, simply open the book you want, tap the "Buy Now" button, and complete the payment using your preferred method. Once your payment is successful, the book will automatically appear in your Library, where you can download it for offline reading anytime.',
    },
    {
      id: 2,
      question: "Can I read my books offline after downloading them?",
      answer: "Yes, once you download a book to your device, you can read it offline anytime without an internet connection.",
    },
    {
      id: 3,
      question: "Why can't I screenshot or share the books I bought?",
      answer: "To protect copyright and intellectual property rights, screenshots and sharing of purchased books are restricted.",
    },
    {
      id: 4,
      question: "How do I recover my account if I forget my login details?",
      answer: "Click on 'Forgot Password' on the login screen and follow the instructions to reset your password via email.",
    },
    {
      id: 5,
      question: "What payment methods are supported?",
      answer: "We support various payment methods including credit/debit cards, bank transfers, and mobile payment options.",
    },
  ];

  const toggleQuestion = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handleChatNow = () => {
    router.push("/Author/Myprofile/Chat");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('Author/profile')}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Support Team Section */}
        <View style={styles.supportSection}>
          <View style={styles.avatarsContainer}>
            <View style={styles.teamIconWrapper}>
              <Ionicons name="people" size={72} color="#E85D54" />
            </View>
          </View>
          <Text style={styles.supportText}>Chat with our support team</Text>
          <TouchableOpacity style={styles.chatButton} onPress={handleChatNow}>
            <Text style={styles.chatButtonText}>Chat Now</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleQuestion(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
              </TouchableOpacity>
              {expandedQuestion === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontSize: 20,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  supportSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },

  avatarsContainer: {
    marginBottom: 24,
    alignItems: "center",
  },

  teamIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFE8E6",
    alignItems: "center",
    justifyContent: "center",
  },

  supportText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 24,
    textAlign: "center",
  },

  chatButton: {
    backgroundColor: "#E85D54", // I-SHELF coral red
    paddingHorizontal: 80,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  chatButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  faqSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  faqTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 24,
    textAlign: "center",
  },

  faqItem: {
    marginBottom: 12,
  },

  faqQuestion: {
    backgroundColor: "#E85D54", // I-SHELF coral red
    padding: 20,
    borderRadius: 12,
  },

  faqQuestionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  faqAnswer: {
    backgroundColor: "#FFE8E6", // Light coral
    padding: 20,
    borderRadius: 12,
    marginTop: 4,
  },

  faqAnswerText: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
  },
});