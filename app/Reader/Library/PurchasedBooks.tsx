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
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadPurchasedBooks();
  }, []);

  const loadDownloadCounts = async (purchases: any[]) => {
    const readerData = await AsyncStorage.getItem('readerData');
    if (!readerData) return;
    const reader = JSON.parse(readerData);
    const readerId = reader._id || reader.id || reader.readerId;
    const existingDownloads = await AsyncStorage.getItem('downloadedBooks');
    const downloadedBooks = existingDownloads ? JSON.parse(existingDownloads) : [];
    const counts: Record<string, number> = {};
    purchases.forEach((p: any) => {
      const bookId = p.book?._id;
      if (bookId) {
        counts[bookId] = downloadedBooks.filter((b: any) => b.bookId === bookId && b.readerId === readerId).length;
      }
    });
    setDownloadCounts(counts);
  };

  const loadPurchasedBooks = async () => {
    try {
      const data = await readerBooks.getMyPurchases();
      const purchases = data.purchases || [];
      setBooks(purchases);
      await loadDownloadCounts(purchases);
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

      const readerData = await AsyncStorage.getItem('readerData');
      if (!readerData) {
        Alert.alert('Error', 'Please login again to download books');
        setDownloading(null);
        return;
      }

      const reader = JSON.parse(readerData);
      const readerId = reader._id || reader.id || reader.readerId;
      if (!readerId) {
        Alert.alert('Error', 'Unable to identify user. Please logout and login again.');
        setDownloading(null);
        return;
      }

      // Check download count limit (max 2)
      const existingDownloads = await AsyncStorage.getItem('downloadedBooks');
      const downloadedBooks = existingDownloads ? JSON.parse(existingDownloads) : [];
      const bookDownloads = downloadedBooks.filter((b: any) => b.bookId === bookId && b.readerId === readerId);

      if (bookDownloads.length >= 2) {
        Alert.alert(
          'Download Limit Reached',
          'You have already downloaded this book twice. You can only read it on your iShelf account now.'
        );
        setDownloading(null);
        return;
      }

      const token = await AsyncStorage.getItem('readerToken');
      const downloadUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/readers/books/download/${bookId}`;

      if (Platform.OS === 'web') {
        // Fetch as blob to preserve server-set filename
        const response = await fetch(`${downloadUrl}?token=${encodeURIComponent(token || '')}`);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        // Use stored extension from DB, fall back to last segment of URL, default pdf
        const rawUrl = book.pdfFile || '';
        const lastSegment = rawUrl.split('?')[0].split('/').pop() || '';
        const dotIndex = lastSegment.lastIndexOf('.');
        const ext = book.pdfFileExt || (dotIndex !== -1 ? lastSegment.substring(dotIndex + 1).toLowerCase() : 'pdf');
        const safeTitle = (bookTitle || 'book').replace(/[^a-zA-Z0-9 _-]/g, '').trim();
        const filename = `${safeTitle}.${ext}`;

        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

        // Save to downloaded books list
        const downloadedBook = {
          bookId,
          readerId,
          title: bookTitle,
          author: book?.authorId?.displayName || book?.authorId?.fullName || 'Unknown Author',
          coverImage: book?.coverImage,
          localPath: null,
          downloadedAt: new Date().toISOString(),
          fileSize: 'Unknown'
        };
        downloadedBooks.push(downloadedBook);
        await AsyncStorage.setItem('downloadedBooks', JSON.stringify(downloadedBooks));

        Alert.alert('Success', 'Book downloaded successfully!');
        setDownloading(null);
        return;
      }

      // Mobile: use FileSystem
      const rawUrl = book.pdfFile || '';
      const lastSegment = rawUrl.split('?')[0].split('/').pop() || '';
      const dotIndex = lastSegment.lastIndexOf('.');
      const ext = book.pdfFileExt || (dotIndex !== -1 ? lastSegment.substring(dotIndex + 1).toLowerCase() : 'pdf');
      const safeTitle = (bookTitle || 'book').replace(/[^a-zA-Z0-9 _-]/g, '').trim();

      const downloadResult = await FileSystem.downloadAsync(
        `${downloadUrl}?token=${encodeURIComponent(token || '')}`,
        FileSystem.documentDirectory + `${safeTitle}.${ext}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (downloadResult.status === 200) {
        const downloadedBook = {
          bookId,
          readerId,
          title: bookTitle,
          author: book?.authorId?.displayName || book?.authorId?.fullName || 'Unknown Author',
          coverImage: book?.coverImage,
          localPath: downloadResult.uri,
          downloadedAt: new Date().toISOString(),
          fileSize: downloadResult.headers?.['content-length'] || 'Unknown'
        };
        downloadedBooks.push(downloadedBook);
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
    // Removed delete functionality
  };

  const renderDownloadContent = (purchase: any) => {
    const bookId = purchase.book?._id;
    const used = downloadCounts[bookId] || 0;
    const remaining = 2 - used;
    if (downloading === bookId) {
      return <ActivityIndicator size="small" color="#E85D55" />;
    }
    if (remaining <= 0) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="lock-closed-outline" size={16} color="#999" />
          <Text style={[styles.downloadButtonText, { color: '#999' }]}>No downloads left</Text>
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="download-outline" size={16} color="#E85D55" />
        <Text style={styles.downloadButtonText}>Download ({remaining} left)</Text>
      </View>
    );
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
                <TouchableOpacity
                  style={[styles.downloadButton, (downloading === purchase.book?._id || (downloadCounts[purchase.book?._id] || 0) >= 2) && styles.downloadingButton]}
                  onPress={() => handleDownload(purchase.book?._id, purchase.book?.title, purchase.book)}
                  disabled={downloading === purchase.book?._id || (downloadCounts[purchase.book?._id] || 0) >= 2}
                >
                  {renderDownloadContent(purchase)}
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
        <View style={styles.viewToggle}>
          <TouchableOpacity onPress={() => setViewMode("list")} style={viewMode === "list" && styles.activeView}>
            <Ionicons name="list" size={24} color={viewMode === "list" ? "#E85D55" : "#999"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode("grid")} style={viewMode === "grid" && styles.activeView}>
            <Ionicons name="grid" size={24} color={viewMode === "grid" ? "#E85D55" : "#999"} />
          </TouchableOpacity>
        </View>
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
  downloadButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
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