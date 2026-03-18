import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readerPayment, readerBooks, readerCart } from "../../readerAPI";

export default function MakePayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [book, setBook] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const isCartCheckout = !!params.bookIds;

  useEffect(() => {
    loadData();
    checkPaymentStatus();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('readerData');
      if (userData) setEmail(JSON.parse(userData).email);
      if (params.bookIds) {
        const data = await readerCart.getCartItems();
        const items = data.cartItems || [];
        setCartItems(items);
        setTotalAmount(items.reduce((sum: number, item: any) => sum + (item.bookId?.price || 0), 0));
      } else if (params.bookId) {
        const bookData = await readerBooks.getBookDetails(params.bookId as string);
        setBook(bookData.book);
        setTotalAmount(bookData.book.price || 0);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const checkPaymentStatus = async () => {
    const reference = await AsyncStorage.getItem('paymentReference');
    if (reference) setPaymentReference(reference);
  };

  const handlePayment = async () => {
    if (!email) { Alert.alert('Error', 'Missing payment information'); return; }
    setLoading(true);
    try {
      let response;
      if (isCartCheckout) {
        const bookIds = cartItems.map((item: any) => item.bookId._id);
        response = await readerPayment.initializeCartPayment(bookIds, email);
      } else {
        response = await readerPayment.initializePayment(book._id, email);
      }
      const { authorization_url, reference } = response.data || response;
      setPaymentReference(reference);
      await AsyncStorage.setItem('paymentReference', reference);
      const supported = await Linking.canOpenURL(authorization_url);
      if (supported) {
        await Linking.openURL(authorization_url);
      } else {
        Alert.alert('Error', 'Cannot open payment page');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    const reference = paymentReference || await AsyncStorage.getItem('paymentReference');
    if (!reference) { Alert.alert('Error', 'No payment to verify'); return; }
    setVerifying(true);
    try {
      const response = await readerPayment.verifyPayment(reference);
      if (response.success) {
        await AsyncStorage.removeItem('paymentReference');
        if (isCartCheckout) await readerCart.clearCart();
        router.replace('/Reader/courses/paymentSuccessful');
      } else {
        Alert.alert('Payment Failed', 'Please try again');
      }
    } catch {
      Alert.alert('Verification Error', 'Please contact support');
    } finally {
      setVerifying(false);
    }
  };

  const renderItems = () => {
    if (isCartCheckout) {
      return cartItems.map((item: any) => (
        <View key={item._id} style={styles.itemRow}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.bookId?.title}</Text>
          <Text style={styles.itemPrice}>₦{item.bookId?.price?.toLocaleString()}</Text>
        </View>
      ));
    }
    if (book) {
      return (
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.itemPrice}>₦{book.price?.toLocaleString()}</Text>
        </View>
      );
    }
    return <ActivityIndicator color="#E85D55" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D55" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make Payment</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {renderItems()}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₦{totalAmount.toLocaleString()}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={loading || totalAmount === 0}>
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.payButtonText}>Pay ₦{totalAmount.toLocaleString()} with Paystack</Text>}
        </TouchableOpacity>
        {!!paymentReference && (
          <TouchableOpacity
            style={[styles.verifyButton, verifying && styles.buttonDisabled]}
            onPress={handleVerifyPayment}
            disabled={verifying}>
            {verifying
              ? <ActivityIndicator color="#E85D55" />
              : <Text style={styles.verifyButtonText}>I've Completed Payment - Verify</Text>}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#E85D55", flex: 1, textAlign: "center" },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  summaryCard: { backgroundColor: "#FFF5F4", borderRadius: 16, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: "#FFE5E3" },
  summaryTitle: { fontSize: 18, fontWeight: "700", color: "#000", marginBottom: 16 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  itemTitle: { fontSize: 14, color: "#333", flex: 1, marginRight: 12 },
  itemPrice: { fontSize: 14, fontWeight: "600", color: "#333" },
  divider: { height: 1, backgroundColor: "#FFD4D1", marginVertical: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#000" },
  totalAmount: { fontSize: 28, fontWeight: "700", color: "#E85D55" },
  payButton: { backgroundColor: "#E85D55", paddingVertical: 16, borderRadius: 30, alignItems: "center", marginBottom: 16 },
  payButtonText: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  verifyButton: { backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#E85D55", paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  verifyButtonText: { fontSize: 16, fontWeight: "600", color: "#E85D55" },
  buttonDisabled: { opacity: 0.6 },
});
