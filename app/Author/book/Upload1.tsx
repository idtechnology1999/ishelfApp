import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Upload1() {
  const router = useRouter();
  const [isbn, setIsbn] = useState(["", "", "", "", "", "", "", "", "", ""]);
  const [selectedOption, setSelectedOption] = useState("ISBN For Books");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleIsbnChange = (text: string, index: number) => {
    // Only allow single character
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newIsbn = [...isbn];
    newIsbn[index] = text;
    setIsbn(newIsbn);

    // Auto-focus next input
    if (text && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !isbn[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullIsbn = isbn.join("");
    if (fullIsbn.length === 10) {
      console.log("Verifying ISBN:", fullIsbn);
      // Add verification logic here
    }
  };

  const handlePayUploadFee = () => {
    // Navigate to payment or next step
    // router.push("/book/Upload2");
  };

  const handleProceedToPayment = () => {
    // Navigate to payment screen
    router.push("/Author/book/payment");
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
          <Text style={styles.headerTitle}>Upload Your Book</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            To Publish your book on i-shelf, a one-time upload fee is required
          </Text>
        </View>

        {/* ISBN Section */}
        <Text style={styles.sectionTitle}>
          Do you already have a valid ISBN or ISSN?
        </Text>

        <Text style={styles.label}>Enter Here</Text>
        <View style={styles.isbnContainer}>
          {isbn.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.isbnInput}
              value={digit}
              onChangeText={(text) => handleIsbnChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="default"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={`ISBN digit ${index + 1}`}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        {/* Pay Upload Fee Button */}
        <TouchableOpacity
          style={styles.payUploadButton}
          onPress={handlePayUploadFee}
        >
          <Text style={styles.payUploadButtonText}>Pay Upload fee</Text>
        </TouchableOpacity>

        {/* Publishing Setup Section */}
        <Text style={styles.sectionTitle}>Complete your publishing Setup</Text>
        <Text style={styles.setupDescription}>
          Pay once. Upload your book and get your official ISBN/ISSN in a single transaction
        </Text>

        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Upload fee</Text>
          <Text style={styles.feeAmount}>₦30,000</Text>
        </View>

        {/* Radio Options */}
        <Text style={styles.radioQuestion}>Do you Need an ISBN or ISSN Number?</Text>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedOption("ISBN For Books")}
        >
          <View style={styles.radioCircle}>
            {selectedOption === "ISBN For Books" && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <Text style={styles.radioText}>ISBN For Books</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedOption("ISSN For Journals")}
        >
          <View style={styles.radioCircle}>
            {selectedOption === "ISSN For Journals" && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <Text style={styles.radioText}>ISSN For Journals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedOption("I already have one")}
        >
          <View style={styles.radioCircle}>
            {selectedOption === "I already have one" && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <Text style={styles.radioText}>I already have one</Text>
        </TouchableOpacity>

        {/* Total Amount */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₦50,000</Text>
        </View>

        {/* Proceed to Payment Button */}
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
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

  infoContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  isbnContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
  },

  isbnInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#D0D7E2",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },

  verifyButton: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0A3D91",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginBottom: 12,
  },

  verifyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D91",
  },

  payUploadButton: {
    height: 56,
    backgroundColor: "#0A3D91",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginBottom: 32,
  },

  payUploadButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  setupDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  feeLabel: {
    fontSize: 15,
    color: "#333",
  },

  feeAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  radioQuestion: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
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

  radioText: {
    fontSize: 15,
    color: "#333",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },

  proceedButton: {
    height: 56,
    backgroundColor: "#0A3D91",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },

  proceedButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});