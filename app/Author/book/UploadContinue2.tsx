import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Upload3() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [level, setLevel] = useState("");
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [disciplineModalVisible, setDisciplineModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  useEffect(() => {
    loadDraftBook();
  }, []);

  const loadDraftBook = async () => {
    try {
      const response = await authorAPI.getDraftBook();
      if (response.book) {
        const book = response.book;
        setCategory(book.category || "");
        setIsbn(book.isbn || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    "Textbooks and Course Materials",
    "Journals & Research Papers",
    "Past Questions & Exam Guides",
    "General Studies (GNS/GST)",
    "Science & Technology",
    "Arts & Humanities",
    "Career & Professional Development",
  ];

  const disciplines = [
    "Psychology",
    "Accounting",
    "Engineering",
    "Humanities",
    "Medical",
  ];

  const levels = [
    "Jambites",
    "100lvl",
    "200lvl",
    "300lvl",
    "400lvl",
    "Post-Graduates",
  ];

  const handleContinue = async () => {
    if (!category || !discipline || !level) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await authorAPI.uploadBook({
        category,
        isbn: isbn || undefined
      });
      router.push("/Author/book/UploadContinue3");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save book data");
    } finally {
      setLoading(false);
    }
  };

  const validateISBN = (value: string) => {
    // Remove hyphens and spaces
    const cleaned = value.replace(/[-\s]/g, '');
    
    // Check if it's ISBN-10 or ISBN-13
    if (cleaned.length === 10 || cleaned.length === 13) {
      setIsbn(value);
      // Optional: You can add API verification here
    } else {
      setIsbn(value);
    }
  };

  const DropdownModal = ({
    visible,
    onClose,
    options,
    onSelect,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    options: string[];
    onSelect: (value: string) => void;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.optionsList}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
              <Text style={styles.progressTitle}>
                Academic & Classification Details
              </Text>
              <Text style={styles.progressCounter}>2/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Category Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setCategoryModalVisible(true)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !category && styles.dropdownPlaceholder,
                  ]}
                >
                  {category || "Select category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#E85D54" />
              </TouchableOpacity>
            </View>

            {/* Discipline / Field Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Discipline / Field</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDisciplineModalVisible(true)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !discipline && styles.dropdownPlaceholder,
                  ]}
                >
                  {discipline || "Select discipline"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#E85D54" />
              </TouchableOpacity>
            </View>

            {/* Course Code */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Course Code (if applicable)</Text>
              <TextInput
                style={styles.input}
                value={courseCode}
                onChangeText={setCourseCode}
                placeholder=""
              />
            </View>

            {/* ISBN/ISSN */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ISBN or ISSN (optional)</Text>
              <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={validateISBN}
                placeholder="Enter ISBN or ISSN number"
                keyboardType="default"
              />
              {isbn && isbn.replace(/[-\s]/g, '').length !== 10 && isbn.replace(/[-\s]/g, '').length !== 13 && isbn.replace(/[-\s]/g, '').length !== 8 && (
                <Text style={styles.helperText}>ISBN should be 10 or 13 digits, ISSN should be 8 digits</Text>
              )}
            </View>

            {/* Level / Audience Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Level / Audience</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setLevelModalVisible(true)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !level && styles.dropdownPlaceholder,
                  ]}
                >
                  {level || "Select level"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#E85D54" />
              </TouchableOpacity>
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

      {/* Modals */}
      <DropdownModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        options={categories}
        onSelect={setCategory}
        title="Select Category"
      />

      <DropdownModal
        visible={disciplineModalVisible}
        onClose={() => setDisciplineModalVisible(false)}
        options={disciplines}
        onSelect={setDiscipline}
        title="Select Discipline"
      />

      <DropdownModal
        visible={levelModalVisible}
        onClose={() => setLevelModalVisible(false)}
        options={levels}
        onSelect={setLevel}
        title="Select Level"
      />
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
    flex: 1,
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
    flex: 2,
    backgroundColor: "#E85D54", // I-SHELF coral red
  },

  progressBarEmpty: {
    flex: 4,
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

  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  dropdownText: {
    fontSize: 16,
    color: "#333",
  },

  dropdownPlaceholder: {
    color: "#999",
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 16,
  },

  optionsList: {
    maxHeight: 300,
  },

  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE8E6", // Light coral
  },

  optionText: {
    fontSize: 16,
    color: "#333",
  },

  helperText: {
    fontSize: 12,
    color: "#ff6b6b",
    marginTop: 4,
  },
});