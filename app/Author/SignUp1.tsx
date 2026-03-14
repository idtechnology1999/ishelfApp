import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StaticBackgroundPattern } from "../../components/BackgroundPattern";

export default function SignUp1() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('signupData');
      if (saved) {
        const data = JSON.parse(saved);
        setFullName(data.fullName || '');
        setEmail(data.email || '');
        setInstitution(data.institution || '');
        setReferralCode(data.referralCode || '');
      }
    };
    loadData();
  }, []);

  const handleContinue = async () => {
    if (fullName && email && institution) {
      const saved = await AsyncStorage.getItem('signupData');
      const data = saved ? JSON.parse(saved) : {};
      await AsyncStorage.setItem('signupData', JSON.stringify({ ...data, fullName, email, institution, referralCode: referralCode.trim().toUpperCase() }));
      router.replace("/Author/SignUp2");
    }
  };

  return (
    <>
      <StaticBackgroundPattern />
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/Author/Login")}
            accessibilityLabel="Go back to login"
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Welcome to i-shelf</Text>
            <Text style={styles.subtitle}>
              Sign up to this platform to reach a larger audience
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
                accessibilityLabel="Full name input"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-Mail Address</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email address input"
              />
            </View>

            {/* Institution Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institution.</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={institution}
                onChangeText={setInstitution}
                autoCapitalize="words"
                autoCorrect={false}
                accessibilityLabel="Institution input"
              />
            </View>

            {/* Referral Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Referral Code <Text style={{ color: '#999', fontWeight: '400' }}>(Optional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ISH-A3F9B2C1"
                placeholderTextColor="#bbb"
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabel="Referral code input"
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              accessibilityLabel="Continue to next step"
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
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

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  backButton: {
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE8E6", // Light coral matching brand
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logoImage: {
    width: 80,
    height: 80,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  form: {
    flex: 1,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },

  continueButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});