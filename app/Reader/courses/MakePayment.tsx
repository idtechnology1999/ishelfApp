import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MakePayment() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("card");

  const handlePayment = () => {
    router.push("/Reader/courses/paymentSuccessful");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#0A3D91" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Card Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedMethod === "card" && styles.paymentOptionSelected,
          ]}
          onPress={() => {
            setSelectedMethod("card");
            handlePayment();
          }}
        >
          <View style={styles.radioButton}>
            {selectedMethod === "card" && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentOptionText}>Card</Text>
        </TouchableOpacity>

        {/* Bank Transfer Option */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedMethod === "bank" && styles.paymentOptionSelected,
          ]}
          onPress={() => {
            setSelectedMethod("bank");
            handlePayment();
          }}
        >
          <View style={styles.radioButton}>
            {selectedMethod === "bank" && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentOptionText}>Bank Transfer</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D91",
    flex: 1,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D91",
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  paymentOptionSelected: {
    backgroundColor: "#E8F1FF",
    borderColor: "#0A3D91",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0A3D91",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0A3D91",
  },
  paymentOptionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D91",
  },
});