import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Upload2() {
  const router = useRouter();
  const { new: isNew } = useLocalSearchParams();

  const scrollRef = useRef<any>(null);
  const formY = useRef(0);
  const fieldY = useRef<{ [k: string]: number }>({});

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

  const scrollToField = (key: string) => {
    setTimeout(() => {
      const y = formY.current + (fieldY.current[key] ?? 0);
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
    }, 250);
  };

  const handleContinue = async () => {
    if (!bookTitle || !publicationYear || !language) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await authorAPI.uploadBook({ title: bookTitle, subtitle, coAuthors, edition, publisher, publicationYear, language });
      router.push("/Author/book/UploadContinue2");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save book data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.progressTitle}>Book/Publication Basic Details</Text>
              <Text style={styles.progressCounter}>1/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form} onLayout={(e) => { formY.current = e.nativeEvent.layout.y; }}>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['title'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Book Title</Text>
              <TextInput style={styles.input} value={bookTitle} onChangeText={setBookTitle} color="#333" onFocus={() => scrollToField('title')} />
            </View>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['subtitle'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Subtitle (optional)</Text>
              <TextInput style={styles.input} value={subtitle} onChangeText={setSubtitle} color="#333" onFocus={() => scrollToField('subtitle')} />
            </View>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['coAuthors'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Co-authors (optional)</Text>
              <TextInput style={styles.input} value={coAuthors} onChangeText={setCoAuthors} color="#333" onFocus={() => scrollToField('coAuthors')} />
            </View>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['edition'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Edition (1st, 2nd, etc.)</Text>
              <TextInput style={styles.input} value={edition} onChangeText={setEdition} color="#333" onFocus={() => scrollToField('edition')} />
            </View>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['publisher'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Publisher (optional)</Text>
              <TextInput style={styles.input} value={publisher} onChangeText={setPublisher} color="#333" onFocus={() => scrollToField('publisher')} />
            </View>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['pubYear'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Publication Year</Text>
              <TextInput style={styles.input} value={publicationYear} onChangeText={setPublicationYear} keyboardType="numeric" color="#333" onFocus={() => scrollToField('pubYear')} />
            </View>

            <View style={styles.inputContainer} onLayout={(e) => { fieldY.current['language'] = e.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Language</Text>
              <TextInput style={styles.input} value={language} onChangeText={setLanguage} color="#333" onFocus={() => scrollToField('language')} />
            </View>

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
  progressTitle: { fontSize: 16, fontWeight: "600", color: "#E85D54" },
  progressCounter: { fontSize: 14, fontWeight: "500", color: "#666" },
  progressBarContainer: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFilled: { flex: 1, backgroundColor: "#E85D54" },
  progressBarEmpty: { flex: 5, backgroundColor: "#FFE8E6" },
  form: { paddingHorizontal: 24 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderColor: "#FFD4D1", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: "#333", backgroundColor: "#FFFFFF" },
  continueButton: {
    height: 56, backgroundColor: "#E85D54", borderRadius: 28,
    alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 16,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  continueButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  buttonDisabled: { opacity: 0.6 },
});
