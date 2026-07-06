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
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Upload7() {
  const router = useRouter();
  const scrollRef = useRef<any>(null);
  const [tags, setTags] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadDraftBook(); }, []);

  const loadDraftBook = async () => {
    try {
      const response = await authorAPI.getDraftBook();
      if (response.book && response.book.keywords) {
        setTags(response.book.keywords.join(", "));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!acceptTerms) {
      Alert.alert("Terms & Conditions", "Please accept the terms and conditions");
      return;
    }
    setLoading(true);
    try {
      const keywords = tags.split(",").map(k => k.trim()).filter(k => k);
      await authorAPI.uploadBook({ keywords });
      await authorAPI.completeBookUpload();
      router.replace("/Author/book/UploadSuccessful");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to complete upload");
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
              <Text style={styles.progressTitle}>Additional Smart Features</Text>
              <Text style={styles.progressCounter}>6/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Keywords (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={tags}
                onChangeText={setTags}
                placeholder="e.g. Mathematics, Calculus, Engineering"
                placeholderTextColor="#bbb"
                color="#333"
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250)}
              />
            </View>

            {/* Accept Terms */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)} activeOpacity={0.7}>
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              <View style={styles.termsTextRow}>
                <Text style={styles.checkboxText}>I agree to the </Text>
                <TouchableOpacity onPress={() => router.push("/Author/book/PolicyScreen")} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
                  <Text style={styles.termsLink}>Author Policy & Terms</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.uploadButton, loading && styles.buttonDisabled]}
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.uploadButtonText}>Upload</Text>}
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
  progressSection: { paddingHorizontal: 24, marginBottom: 32 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressTitle: { fontSize: 16, fontWeight: "600", color: "#E85D54" },
  progressCounter: { fontSize: 14, fontWeight: "500", color: "#666" },
  progressBarContainer: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFilled: { flex: 1, backgroundColor: "#E85D54" },
  form: { paddingHorizontal: 24 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderColor: "#FFD4D1", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: "#333", backgroundColor: "#FFFFFF" },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: "#FFD4D1", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  checkboxChecked: { backgroundColor: "#E85D54", borderColor: "#E85D54" },
  termsTextRow: { flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  checkboxText: { fontSize: 14, color: "#333" },
  termsLink: { color: "#E85D54", textDecorationLine: "underline", fontSize: 14 },
  uploadButton: {
    height: 56, backgroundColor: "#E85D54", borderRadius: 28,
    alignItems: "center", justifyContent: "center", marginBottom: 16,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  uploadButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  buttonDisabled: { opacity: 0.6 },
});
