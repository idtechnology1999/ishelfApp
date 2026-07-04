import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";
import { BOOK_CATEGORIES } from "../../constants/categories";

export default function Upload3() {
  const router = useRouter();

  const scrollRef = useRef<any>(null);
  const formY = useRef(0);
  const fieldY = useRef<{ [k: string]: number }>({});

  const [category, setCategory] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [level, setLevel] = useState("");
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
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

  const scrollToField = (key: string) => {
    setTimeout(() => {
      const y = formY.current + (fieldY.current[key] ?? 0);
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
    }, 250);
  };

  const categories = BOOK_CATEGORIES;

  const levels = [
    "Jambites", "100lvl", "200lvl", "300lvl", "400lvl", "500lvl",
    "Post-Graduates", "Professional", "All Levels",
  ];

  const handleContinue = async () => {
    if (!category || !level) {
      Alert.alert("Error", "Please select a category and level");
      return;
    }
    setLoading(true);
    try {
      await authorAPI.uploadBook({ category, isbn: isbn || undefined });
      router.push("/Author/book/UploadContinue3");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save book data");
    } finally {
      setLoading(false);
    }
  };

  const DropdownModal = ({
    visible, onClose, options, onSelect, title,
  }: { visible: boolean; onClose: () => void; options: string[]; onSelect: (value: string) => void; title: string }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.optionsList}>
            {options.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionItem} onPress={() => { onSelect(option); onClose(); }}>
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
      <DropdownModal visible={categoryModalVisible} onClose={() => setCategoryModalVisible(false)} options={categories} onSelect={setCategory} title="Select Category" />
      <DropdownModal visible={levelModalVisible} onClose={() => setLevelModalVisible(false)} options={levels} onSelect={setLevel} title="Select Level" />

      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#E85D54" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Academic & Classification Details</Text>
              <Text style={styles.progressCounter}>2/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form} onLayout={(e) => { formY.current = e.nativeEvent.layout.y; }}>

            {/* Category Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setCategoryModalVisible(true)}>
                <Text style={[styles.dropdownText, !category && styles.dropdownPlaceholder]}>
                  {category || "Select category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#E85D54" />
              </TouchableOpacity>
            </View>

            {/* Course Code */}
            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['courseCode'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Course Code (if applicable)</Text>
              <TextInput
                style={styles.input}
                value={courseCode}
                onChangeText={setCourseCode}
                color="#333"
                onFocus={() => scrollToField('courseCode')}
              />
            </View>

            {/* ISBN/ISSN */}
            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['isbn'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>ISBN or ISSN (optional)</Text>
              <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Enter ISBN or ISSN number"
                placeholderTextColor="#bbb"
                color="#333"
                onFocus={() => scrollToField('isbn')}
              />
              {isbn && isbn.replace(/[-\s]/g, '').length !== 10 && isbn.replace(/[-\s]/g, '').length !== 13 && isbn.replace(/[-\s]/g, '').length !== 8 && (
                <Text style={styles.helperText}>ISBN should be 10 or 13 digits, ISSN should be 8 digits</Text>
              )}
            </View>

            {/* Level Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Level / Audience</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setLevelModalVisible(true)}>
                <Text style={[styles.dropdownText, !level && styles.dropdownPlaceholder]}>
                  {level || "Select level"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#E85D54" />
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.continueButtonText}>Continue</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#E85D54", flex: 1, textAlign: "center" },
  headerSpacer: { width: 36 },
  progressSection: { paddingHorizontal: 24, marginBottom: 24 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressTitle: { fontSize: 16, fontWeight: "600", color: "#E85D54", flex: 1 },
  progressCounter: { fontSize: 14, fontWeight: "500", color: "#666" },
  progressBarContainer: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFilled: { flex: 2, backgroundColor: "#E85D54" },
  progressBarEmpty: { flex: 4, backgroundColor: "#FFE8E6" },
  form: { paddingHorizontal: 24 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderColor: "#FFD4D1", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: "#333", backgroundColor: "#FFFFFF" },
  dropdown: { height: 52, borderWidth: 1, borderColor: "#FFD4D1", borderRadius: 12, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" },
  dropdownText: { fontSize: 16, color: "#333" },
  dropdownPlaceholder: { color: "#999" },
  helperText: { fontSize: 12, color: "#ff6b6b", marginTop: 4 },
  continueButton: {
    height: 56, backgroundColor: "#E85D54", borderRadius: 28,
    alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 16,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  continueButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  buttonDisabled: { opacity: 0.6 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, width: "80%", maxHeight: "70%" },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#E85D54", marginBottom: 16 },
  optionsList: { maxHeight: 350 },
  optionItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFE8E6" },
  optionText: { fontSize: 15, color: "#333" },
});
