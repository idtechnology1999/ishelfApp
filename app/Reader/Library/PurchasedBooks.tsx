import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { readerBooks } from "../../readerAPI";

export default function PurchasedBooks() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchasedBooks();
  }, []);

  const loadPurchasedBooks = async () => {
    try {
      const data = await readerBooks.getMyPurchases();
      setBooks(data.purchases || []);
    } catch (error) {
      console.error('Failed to load purchased books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadNow = (bookId: string) => {
    router.push(`/Reader/Library/BookReader?bookId=${bookId}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      );
    }
    if (books.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No purchased books yet</Text>
        </View>
      );
    }
    return (
      <View style={styles.booksContainer}>
        {books.filter((purchase: any) => purchase.book).map((purchase: any) => (
          <View key={purchase._id} style={styles.bookCard}>
            <Image
              source={{
                uri: purchase.book?.coverImage?.startsWith('http')
                  ? purchase.book.coverImage
                  : purchase.book?.coverImage?.startsWith('/')
                    ? `${process.env.EXPO_PUBLIC_API_URL}${purchase.book.coverImage}`
                    : `${process.env.EXPO_PUBLIC_API_URL}/${purchase.book.coverImage}`
              }}
              style={styles.bookImage}
              resizeMode="cover"
              defaultSource={require("../../../assets/images/book-placeholder.png")}
            />
            <View style={styles.bookContent}>
              <View style={styles.bookInfo}>
                <Text style={styles.authorText}>{purchase.book?.authorId?.displayName || purchase.book?.authorId?.fullName || 'Unknown Author'}</Text>
                <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">{purchase.book?.title || 'Untitled'}</Text>
                <View style={styles.purchaseInfo}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={styles.purchasedText}>Purchased</Text>
                  <Text style={styles.purchaseDate}>{new Date(purchase.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              <View style={styles.bookActions}>
                <TouchableOpacity style={styles.readButton} onPress={() => handleReadNow(purchase.book?._id)}>
                  <Text style={styles.readButtonText}>Read Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D55" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchased Books</Text>
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
    color: "#E85D55",
    flex: 1,
    textAlign: "center",
  },
  booksContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#FFF5F4",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FFE5E3",
    overflow: "hidden",
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    flexShrink: 0,
  },
  bookContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  bookInfo: {
    flex: 1,
  },
  authorText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C2C2C",
    lineHeight: 20,
    marginBottom: 8,
  },
  purchaseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  purchasedText: {
    fontSize: 12,
    color: "#22c55e",
    fontWeight: "600",
  },
  purchaseDate: {
    fontSize: 12,
    color: "#999",
  },
  bookActions: {
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  readButton: {
    backgroundColor: "#E85D55",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#E85D55",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});