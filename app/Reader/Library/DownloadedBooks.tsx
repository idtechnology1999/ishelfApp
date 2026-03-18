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
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { readerBooks } from "../../readerAPI";

export default function DownloadedBooks() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDownloadedBooks();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDownloadedBooks();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDownloadedBooks();
    setRefreshing(false);
  };

  // Debug function to check AsyncStorage
  const debugStorage = async () => {
    try {
      const readerData = await AsyncStorage.getItem('readerData');
      const downloadedBooksData = await AsyncStorage.getItem('downloadedBooks');
      
      console.log('=== DEBUG INFO ===');
      console.log('Reader Data:', readerData);
      console.log('Downloaded Books:', downloadedBooksData);
      
      if (readerData) {
        const reader = JSON.parse(readerData);
        console.log('Reader ID:', reader._id);
      }
      
      if (downloadedBooksData) {
        const books = JSON.parse(downloadedBooksData);
        console.log('Total books in storage:', books.length);
        books.forEach((book: any, index: number) => {
          console.log(`Book ${index + 1}:`, {
            title: book.title,
            bookId: book.bookId,
            readerId: book.readerId
          });
        });
      }
      
      Alert.alert('Debug Info', 'Check browser console (F12) for details');
    } catch (error) {
      console.error('Debug error:', error);
      Alert.alert('Error', 'Failed to read storage');
    }
  };

  const loadDownloadedBooks = async () => {
    try {
      // Get current reader ID
      const readerData = await AsyncStorage.getItem('readerData');
      console.log('Raw readerData:', readerData);
      
      if (!readerData) {
        console.log('No readerData in storage');
        setBooks([]);
        setLoading(false);
        return;
      }
      
      const reader = JSON.parse(readerData);
      console.log('Parsed reader object:', reader);
      console.log('Reader keys:', Object.keys(reader));
      
      // Try different possible ID fields
      const readerId = reader._id || reader.id || reader.readerId;
      console.log('Current readerId:', readerId);
      
      if (!readerId) {
        console.log('No reader ID found, showing empty');
        setBooks([]);
        setLoading(false);
        return;
      }
      
      // Get downloaded books from AsyncStorage
      const downloadedBooksData = await AsyncStorage.getItem('downloadedBooks');
      console.log('Downloaded books data:', downloadedBooksData);
      
      if (downloadedBooksData) {
        const allDownloadedBooks = JSON.parse(downloadedBooksData);
        console.log('All downloaded books:', allDownloadedBooks);
        
        // Filter books ONLY for current user (strict match)
        const userBooks = allDownloadedBooks.filter((book: any) => 
          book.readerId === readerId
        );
        
        console.log('User books after filter:', userBooks);
        
        // Verify files still exist and get book details
        const validBooks = [];
        for (const book of userBooks) {
          if (Platform.OS !== 'web') {
            // For mobile, check if file exists
            if (book.localPath) {
              const fileInfo = await FileSystem.getInfoAsync(book.localPath);
              if (fileInfo.exists) {
                validBooks.push(book);
              }
            }
          } else {
            // For web, just add all books (web doesn't have persistent file storage)
            validBooks.push(book);
          }
        }
        
        // Sort by most recently downloaded first
        validBooks.sort((a: any, b: any) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime());
        setBooks(validBooks);
        
        // Update AsyncStorage with valid books only (keep all users' books)
        if (validBooks.length !== userBooks.length) {
          const otherUsersBooks = allDownloadedBooks.filter((book: any) => book.readerId !== readerId);
          const updatedBooks = [...otherUsersBooks, ...validBooks];
          await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
        }
      } else {
        console.log('No downloaded books in storage');
        setBooks([]);
      }
    } catch (error) {
      console.error('Failed to load downloaded books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadNow = (book: any) => {
    router.push(`/Reader/Library/BookReader?bookId=${book.bookId}`);
  };

  const handleDelete = async (book: any) => {
    Alert.alert(
      'Delete Downloaded Book',
      `Are you sure you want to delete "${book.title}" from your device?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get current reader ID
              const readerData = await AsyncStorage.getItem('readerData');
              const readerId = readerData ? JSON.parse(readerData)._id : null;
              
              // Remove from local storage
              const downloadedBooksData = await AsyncStorage.getItem('downloadedBooks');
              if (downloadedBooksData) {
                const downloadedBooks = JSON.parse(downloadedBooksData);
                const updatedBooks = downloadedBooks.filter((b: any) => 
                  !(b.bookId === book.bookId && b.readerId === readerId)
                );
                await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
              }
              
              // Delete local file if exists
              if (Platform.OS !== 'web' && book.localPath) {
                try {
                  await FileSystem.deleteAsync(book.localPath);
                } catch (fileError) {
                  console.error('Error deleting file:', fileError);
                }
              }
              
              // Update UI
              setBooks(books.filter((b: any) => b.bookId !== book.bookId));
              
            } catch (error) {
              console.error('Error deleting book:', error);
              Alert.alert('Error', 'Failed to delete book');
            }
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
        <Text style={styles.headerTitle}>Downloaded Books</Text>
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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E85D54']}
            tintColor="#E85D54"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E85D54" />
          </View>
        ) : books.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="download-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Downloaded Books</Text>
            <Text style={styles.emptyText}>Books you download will appear here for offline reading</Text>
            <TouchableOpacity 
              style={styles.browseButton} 
              onPress={() => router.push('/Reader/Library/PurchasedBooks')}
            >
              <Text style={styles.browseButtonText}>View Purchased Books</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.booksContainer}>
            {books.map((book: any) => (
              <View key={book.bookId} style={styles.bookCard}>
                <Image
                  source={{ 
                    uri: book.coverImage?.startsWith('http') 
                      ? book.coverImage 
                      : book.coverImage?.startsWith('/') 
                        ? `${process.env.EXPO_PUBLIC_API_URL}${book.coverImage}` 
                        : `${process.env.EXPO_PUBLIC_API_URL}/${book.coverImage}` 
                  }}
                  style={styles.bookImage}
                  resizeMode="cover"
                  defaultSource={require("../../../assets/images/book-placeholder.png")}
                />
                <View style={styles.bookDetails}>
                  <View style={styles.bookInfo}>
                    <Text style={styles.authorText}>{book.author || 'Unknown Author'}</Text>
                    <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">{book.title || 'Untitled'}</Text>
                    <View style={styles.downloadInfo}>
                      <Ionicons name="download" size={16} color="#22c55e" />
                      <Text style={styles.downloadedText}>Downloaded</Text>
                      <Text style={styles.downloadDate}>
                        {new Date(book.downloadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.readerAvatars}>
                      <View style={[styles.avatar, { backgroundColor: '#E85D55' }]}>
                        <Ionicons name="person" size={12} color="#FFFFFF" />
                      </View>
                      <View style={[styles.avatar, { backgroundColor: '#4CAF50', marginLeft: -8 }]}>
                        <Ionicons name="person" size={12} color="#FFFFFF" />
                      </View>
                      <View style={[styles.avatar, { backgroundColor: '#2196F3', marginLeft: -8 }]}>
                        <Ionicons name="person" size={12} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(book)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.bookActions}>
                  <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => handleReadNow(book)}
                  >
                    <Text style={styles.readButtonText}>Read Now</Text>
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
    overflow: "hidden",
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    flexShrink: 0,
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
    fontSize: 14,
    fontWeight: "700",
    color: "#2C2C2C",
    lineHeight: 20,
    marginBottom: 8,
  },
  downloadInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  downloadedText: {
    fontSize: 12,
    color: "#22c55e",
    fontWeight: "600",
  },
  downloadDate: {
    fontSize: 12,
    color: "#999",
  },
  readerAvatars: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  bookActions: {
    position: "absolute",
    bottom: 12,
    right: 12,
    left: 124,
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
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#E85D55',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});