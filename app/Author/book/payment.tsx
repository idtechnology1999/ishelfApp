import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorAPI } from "../../authorAPI";

export default function Payment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  useEffect(() => {
    loadAuthorData();
    checkExistingPayment();
  }, []);

  const loadAuthorData = async () => {
    const data = await AsyncStorage.getItem('authorData');
    if (data) {
      const author = JSON.parse(data);
      setEmail(author.email);
    }
  };

  const checkExistingPayment = async () => {
    try {
      const response = await authorAPI.checkActivePayment();
      if (response.hasActivePayment) {
        Alert.alert(
          'Payment Already Completed',
          'You have already paid for book upload. Continue to upload your book.',
          [
            { text: 'Continue', onPress: () => router.replace('/Author/book/UploadContinue1') }
          ]
        );
      } else {
        const reference = await AsyncStorage.getItem('paymentReference');
        if (reference) {
          setPaymentReference(reference);
        }
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    }
  };

  const handlePayment = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    setLoading(true);
    try {
      const response = await authorAPI.initializePayment(email, 7000);
      const { authorization_url, reference } = response.data;

      setPaymentReference(reference);
      await AsyncStorage.setItem('paymentReference', reference);

      const supported = await Linking.canOpenURL(authorization_url);
      if (supported) {
        await Linking.openURL(authorization_url);
      } else {
        Alert.alert('Error', 'Cannot open payment page');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    const reference = paymentReference || await AsyncStorage.getItem('paymentReference');
    if (!reference) {
      Alert.alert('Error', 'No payment to verify');
      return;
    }
    verifyPayment(reference);
  };

  const verifyPayment = async (reference: string) => {
    setVerifying(true);
    try {
      const response = await authorAPI.verifyPayment(reference);
      if (response.success) {
        await AsyncStorage.removeItem('paymentReference');
        router.replace('/Author/book/payment-successful');
      } else {
        Alert.alert('Payment Failed', 'Please try again');
      }
    } catch (error) {
      Alert.alert('Verification Error', 'Please contact support');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Upload Fee Payment</Text>
          <Text style={styles.infoAmount}>₦7,000</Text>
          <Text style={styles.infoDescription}>
            One-time payment to publish your book on iShelf
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.payButton, loading && styles.buttonDisabled]} 
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>Pay with Paystack</Text>
          )}
        </TouchableOpacity>

        {paymentReference && (
          <TouchableOpacity 
            style={[styles.verifyButton, verifying && styles.buttonDisabled]} 
            onPress={handleVerifyPayment}
            disabled={verifying}
          >
            {verifying ? (
              <ActivityIndicator color="#E85D54" />
            ) : (
              <Text style={styles.verifyButtonText}>I've Completed Payment - Verify</Text>
            )}
          </TouchableOpacity>
        )}
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
    color: "#E85D54",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  infoContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },

  infoTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },

  infoAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#E85D54",
    marginBottom: 12,
  },

  infoDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  payButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 32,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  payButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  verifyButton: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 16,
  },

  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E85D54",
  },
});
