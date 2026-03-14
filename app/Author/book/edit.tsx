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

export default function EditBook() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [bookTitle, setBookTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [edition, setEdition] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [language, setLanguage] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pageCount, setPageCount] = useState("");

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await authorAPI.getMyBooks();
      const book = response.books.find((b: any) => b._id === id);
      if (book) {
        setBookTitle(book.title || "");
        setSubtitle(book.subtitle || "");
        setCoAuthors(book.coAuthors || "");
        setEdition(book.edition || "");
        setPublisher(book.publisher || "");
        setPublicationYear(book.publicationYear || "");
        setLanguage(book.language || "");
        setIsbn(book.isbn || "");
        setDescription(book.description || "");
        setPrice(book.price?.toString() || "");
        setPageCount(book.pageCount?.toString() || "");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!bookTitle || !publicationYear || !language) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await authorAPI.updateBook(id as string, {
        title: bookTitle,
        subtitle,
        coAuthors,
        edition,
        publisher,
        publicationYear,
        language,
        isbn,
        description,
        price: parseFloat(price) || 0,
        pageCount: parseInt(pageCount) || 0,
      });
      Alert.alert("Success", "Book updated successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>Edit Book</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Book Title *</Text>
              <TextInput
                style={styles.input}
                value={bookTitle}
                onChangeText={setBookTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Subtitle</Text>
              <TextInput
                style={styles.input}
                value={subtitle}
                onChangeText={setSubtitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Co-authors</Text>
              <TextInput
                style={styles.input}
                value={coAuthors}
                onChangeText={setCoAuthors}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Edition</Text>
              <TextInput
                style={styles.input}
                value={edition}
                onChangeText={setEdition}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Publisher</Text>
              <TextInput
                style={styles.input}
                value={publisher}
                onChangeText={setPublisher}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Publication Year *</Text>
              <TextInput
                style={styles.input}
                value={publicationYear}
                onChangeText={setPublicationYear}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Language *</Text>
              <TextInput
                style={styles.input}
                value={language}
                onChangeText={setLanguage}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>ISBN/ISSN</Text>
              <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Enter ISBN or ISSN"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Number of Pages</Text>
              <TextInput
                style={styles.input}
                value={pageCount}
                onChangeText={setPageCount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price (₦)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    color: "#E85D54",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
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
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },

  textArea: {
    height: 100,
    paddingTop: 12,
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
    borderTopColor: "#FFD4D1",
  },

  saveButton: {
    height: 56,
    backgroundColor: "#E85D54",
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

  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
