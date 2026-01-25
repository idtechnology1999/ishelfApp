import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccess() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/Author/book/UploadContinue1");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={80} color="#FFFFFF" />
        </View>
        
        <Text style={styles.title}>Payment Successful</Text>
        
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.linkText}>
            Continue to <Text style={styles.linkUnderline}>Upload</Text>
          </Text>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#000000",
  },
  linkUnderline: {
    color: "#0A3D91",
    textDecorationLine: "underline",
  },
});