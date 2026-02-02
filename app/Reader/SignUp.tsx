import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign up logic
     router.push("/Reader/Login")
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#E85D54" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to i-shelf</Text>
        <Text style={styles.subtitle}>
          Sign up to get access to your academic resources
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder=""
          />

          <Text style={styles.label}>E-Mail Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Institution(not required)</Text>
          <TextInput
            style={styles.input}
            value={institution}
            onChangeText={setInstitution}
            placeholder=""
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder=""
            secureTextEntry
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/Reader/Login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Social Login */}
        <Text style={styles.orText}>Or Continue With</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={28} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={28} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={28} color="#000000" />
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FFE8E6", // Light coral background
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 44,
    borderWidth: 1.5,
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  signUpButton: {
    marginHorizontal: 24,
    marginTop: 20,
    height: 50,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  loginText: {
    fontSize: 13,
    color: "#333",
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
  },
  orText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    backgroundColor: "#FFE8E6", // Light coral background
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});