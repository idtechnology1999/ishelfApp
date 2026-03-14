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
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { readerBooks } from "../../readerAPI";

export default function PurchasedBooks() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

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

  const handleDownload = async (bookId: string, bookTitle: string, book: any) => {
    try {
      setDownloading(bookId);
      
      // For web platform, open download link
      if (Platform.OS === 'web') {
        const token = await AsyncStorage.getItem('readerToken');
        const downloadUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/readers/books/download/${bookId}`;
        
        // Create a form to submit with authorization header
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = downloadUrl;
        form.target = '_blank';
        
        // Add token as a query parameter for web downloads
        const urlWithToken = `${downloadUrl}?token=${encodeURIComponent(token || '')}`;
        
        // Open in new window
        window.open(urlWithToken, '_blank');
        
        // Add to downloaded list for web
        const downloadedBook = {
          bookId,
          title: bookTitle,
          author: book.authorId?.displayName || 'Unknown Author',
          coverImage: book.coverImage,
          localPath: null,
          downloadedAt: new Date().toISOString(),
          fileSize: 'Unknown'
        };
        
        const existingDownloads = await AsyncStorage.getItem('downloadedBooks');
        const downloadedBooks = existingDownloads ? JSON.parse(existingDownloads) : [];
        
        const existingIndex = downloadedBooks.findIndex((b: any) => b.bookId === bookId);
        if (existingIndex >= 0) {
          downloadedBooks[existingIndex] = downloadedBook;
        } else {
          downloadedBooks.push(downloadedBook);
        }
        
        await AsyncStorage.setItem('downloadedBooks', JSON.stringify(downloadedBooks));
        Alert.alert('Success', 'Download started in new tab');
        return;
      }
      
      // For mobile platforms, use FileSystem
      const token = await AsyncStorage.getItem('readerToken');
      const downloadUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/readers/books/download/${bookId}`;
      
      const downloadResult = await FileSystem.downloadAsync(
        downloadUrl,
        FileSystem.documentDirectory + `${bookTitle}.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (downloadResult.status === 200) {
        const downloadedBook = {
          bookId,
          title: bookTitle,
          author: book.authorId?.displayName || 'Unknown Author',
          coverImage: book.coverImage,
          localPath: downloadResult.uri,
          downloadedAt: new Date().toISOString(),
          fileSize: downloadResult.headers?.['content-length'] || 'Unknown'
        };
        
        const existingDownloads = await AsyncStorage.getItem('downloadedBooks');
        const downloadedBooks = existingDownloads ? JSON.parse(existingDownloads) : [];
        
        const existingIndex = downloadedBooks.findIndex((b: any) => b.bookId === bookId);
        if (existingIndex >= 0) {
          downloadedBooks[existingIndex] = downloadedBook;
        } else {
          downloadedBooks.push(downloadedBook);
        }
        
        await AsyncStorage.setItem('downloadedBooks', JSON.stringify(downloadedBooks));
        
        Alert.alert('Success', 'Book downloaded successfully!', [
          {
            text: 'Open',
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(downloadResult.uri);
              }
            }
          },
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('Error', 'Failed to download book');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert('Error', `Failed to download book: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = (purchaseId: string) => {
    Alert.alert(
      'Remove Book',
      'Are you sure you want to remove this book from your library?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setBooks(books.filter((book: any) => book._id !== purchaseId));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D55" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchased Books</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            style={viewMode === "list" && styles.activeView}
          >
            <Ionicons
              name="list"
              size={24}
              color={viewMode === "list" ? "#E85D55" : "#999"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("grid")}
            style={viewMode === "grid" && styles.activeView}
          >
            <Ionicons
              name="grid"
              size={24}
              color={viewMode === "grid" ? "#E85D55" : "#999"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E85D54" />
          </View>
        ) : books.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No purchased books yet</Text>
          </View>
        ) : (
          <View style={styles.booksContainer}>
            {books.map((purchase: any) => (
              <View key={purchase._id} style={styles.bookCard}>
                {purchase.book?.coverImage ? (
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${purchase.book.coverImage}` }}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/book-placeholder.png")}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.bookDetails}>
                  <View style={styles.bookInfo}>
                    <Text style={styles.authorText}>{purchase.author?.displayName || 'Unknown Author'}</Text>
                    <Text style={styles.bookTitle}>{purchase.book?.title || 'Untitled'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(purchase._id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.bookActions}>
                  <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => handleReadNow(purchase.book?._id)}
                  >
                    <Text style={styles.readButtonText}>Read Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.downloadButton,
                      downloading === purchase.book?._id && styles.downloadingButton
                    ]}
                    onPress={() => handleDownload(purchase.book?._id, purchase.book?.title, purchase.book)}
                    disabled={downloading === purchase.book?._id}
                  >
                    {downloading === purchase.book?._id ? (
                      <ActivityIndicator size="small" color="#E85D55" />
                    ) : (
                      <Text style={styles.downloadButtonText}>Download</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
  viewToggle: {
    flexDirection: "row",
    gap: 12,
  },
  activeView: {
    backgroundColor: "#FFF5F4",
    borderRadius: 8,
    padding: 4,
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
  },
  bookImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  bookDetails: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
    lineHeight: 24,
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  bookActions: {
    position: "absolute",
    bottom: 12,
    right: 12,
    left: 144,
    gap: 8,
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
  downloadButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E85D55",
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E85D55",
  },
  downloadingButton: {
    opacity: 0.6,
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