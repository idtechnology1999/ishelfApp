import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      author: "Dr Ade-Ajayi",
      title: "Abstract Color Poster",
      price: 1500,
      quantity: 1,
    },
    {
      id: 2,
      author: "Dr Ade-Ajayi",
      title: "Abstract Color Poster",
      price: 1500,
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleMakePayment = () => {
    router.push("/Reader/courses/MakePayment");
  };

  const ContinueShopping =()=>{
      router.push("/Reader/(ReaderTabs)/explore");

  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = 750;
  const total = subtotal + vat;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#0A3D91" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image
                source={require("../../../assets/images/book-placeholder.png")}
                style={styles.bookImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.authorText}>{item.author}</Text>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.price}>N{item.price}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>N{subtotal.toLocaleString()}</Text>
          </View>

          <View style={[styles.summaryRow, styles.summaryRowBorder]}>
            <Text style={styles.summaryLabel}>V.A.T</Text>
            <Text style={styles.summaryValue}>N{vat}</Text>
          </View>

          <View style={styles.discountSection}>
            <Text style={styles.discountLabel}>Discount Code(If any)</Text>
            <TextInput
              style={styles.discountInput}
              placeholder="Enter Here"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>N{total.toLocaleString()}</Text>
          </View>

          <TouchableOpacity style={styles.paymentButton} onPress={handleMakePayment}>
            <Text style={styles.paymentButtonText}>Make Payment</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={ContinueShopping}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D91",
    flex: 1,
    textAlign: "center",
  },
  cartItemsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#E8F1FF",
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  authorText: {
    fontSize: 13,
    color: "#000",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: "#000",
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3D91",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    gap: 12,
  },
  quantityButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    minWidth: 20,
    textAlign: "center",
  },
  deleteButton: {
    padding: 4,
  },
  orderSummary: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: "#0A3D91",
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryRowBorder: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#000",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  discountSection: {
    marginBottom: 24,
  },
  discountLabel: {
    fontSize: 14,
    color: "#000",
    marginBottom: 12,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  paymentButton: {
    backgroundColor: "#0A3D91",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  continueButton: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#0A3D91",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D91",
  },
});