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

const getCommissionRate = (authorPrice: number): number => {
  if (authorPrice <= 2000) return 0.20;
  if (authorPrice <= 3500) return 0.15;
  return 0.10;
};

const calculatePublicPrice = (authorPrice: number): number => {
  return Math.round(authorPrice * (1 + getCommissionRate(authorPrice)));
};

export default function Upload5() {
  const router = useRouter();
  const scrollRef = useRef<any>(null);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadDraftBook(); }, []);

  const loadDraftBook = async () => {
    try {
      const response = await authorAPI.getDraftBook();
      if (response.book) setPrice(response.book.price?.toString() || "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleContinue = async () => {
    if (!price) {
      Alert.alert("Required Field", "Please enter the pricing");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price");
      return;
    }
    setLoading(true);
    try {
      await authorAPI.uploadBook({ price: numPrice });
      router.push("/Author/book/UploadContinue6");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save book data");
    } finally {
      setLoading(false);
    }
  };

  const numPrice = parseFloat(price);
  const hasValidPrice = !isNaN(numPrice) && numPrice > 0;
  const publicPrice = hasValidPrice ? calculatePublicPrice(numPrice) : 0;
  const commissionPct = hasValidPrice ? Math.round(getCommissionRate(numPrice) * 100) : 0;

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
              <Text style={styles.progressTitle}>Pricing & Sales Settings</Text>
              <Text style={styles.progressCounter}>5/6</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFilled} />
              <View style={styles.progressBarEmpty} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Price (₦)</Text>
              <Text style={styles.sublabel}>Set the amount you want to earn per sale</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price in Naira"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                color="#333"
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250)}
              />
            </View>

            {/* Live public price preview */}
            {hasValidPrice && (
              <View style={styles.pricePreviewCard}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Your earnings</Text>
                  <Text style={styles.previewAuthorPrice}>₦{numPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.previewDivider} />
                <View style={styles.previewRow}>
                  <View>
                    <Text style={styles.previewLabel}>I-Shelf commission</Text>
                    <Text style={styles.previewNote}>({commissionPct}% added to your price)</Text>
                  </View>
                  <Text style={styles.previewCommission}>+₦{(publicPrice - numPrice).toLocaleString()}</Text>
                </View>
                <View style={styles.previewDivider} />
                <View style={styles.previewRow}>
                  <Text style={styles.previewPublicLabel}>Public price readers pay</Text>
                  <Text style={styles.previewPublicPrice}>₦{publicPrice.toLocaleString()}</Text>
                </View>
              </View>
            )}

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
  progressSection: { paddingHorizontal: 24, marginBottom: 32 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressTitle: { fontSize: 16, fontWeight: "600", color: "#E85D54" },
  progressCounter: { fontSize: 14, fontWeight: "500", color: "#666" },
  progressBarContainer: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFilled: { flex: 5, backgroundColor: "#E85D54" },
  progressBarEmpty: { flex: 1, backgroundColor: "#FFE8E6" },
  form: { paddingHorizontal: 24 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  sublabel: { fontSize: 12, color: "#888", marginBottom: 10 },
  input: { height: 52, borderWidth: 1, borderColor: "#FFD4D1", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: "#333", backgroundColor: "#FFFFFF" },
  pricePreviewCard: {
    backgroundColor: "#FFF5F4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    padding: 16,
    marginBottom: 28,
  },
  previewRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  previewDivider: { height: 1, backgroundColor: "#FFD4D1", marginVertical: 4 },
  previewLabel: { fontSize: 13, color: "#666" },
  previewNote: { fontSize: 11, color: "#E85D54", marginTop: 1 },
  previewAuthorPrice: { fontSize: 15, fontWeight: "600", color: "#333" },
  previewCommission: { fontSize: 14, fontWeight: "500", color: "#888" },
  previewPublicLabel: { fontSize: 14, fontWeight: "700", color: "#333" },
  previewPublicPrice: { fontSize: 20, fontWeight: "700", color: "#E85D54" },
  continueButton: {
    height: 56, backgroundColor: "#E85D54", borderRadius: 28,
    alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 16,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  continueButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  buttonDisabled: { opacity: 0.6 },
});
