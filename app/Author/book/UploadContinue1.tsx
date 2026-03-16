import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Upload2() {
  const router = useRouter();
  const { new: isNew } = useLocalSearchParams();
  const [bookTitle, setBookTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [edition, setEdition] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPaymentStatus();
    if (!isNew) loadDraftBook();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await authorAPI.checkActivePayment();
      if (!response.hasActivePayment) {
        Alert.alert(
          'Payment Required',
          'You need to complete payment before uploading a book.',
          [
            { text: 'Make Payment', onPress: () => router.replace('/Author/book/payment') },
            { text: 'Cancel', onPress: () => router.back(), style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    }
  };

  const loadDraftBook = async () => {
    try {
      const response = await authorAPI.getDraftBook();
      if (response.book) {
        const book = response.book;
        setBookTitle(book.title || "");
        setSubtitle(book.subtitle || "");
        setCoAuthors(book.coAuthors || "");
        setEdition(book.edition || "");
        setPublisher(book.publisher || "");
        setPublicationYear(book.publicationYear || "");
        setLanguage(book.language || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleContinue = async () => {
    if (!bookTitle || !publicationYear || !language) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await authorAPI.uploadBook({
        title: bookTitle,
        subtitle,
        coAuthors,
        edition,
        publisher,
        publicationYear,
        language
      });
      router.push("/Author/book/UploadContinue2");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save book data");
    } finally {
      setLoading(false);
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
              <Text style={styles.progressTitle}>Book/Publication Basic Details</Text>
              <Text style={styles.progressCounter}>1/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Book Title</Text>
              <TextInput
                style={styles.input}
                value={bookTitle}
                onChangeText={setBookTitle}
                placeholder=""
              />
            </View>

            {/* Subtitle */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Subtitle (optional)</Text>
              <TextInput
                style={styles.input}
                value={subtitle}
                onChangeText={setSubtitle}
                placeholder=""
              />
            </View>

            {/* Co-authors */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Co-authors (optional)</Text>
              <TextInput
                style={styles.input}
                value={coAuthors}
                onChangeText={setCoAuthors}
                placeholder=""
              />
            </View>

            {/* Edition */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Edition (1st, 2nd, etc.)</Text>
              <TextInput
                style={styles.input}
                value={edition}
                onChangeText={setEdition}
                placeholder=""
              />
            </View>

            {/* Publisher */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Publisher (optional)</Text>
              <TextInput
                style={styles.input}
                value={publisher}
                onChangeText={setPublisher}
                placeholder=""
              />
            </View>

            {/* Publication Year */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Publication Year</Text>
              <TextInput
                style={styles.input}
                value={publicationYear}
                onChangeText={setPublicationYear}
                placeholder=""
                keyboardType="numeric"
              />
            </View>

            {/* Language */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Language</Text>
              <TextInput
                style={styles.input}
                value={language}
                onChangeText={setLanguage}
                placeholder=""
              />
            </View>
          </View>
        </ScrollView>

        {/* Continue Button - Fixed at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
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
    marginBottom: 24,
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
    flex: 1,
    backgroundColor: "#E85D54", // I-SHELF coral red
  },

  progressBarEmpty: {
    flex: 5,
    backgroundColor: "#FFE8E6", // Light coral
  },

  form: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  inputContainer: {
    marginBottom: 20,
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

  buttonDisabled: {
    opacity: 0.6,
  },
});