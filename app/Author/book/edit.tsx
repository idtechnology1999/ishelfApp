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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { authorAPI } from "../../authorAPI";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.i-shelf.app';

const getCommissionRate = (p: number) => {
  if (p <= 2000) return 0.20;
  if (p <= 3500) return 0.15;
  return 0.10;
};
const calcPublicPrice = (p: number) => Math.round(p * (1 + getCommissionRate(p)));

export default function EditBook() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const scrollRef = useRef<any>(null);
  const formY = useRef(0);
  const fieldY = useRef<{ [k: string]: number }>({});

  const [currentCoverImage, setCurrentCoverImage] = useState<string | null>(null);
  const [newCoverImage, setNewCoverImage] = useState<any>(null);
  const [currentPdfName, setCurrentPdfName] = useState<string | null>(null);
  const [newPdfFile, setNewPdfFile] = useState<any>(null);

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
    if (id) fetchBook();
  }, [id]);

  const scrollToField = (key: string) => {
    setTimeout(() => {
      const y = formY.current + (fieldY.current[key] ?? 0);
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 120), animated: true });
    }, 250);
  };

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
        if (book.coverImage) {
          const url = book.coverImage.startsWith('http')
            ? book.coverImage
            : `${API_URL}${book.coverImage.startsWith('/') ? '' : '/'}${book.coverImage}`;
          setCurrentCoverImage(url);
        }
        if (book.pdfFile) {
          setCurrentPdfName(book.pdfFile.split('/').pop() || 'book.pdf');
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const pickCoverImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.canceled) setNewCoverImage(result.assets[0]);
    } catch {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickPdfFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled) setNewPdfFile(result);
    } catch {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleSave = async () => {
    if (!bookTitle || !publicationYear || !language) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      if (newCoverImage) {
        await authorAPI.updateBookCoverImage(id as string, newCoverImage.uri);
      }
      if (newPdfFile) {
        const pdfUri = newPdfFile.assets ? newPdfFile.assets[0].uri : newPdfFile.uri;
        await authorAPI.updateBookPdfFile(id as string, pdfUri);
      }
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
            <Text style={styles.headerTitle}>Edit Book</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <View
            style={styles.form}
            onLayout={(e) => { formY.current = e.nativeEvent.layout.y; }}
          >
            {/* Cover Image */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cover Image</Text>
              <TouchableOpacity style={styles.fileBox} onPress={pickCoverImage}>
                {newCoverImage ? (
                  <Image source={{ uri: newCoverImage.uri }} style={styles.coverPreview} resizeMode="cover" />
                ) : currentCoverImage ? (
                  <Image source={{ uri: currentCoverImage }} style={styles.coverPreview} resizeMode="cover" />
                ) : (
                  <Ionicons name="image-outline" size={36} color="#E85D54" />
                )}
                <View style={styles.fileBoxOverlay}>
                  <Ionicons name="camera-outline" size={18} color="#fff" />
                  <Text style={styles.fileBoxOverlayText}>
                    {newCoverImage ? 'Image selected' : 'Change Cover'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* PDF File */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Book File (PDF)</Text>
              <TouchableOpacity style={styles.pdfBox} onPress={pickPdfFile}>
                <Ionicons
                  name={newPdfFile ? "checkmark-circle" : "document-outline"}
                  size={28}
                  color={newPdfFile ? "#22c55e" : "#E85D54"}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pdfBoxTitle}>
                    {newPdfFile
                      ? (newPdfFile.assets ? newPdfFile.assets[0].name : newPdfFile.name) || 'File selected'
                      : currentPdfName || 'No file uploaded'}
                  </Text>
                  <Text style={styles.pdfBoxSub}>Tap to {currentPdfName ? 're-upload' : 'upload'} PDF only</Text>
                </View>
                <Ionicons name="cloud-upload-outline" size={22} color="#E85D54" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Book Title */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['title'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Book Title *</Text>
              <TextInput
                style={styles.input}
                value={bookTitle}
                onChangeText={setBookTitle}
                color="#333"
                onFocus={() => scrollToField('title')}
              />
            </View>

            {/* Subtitle */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['subtitle'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Subtitle</Text>
              <TextInput
                style={styles.input}
                value={subtitle}
                onChangeText={setSubtitle}
                color="#333"
                onFocus={() => scrollToField('subtitle')}
              />
            </View>

            {/* Co-authors */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['coAuthors'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Co-authors</Text>
              <TextInput
                style={styles.input}
                value={coAuthors}
                onChangeText={setCoAuthors}
                color="#333"
                onFocus={() => scrollToField('coAuthors')}
              />
            </View>

            {/* Edition */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['edition'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Edition</Text>
              <TextInput
                style={styles.input}
                value={edition}
                onChangeText={setEdition}
                color="#333"
                onFocus={() => scrollToField('edition')}
              />
            </View>

            {/* Publisher */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['publisher'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Publisher</Text>
              <TextInput
                style={styles.input}
                value={publisher}
                onChangeText={setPublisher}
                color="#333"
                onFocus={() => scrollToField('publisher')}
              />
            </View>

            {/* Publication Year */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['pubYear'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Publication Year *</Text>
              <TextInput
                style={styles.input}
                value={publicationYear}
                onChangeText={setPublicationYear}
                keyboardType="numeric"
                color="#333"
                onFocus={() => scrollToField('pubYear')}
              />
            </View>

            {/* Language */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['language'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Language *</Text>
              <TextInput
                style={styles.input}
                value={language}
                onChangeText={setLanguage}
                color="#333"
                onFocus={() => scrollToField('language')}
              />
            </View>

            {/* ISBN */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['isbn'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>ISBN/ISSN</Text>
              <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Enter ISBN or ISSN"
                placeholderTextColor="#bbb"
                color="#333"
                onFocus={() => scrollToField('isbn')}
              />
            </View>

            {/* Number of Pages */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['pageCount'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Number of Pages</Text>
              <TextInput
                style={styles.input}
                value={pageCount}
                onChangeText={setPageCount}
                keyboardType="numeric"
                color="#333"
                onFocus={() => scrollToField('pageCount')}
              />
            </View>

            {/* Description */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['description'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                color="#333"
                onFocus={() => scrollToField('description')}
              />
            </View>

            {/* Price */}
            <View
              style={styles.inputContainer}
              onLayout={(e) => { fieldY.current['price'] = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.label}>Your Price (₦)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                color="#333"
                onFocus={() => scrollToField('price')}
              />
              {(() => {
                const n = parseFloat(price);
                if (!isNaN(n) && n > 0) {
                  const pub = calcPublicPrice(n);
                  const pct = Math.round(getCommissionRate(n) * 100);
                  return (
                    <View style={styles.pricePreview}>
                      <Text style={styles.previewText}>
                        Public price readers pay:{" "}
                        <Text style={styles.previewHighlight}>₦{pub.toLocaleString()}</Text>
                        {"  "}
                        <Text style={styles.previewNote}>({pct}% added)</Text>
                      </Text>
                    </View>
                  );
                }
                return null;
              })()}
            </View>

            {/* Save Button — inside scroll so keyboard never covers it */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 18, fontWeight: "600", color: "#E85D54",
    flex: 1, textAlign: "center",
  },
  headerSpacer: { width: 36 },

  form: { paddingHorizontal: 24 },

  inputContainer: { marginBottom: 20 },

  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },

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

  textArea: { height: 100, paddingTop: 12 },

  saveButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#E85D54",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  buttonDisabled: { opacity: 0.6 },
  pricePreview: { marginTop: 8, backgroundColor: "#FFF5F4", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#FFD4D1" },
  previewText: { fontSize: 13, color: "#555" },
  previewHighlight: { fontWeight: "700", color: "#E85D54" },
  previewNote: { color: "#888" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  fileBox: {
    height: 160,
    borderWidth: 2,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F8',
  },
  coverPreview: { width: '100%', height: '100%', position: 'absolute' },
  fileBoxOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(232,93,84,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  fileBoxOverlayText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  pdfBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD4D1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFF9F8',
  },
  pdfBoxTitle: { fontSize: 14, fontWeight: '500', color: '#333' },
  pdfBoxSub: { fontSize: 12, color: '#999', marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: '#FFD4D1',
    marginVertical: 8,
    marginBottom: 20,
  },
});
