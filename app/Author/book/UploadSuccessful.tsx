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
    router.push("/Author/(AuthorTabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={70} color="#FFFFFF" />
        </View>
        
        <Text style={styles.title}>Payment Successful</Text>
        
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.linkText}>
           Go to <Text style={styles.linkUnderline}>Home</Text>
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
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#000000",
  },
  linkUnderline: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});