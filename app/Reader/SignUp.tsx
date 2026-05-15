import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { readerAuth } from "../readerAPI";
import Toast from "../Toast";

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.', 'Engr.', 'Pharm.', 'Rev.', 'Chief', 'Alhaji', 'Alhaja', 'Barr.'];

export default function SignUp() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" | "warning" });

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: "", type: "success" });
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await readerAuth.register(title, fullName, email, institution, password);
      showToast("Registration successful! You can now login.", "success");
      setTimeout(() => router.push("/Reader/Login"), 2000);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title Picker Modal */}
      <Modal visible={showTitlePicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowTitlePicker(false)} activeOpacity={1}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Title</Text>
            <FlatList
              data={TITLES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { setTitle(item); setShowTitlePicker(false); }}
                >
                  <Text style={[styles.modalItemText, title === item && { color: '#E85D54', fontWeight: '700' }]}>{item}</Text>
                  {title === item && <Ionicons name="checkmark" size={20} color="#E85D54" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
          <Text style={styles.subtitle}>Sign up to get access to your academic resources</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Title Picker */}
            <Text style={styles.label}>Title <Text style={{ color: '#999', fontWeight: '400' }}>(Optional)</Text></Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTitlePicker(true)}>
              <Text style={[styles.pickerText, !title && { color: '#bbb' }]}>{title || 'Select title...'}</Text>
              <Ionicons name="chevron-down" size={18} color="#888" />
            </TouchableOpacity>

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

            <Text style={styles.label}>Institution <Text style={{ color: '#999', fontWeight: '400' }}>(Optional)</Text></Text>
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
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {toast.visible && <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />}

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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  backButton: { paddingHorizontal: 16, paddingVertical: 8 },
  logoContainer: {
    alignItems: "center", marginTop: 10, marginBottom: 10,
    backgroundColor: "#FFE8E6", width: 80, height: 80,
    borderRadius: 40, alignSelf: "center", justifyContent: "center",
  },
  logoImage: { width: 60, height: 60 },
  title: { fontSize: 24, fontWeight: "700", color: "#E85D54", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#333", textAlign: "center", paddingHorizontal: 40, marginBottom: 20 },
  form: { paddingHorizontal: 24 },
  label: { fontSize: 14, fontWeight: "500", color: "#000", marginBottom: 6, marginTop: 8 },
  input: {
    height: 44, borderWidth: 1.5, borderColor: "#FFD4D1",
    borderRadius: 10, paddingHorizontal: 14, fontSize: 14,
  },
  pickerButton: {
    height: 44, borderWidth: 1.5, borderColor: "#FFD4D1",
    borderRadius: 10, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  pickerText: { fontSize: 14, color: '#333' },
  signUpButton: {
    marginHorizontal: 24, marginTop: 20, height: 50,
    backgroundColor: "#E85D54", borderRadius: 25,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  signUpButtonText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  loginContainer: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  loginText: { fontSize: 13, color: "#333" },
  loginLink: { fontSize: 13, fontWeight: "600", color: "#E85D54" },
  orText: { fontSize: 13, color: "#999", textAlign: "center", marginTop: 18, marginBottom: 14 },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 20 },
  socialButton: {
    width: 60, height: 60, backgroundColor: "#FFE8E6",
    borderRadius: 14, justifyContent: "center", alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 16, paddingBottom: 30, maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'center',
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    marginHorizontal: 16, marginBottom: 8,
  },
  modalItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 24,
    borderBottomWidth: 1, borderBottomColor: '#f9f9f9',
  },
  modalItemText: { fontSize: 16, color: '#333' },
});
