import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GestureRecognizer from "react-native-swipe-gestures";

export default function Home() {
  const router = useRouter();

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const handleAddToCart = () => {
    router.push("Reader/courses/PreviewAddToCart");
  };

  const books = [
    { id: 1, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 2, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 3, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 4, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
  ];

  return (
    <GestureRecognizer style={{ flex: 1 }} config={swipeConfig}>
      <SafeAreaView style={styles.container}>
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="book" size={24} color="#0A3D91" />
              <Text style={styles.logo}>I-Shelf</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="cart-outline" size={24} color="#0A3D91" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#0A3D91"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by course/author/Title ISBN"
              placeholderTextColor="#999"
            />
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>Recommendation</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          {/* Books List */}
          <View style={styles.booksContainer}>
            {books.map((book) => (
              <View key={book.id} style={styles.bookCard}>
                <Image
                  source={require("../../../assets/images/book-placeholder.png")}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.authorText}>{book.author}</Text>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <View style={styles.priceContainer}>
                    <View>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.price}>{book.price}</Text>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Ionicons name="heart-outline" size={20} color="#0A3D91" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                  >
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D91",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
  },
  scrollContent: {
    flex: 1,
  },
  booksContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  authorText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D91",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0A3D91",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  addToCartButton: {
    backgroundColor: "#0A3D91",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});