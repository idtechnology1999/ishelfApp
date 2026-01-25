import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PaymentSuccessful() {
  const router = useRouter();

  const handleViewLibrary = () => {
    router.push("/Reader/(ReaderTabs)/library");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={120} color="#FFFFFF" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Payment Successful</Text>
        
        {/* Library Link */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>View Purchased book in </Text>
          <TouchableOpacity onPress={handleViewLibrary}>
            <Text style={styles.libraryLink}>Library</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#000",
  },
  libraryLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D91",
    textDecorationLine: "underline",
  },
});