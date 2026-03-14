import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function BookDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await authorAPI.getMyBooks();
      const foundBook = response.books.find((b: any) => b._id === id);
      setBook(foundBook);
    } catch (error) {
      Alert.alert("Error", "Failed to load book");
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Book not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{book.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Book Cover */}
        <View style={styles.bookCoverContainer}>
          <Image
            source={getImageSource(book.coverImage)}
            style={styles.bookCover}
            resizeMode="contain"
          />
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <Text style={styles.authorName}>{book.coAuthors || 'Author'}</Text>
          <Text style={styles.bookTitle}>{book.title}</Text>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {book.description || 'No description available'}
            </Text>
          </View>

          {/* Price Section */}
          <View style={styles.section}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceAmount}>₦{book.price || 0}</Text>
          </View>

          {/* Book Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pages: </Text>
              <Text style={styles.detailValue}>{book.pageCount || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Published: </Text>
              <Text style={styles.detailValue}>{book.publicationYear || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category: </Text>
              <Text style={styles.detailValue}>{book.category || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Language: </Text>
              <Text style={styles.detailValue}>{book.language || 'N/A'}</Text>
            </View>
          </View>

          {/* Edit Button */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/Author/book/edit?id=${book._id}`)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  bookCoverContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
  },

  bookCover: {
    width: 200,
    height: 280,
    borderRadius: 8,
  },

  contentCard: {
    backgroundColor: "#FFE8E6", // Light coral matching brand
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },

  authorName: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
  },

  bookTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 24,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },

  descriptionText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
  },

  priceLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },

  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  detailLabel: {
    fontSize: 14,
    color: "#000000",
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  editButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  editButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});