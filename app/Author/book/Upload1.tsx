import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Upload1() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await authorAPI.checkActivePayment();
      setHasPaid(response.hasActivePayment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (hasPaid) {
      router.push("/Author/book/UploadContinue1");
    } else {
      router.push("/Author/book/payment");
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Your Book</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.infoContainer}>
          {hasPaid ? (
            <View style={styles.paidBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={styles.paidText}>
                Your one-time payment has been paid
              </Text>
            </View>
          ) : (
            <Text style={styles.infoText}>
              To Publish your book on i-shelf, a one-time upload fee of ₦7,000 is required
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceed}
        >
          <Text style={styles.proceedButtonText}>
            {hasPaid ? "Continue Upload" : "Proceed to Payment (₦7,000)"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
    marginBottom: 40,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    textAlign: "center",
  },

  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },

  paidText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22c55e",
  },

  proceedButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 32,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  proceedButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
