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

export default function SignUpSuccessful() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/Author/Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={80} color="#FFFFFF" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Sign Up Successful</Text>

        {/* Login Link */}
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginLink}>Login</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#2ECC71",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#2ECC71",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },

  loginLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D91",
  },
});