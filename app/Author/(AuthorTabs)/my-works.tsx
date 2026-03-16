import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import { authorAPI } from "../../authorAPI";

export default function MyWorksTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await authorAPI.getMyBooks();
      setBooks(response.books || []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const getImageSource = (coverImage: string) => {
    if (coverImage) {
      return { uri: `${process.env.EXPO_PUBLIC_API_URL}/${coverImage}` };
    }
    return require('../../../assets/images/book-placeholder.png');
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeLeft={() => router.push("/Author/(AuthorTabs)/earning")}
      onSwipeRight={() => router.push("/Author/(AuthorTabs)/")}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/Author/(AuthorTabs)/")}
            >
              <Ionicons name="chevron-back" size={28} color="#E85D54" />
            </TouchableOpacity>
            <Text style={styles.title}>My Works</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by course/author/Title ISBN"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          {/* Upload Your Book Section */}
          <Text style={styles.sectionTitle}>Upload Your Book</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => router.push("/Author/book/Upload1")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>

          {/* Uploaded Books Section */}
          <Text style={styles.sectionTitle}>Uploaded Books</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E85D54" />
            </View>
          ) : books.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No books uploaded yet</Text>
            </View>
          ) : (
            <View style={styles.booksGrid}>
              {books.map((book) => (
                <View key={book._id} style={styles.bookCard}>
                  <TouchableOpacity onPress={() => router.push(`/Author/book/detail?id=${book._id}`)}>
                    <View style={styles.bookThumbnail}>
                      <Image
                        source={getImageSource(book.coverImage)}
                        style={styles.bookImage}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.bookAuthor}>{book.coAuthors || 'Author'}</Text>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <View style={styles.salesBadge}>
                    <Ionicons name="people" size={14} color="#4CAF50" />
                    <Text style={styles.salesText}>{book.salesCount || 0} {book.salesCount === 1 ? 'buyer' : 'buyers'}</Text>
                  </View>
                  <View style={styles.bookFooter}>
                    <View>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.priceValue}>₦{book.price || 0}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => router.push(`/Author/book/edit?id=${book._id}`)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  backButton: {
    padding: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E85D54", // I-SHELF coral red
    marginHorizontal: 24,
    marginBottom: 32,
    height: 56,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  uploadButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },

  bookCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
  },

  bookThumbnail: {
    width: "100%",
    aspectRatio: 0.65,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
    overflow: "hidden",
  },

  bookImage: {
    width: "100%",
    height: "100%",
  },

  bookAuthor: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    minHeight: 36,
  },

  salesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  salesText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
  },

  bookFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  priceLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },

  priceValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },

  editButton: {
    backgroundColor: "#E85D54", // I-SHELF coral red
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },

  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});