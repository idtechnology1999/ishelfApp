import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";

export default function MyWorksTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const uploadedBooks = [
    {
      id: "1",
      title: "Abstract Color Poster",
      author: "Dr Ade-Ajayi",
      price: "₦1500",
      thumbnail: require('../../../assets/images/book-placeholder.png'),
    },
    {
      id: "2",
      title: "Abstract Color Poster",
      author: "Dr Ade-Ajayi",
      price: "₦1500",
      thumbnail: require('../../../assets/images/book-placeholder.png'),
    },
    {
      id: "3",
      title: "Abstract Color Poster",
      author: "Dr Ade-Ajayi",
      price: "₦1500",
      thumbnail: require('../../../assets/images/book-placeholder.png'),
    },
    {
      id: "4",
      title: "Abstract Color Poster",
      author: "Dr Ade-Ajayi",
      price: "₦1500",
      thumbnail: require('../../../assets/images/book-placeholder.png'),
    },
    {
      id: "5",
      title: "Abstract Color Poster",
      author: "Dr Ade-Ajayi",
      price: "₦1500",
      thumbnail: require('../../../assets/images/book-placeholder.png'),
    },
    {
      id: "6",
      title: "Abstract Color Poster",
      author: "Dr Ade-Ajayi",
      price: "₦1500",
      thumbnail: require('../../../assets/images/book-placeholder.png'),
    },
  ];

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
              <Ionicons name="chevron-back" size={28} color="#0A3D91" />
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
          <View style={styles.booksGrid}>
            {uploadedBooks.map((book) => (
              <View key={book.id} style={styles.bookCard}>
                <TouchableOpacity
                //   onPress={() => router.push(`/book/${book.id}`)}
                >
                  <View style={styles.bookThumbnail}>
                    <Image
                      source={book.thumbnail}
                      style={styles.bookImage}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </Text>
                <View style={styles.bookFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>{book.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/Author/book/detail`)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
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
    color: "#0A3D91",
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
    backgroundColor: "#0A3D91",
    marginHorizontal: 24,
    marginBottom: 32,
    height: 56,
    borderRadius: 12,
    gap: 8,
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
    borderColor: "#E5E5E5",
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
    backgroundColor: "#0A3D91",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});