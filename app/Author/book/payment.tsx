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

export default function Payment() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("Card");

  const handleProceed = () => {
    if (selectedMethod === "Card") {
      router.push("/Author/book/payment-successful");
    } else if (selectedMethod === "Bank Transfer") {
      router.push("/Author/book/payment-successful");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Payment Method Section */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Card Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedMethod === "Card" && styles.paymentOptionSelected,
          ]}
          onPress={() => setSelectedMethod("Card")}
        >
          <View style={styles.radioCircle}>
            {selectedMethod === "Card" && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <Text style={styles.paymentText}>Card</Text>
        </TouchableOpacity>

        {/* Bank Transfer Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedMethod === "Bank Transfer" && styles.paymentOptionSelected,
          ]}
          onPress={() => setSelectedMethod("Bank Transfer")}
        >
          <View style={styles.radioCircle}>
            {selectedMethod === "Bank Transfer" && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <Text style={styles.paymentText}>Bank Transfer</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleProceed}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D91",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D91",
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0D7E2",
    backgroundColor: "#FFFFFF",
    gap: 16,
  },

  paymentOptionSelected: {
    backgroundColor: "#D6E9FF",
    borderColor: "#0A3D91",
  },

  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0A3D91",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0A3D91",
  },

  paymentText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0A3D91",
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },

  continueButton: {
    height: 56,
    backgroundColor: "#0A3D91",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});