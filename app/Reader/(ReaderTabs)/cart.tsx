import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { readerCart } from "../../readerAPI";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const data = await readerCart.getCartItems();
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (bookId: string) => {
    try {
      await readerCart.removeFromCart(bookId);
      setCartItems(cartItems.filter((item: any) => item.bookId._id !== bookId));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const handleViewBook = (bookId: string) => {
    router.push(`/Reader/courses/PreviewAddToCart?bookId=${bookId}`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add some books to your cart first');
      return;
    }
    const bookIds = cartItems.map((item: any) => item.bookId._id).join(',');
    router.push(`/Reader/courses/MakePayment?bookIds=${bookIds}`);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: any) => total + (item.bookId.price || 0), 0);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      );
    }
    if (cartItems.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse books and add them to your cart</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push("/Reader/(ReaderTabs)/explore")}>
            <Text style={styles.browseButtonText}>Browse Books</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View>
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item: any) => (
            <View key={item._id} style={styles.cartItem}>
              <TouchableOpacity onPress={() => handleViewBook(item.bookId._id)}>
                {item.bookId.coverImage ? (
                  <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${item.bookId.coverImage}` }} style={styles.bookImage} resizeMode="cover" />
                ) : (
                  <Image source={require("../../../assets/images/book-placeholder.png")} style={styles.bookImage} resizeMode="cover" />
                )}
              </TouchableOpacity>
              <View style={styles.itemDetails}>
                <Text style={styles.authorText}>{item.bookId.authorId?.displayName || 'Unknown Author'}</Text>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.bookId.title}</Text>
                <Text style={styles.price}>₦{item.bookId.price?.toLocaleString()}</Text>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFromCart(item.bookId._id)}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.checkoutContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>₦{getTotalPrice().toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({cartItems.length})</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
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
    color: "#E85D54",
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
    backgroundColor: "#FFE8E6",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  bookImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  authorText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E85D54",
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#E85D54",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  checkoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E85D54",
  },
  checkoutButton: {
    backgroundColor: "#E85D54",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});