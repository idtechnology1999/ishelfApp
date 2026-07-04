import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import BookCover from "../../../components/BookCover";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import { authorAPI } from "../../authorAPI";

export default function MyWorksTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const handleDeleteDraft = (book: any) => {
    Alert.alert(
      'Delete Draft',
      `Are you sure you want to delete "${book.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await authorAPI.deleteBook(book._id);
              setBooks(prev => prev.filter(b => b._id !== book._id));
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeLeft={() => router.push("/Author/(AuthorTabs)/earning")}
      onSwipeRight={() => router.push("/Author/(AuthorTabs)/")}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E85D54']} tintColor="#E85D54" />}>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Uploaded Books</Text>
            <TouchableOpacity
              style={styles.historyChip}
              onPress={() => router.push("/Author/book/TransactionHistory")}
            >
              <Ionicons name="receipt-outline" size={14} color="#E85D54" />
              <Text style={styles.historyChipText}>Transaction History</Text>
            </TouchableOpacity>
          </View>
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
                    <BookCover uri={book.coverImage} style={styles.bookThumbnail} />
                  </TouchableOpacity>

                  {/* Status Badge */}
                  {book.status === 'approved' ? (
                    <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
                      <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                      <Text style={[styles.statusText, { color: '#16a34a' }]}>Approved — Live</Text>
                    </View>
                  ) : book.status === 'pending' ? (
                    <View style={[styles.statusBadge, { backgroundColor: '#fef9c3' }]}>
                      <Ionicons name="time-outline" size={12} color="#ca8a04" />
                      <Text style={[styles.statusText, { color: '#ca8a04' }]}>Pending Review</Text>
                    </View>
                  ) : book.status === 'rejected' ? (
                    <View style={[styles.statusBadge, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="close-circle" size={12} color="#dc2626" />
                      <Text style={[styles.statusText, { color: '#dc2626' }]}>Rejected</Text>
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, { backgroundColor: '#f1f5f9' }]}>
                      <Ionicons name="ellipsis-horizontal" size={12} color="#64748b" />
                      <Text style={[styles.statusText, { color: '#64748b' }]}>Draft</Text>
                    </View>
                  )}

                  <Text style={styles.bookAuthor}>{book.coAuthors || 'Author'}</Text>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <View style={styles.salesRow}>
                    <View style={styles.salesBadge}>
                      <Ionicons name="people" size={14} color="#4CAF50" />
                      <Text style={styles.salesText}>{book.salesCount || 0} {book.salesCount === 1 ? 'buyer' : 'buyers'}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.salesButton}
                      onPress={() => router.push(`/Author/book/TransactionHistory?bookId=${book._id}&bookTitle=${encodeURIComponent(book.title)}`)}
                    >
                      <Ionicons name="receipt-outline" size={14} color="#E85D54" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bookFooter}>
                    <View>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.priceValue}>₦{book.price || 0}</Text>
                    </View>
                    <View style={styles.bookActions}>
                      {(!book.status || book.status === 'draft') && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteDraft(book)}
                        >
                          <Ionicons name="trash-outline" size={15} color="#dc2626" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push(`/Author/book/edit?id=${book._id}`)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  historyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFF5F4",
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  historyChipText: {
    fontSize: 12,
    color: "#E85D54",
    fontWeight: "600",
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

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
    marginTop: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },

  salesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  salesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
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

  bookActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fca5a5",
    backgroundColor: "#fff1f1",
    alignItems: "center",
    justifyContent: "center",
  },

  salesButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    backgroundColor: "#FFF5F4",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#E85D54",
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