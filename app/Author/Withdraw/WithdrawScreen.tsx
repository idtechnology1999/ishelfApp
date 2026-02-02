import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Withdraw() {
  const router = useRouter();
  const [amount, setAmount] = useState("");

  const handleConfirmWithdrawal = () => {
    router.push("/Author/Withdraw/ComfirmWithdraw");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#E85D54" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Withdraw</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Current Balance */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Current Balance:</Text>
            <Text style={styles.balanceAmount}>₦342,000</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Amount to withdraw</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder=""
              keyboardType="numeric"
              placeholderTextColor="#999999"
            />
            <Text style={styles.minimumText}>Minimum withdrawal: ₦1,000</Text>
          </View>

          {/* Bank Account Confirmation */}
          <View style={styles.bankSection}>
            <Text style={styles.bankTitle}>Confirm bank account</Text>
            <View style={styles.bankCard}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Bank Name: </Text>
                <Text style={styles.bankValue}>Polaris Bank</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Account Number: </Text>
                <Text style={styles.bankValue}>0984737274</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Account Name: </Text>
                <Text style={styles.bankValue}>Tunde Afolayan</Text>
              </View>
            </View>
          </View>

          {/* Confirm Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmWithdrawal}
            >
              <Text style={styles.confirmButtonText}>Confirm Withdrawal</Text>
            </TouchableOpacity>
          </View>
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

  content: {
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
    fontSize: 20,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  balanceSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },

  balanceLabel: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },

  balanceAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
  },

  inputSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },

  inputLabel: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 12,
  },

  input: {
    height: 80,
    borderWidth: 2,
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },

  minimumText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 8,
  },

  bankSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },

  bankTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },

  bankCard: {
    backgroundColor: "#FFE8E6", // Light coral background
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
  },

  bankRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  bankLabel: {
    fontSize: 15,
    color: "#000000",
  },

  bankValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },

  buttonContainer: {
    paddingHorizontal: 24,
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },

  confirmButton: {
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

  confirmButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});