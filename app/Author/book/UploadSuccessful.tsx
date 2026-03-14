import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function UploadSuccessful() {
  const router = useRouter();

  useEffect(() => {
    completeUpload();
  }, []);

  const completeUpload = async () => {
    try {
      await authorAPI.completeBookUpload();
    } catch (error) {
      console.error('Failed to mark upload as complete:', error);
    }
  };

  const handleContinue = () => {
    router.push("/Author/(AuthorTabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color="#E85D54" />
        </View>
        
        <Text style={styles.title}>Upload Successful!</Text>
        <Text style={styles.subtitle}>
          Your book will be verified within 30 minutes. Check your book back later.
        </Text>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleContinue}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
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
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 48,
  },
  homeButton: {
    width: "100%",
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
  homeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});