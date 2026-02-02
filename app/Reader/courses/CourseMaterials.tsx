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

export default function CourseMaterials() {
  const router = useRouter();

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const books = [
    { id: 1, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 2, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 3, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 4, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 5, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
    { id: 6, author: "Dr Ade-Ajayi", title: "Abstract Color Poster", price: "N1500" },
  ];

  const handleAddToCart = () => {
    router.push("Reader/courses/PreviewAddToCart");
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeRight={() => router.back()}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#E85D55" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Textbooks and Course Materials</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by course/author/Title ISBN"
              placeholderTextColor="#999"
            />
          </View>

          {/* Books Grid */}
          <View style={styles.booksGrid}>
            {books.map((book) => (
              <View key={book.id} style={styles.bookCard}>
                <Image
                  source={require("../../../assets/images/book-placeholder.png")}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.authorText}>{book.author}</Text>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.price}>{book.price}</Text>
                  </View>
                  <View style={styles.bookActions}>
                    <TouchableOpacity
                      style={styles.addToCartButton}
                      onPress={handleAddToCart}
                    >
                      <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Ionicons name="heart-outline" size={20} color="#E85D55" />
                    </TouchableOpacity>
                  </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E85D55",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F4",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFE5E3",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  bookCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#E85D55",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#FFE5E3",
  },
  bookImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bookInfo: {
    padding: 12,
  },
  authorText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E85D55",
  },
  bookActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#E85D55",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E85D55",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});