import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readerBooks, readerCart } from "../../readerAPI";

export default function PreviewAddToCart() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const [paymentAccount, setPaymentAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    loadBookDetails();
  }, []);

  const loadBookDetails = async () => {
    try {
      const bookId = params.bookId as string;
      if (!bookId) {
        Alert.alert("Error", "Book not found");
        router.back();
        return;
      }
      const data = await readerBooks.getBookDetails(bookId);
      setBook(data.book);
      setPaymentAccount(data.paymentAccount);
    } catch (error) {
      console.error('Failed to load book:', error);
      Alert.alert("Error", "Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!book || !book._id) {
      Alert.alert('Error', 'Book information not available');
      return;
    }

    try {
      const result = await readerCart.addToCart(book._id);
      setIsInCart(true);
      Alert.alert('Success', 'Book added to cart!', [
        { text: 'Continue Shopping', onPress: () => router.back() },
        { text: 'View Cart', onPress: () => router.push('/Reader/(ReaderTabs)/cart') }
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to cart';
      
      if (errorMessage.includes('already purchased')) {
        setIsPurchased(true);
        Alert.alert('Already Purchased', 'You have already purchased this book. Check your library.', [
          { text: 'OK' },
          { text: 'Go to Library', onPress: () => router.push('/Reader/(ReaderTabs)/library') }
        ]);
      } else if (errorMessage.includes('already in your cart')) {
        setIsInCart(true);
        Alert.alert('Already in Cart', 'This book is already in your cart.', [
          { text: 'OK' },
          { text: 'View Cart', onPress: () => router.push('/Reader/(ReaderTabs)/cart') }
        ]);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const handleMakePayment = () => {
    if (!book || !book._id) {
      Alert.alert('Error', 'Book information not available');
      return;
    }

    console.log('Navigating to payment for book:', book._id);
    router.push(`/Reader/courses/MakePayment?bookId=${book._id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D55" />
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Book not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D55" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{book.title}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#E85D55" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="#E85D55" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Book Image */}
        <View style={styles.imageContainer}>
          {book.coverImage ? (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${book.coverImage}` }}
              style={styles.bookImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../../../assets/images/book-placeholder.png")}
              style={styles.bookImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Author */}
          <Text style={styles.authorText}>{book.authorId?.displayName || 'Unknown Author'}</Text>

          {/* Title */}
          <Text style={styles.bookTitle}>{book.title}</Text>

          {/* Description */}
          {book.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{book.description}</Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>₦{book.price?.toLocaleString()}</Text>
          </View>

          {/* Payment Account */}
          {paymentAccount && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Account</Text>
              <View style={styles.paymentCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bank: </Text>
                  <Text style={styles.detailValue}>{paymentAccount.bankName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Number: </Text>
                  <Text style={styles.detailValue}>{paymentAccount.accountNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Name: </Text>
                  <Text style={styles.detailValue}>{paymentAccount.accountName}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Book Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Format: </Text>
                <Text style={styles.detailValue}>PDF</Text>
              </View>
              {book.pageCount && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pages: </Text>
                  <Text style={styles.detailValue}>{book.pageCount}</Text>
                </View>
              )}
              {book.publicationYear && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Published: </Text>
                  <Text style={styles.detailValue}>{book.publicationYear}</Text>
                </View>
              )}
              {book.category && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category: </Text>
                  <Text style={styles.detailValue}>{book.category}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Add to Cart and Make Payment Buttons */}
          <View style={styles.buttonContainer}>
            {isPurchased ? (
              <TouchableOpacity 
                style={styles.purchasedButton}
                onPress={() => router.push('/Reader/(ReaderTabs)/library')}
              >
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.purchasedText}>Already Purchased</Text>
              </TouchableOpacity>
            ) : isInCart ? (
              <TouchableOpacity 
                style={styles.inCartButton}
                onPress={() => router.push('/Reader/(ReaderTabs)/cart')}
              >
                <Ionicons name="checkmark-circle" size={20} color="#E85D55" />
                <Text style={styles.inCartText}>In Cart</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addToCartButton} 
                onPress={handleAddToCart}
              >
                <Ionicons name="cart-outline" size={20} color="#E85D55" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.buyNowButton, isPurchased && styles.buttonDisabled]} 
              onPress={handleMakePayment}
              disabled={isPurchased}
            >
              <Text style={styles.buyNowText}>{isPurchased ? 'Purchased' : 'Buy Now'}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#E85D55",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF5F4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE5E3",
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
  },
  bookImage: {
    width: 180,
    height: 260,
  },
  contentContainer: {
    backgroundColor: "#FFF5F4",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  authorText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 20,
    lineHeight: 28,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  priceSection: {
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E85D55",
  },
  detailsContainer: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E85D55",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E85D55",
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#E85D55",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D55",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  purchasedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    borderWidth: 2,
    borderColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  purchasedText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22c55e",
  },
  inCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff5f4",
    borderWidth: 2,
    borderColor: "#E85D55",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  inCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E85D55",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  paymentCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
});