import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { readerBooks } from '../../readerAPI';

export default function BookReader() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [webLoading, setWebLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookContent();
  }, []);

  const loadBookContent = async () => {
    try {
      const bookId = params.bookId as string;
      if (!bookId) {
        setError('Book ID not provided');
        return;
      }

      const data = await readerBooks.getBookContent(bookId);
      const token = await AsyncStorage.getItem('readerToken');

      const streamUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/readers/books/stream/${bookId}?token=${encodeURIComponent(token || '')}`;

      setBook({
        ...data.book,
        pdfUrl: streamUrl,
      });
    } catch (error: any) {
      console.error('Failed to load book:', error);
      setError(error.response?.data?.message || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
          <Text style={styles.loadingText}>Loading book...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Reader</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
          <Text style={styles.errorText}>{error || 'Book not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBookContent}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D54" />
        </TouchableOpacity>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Info', `Pages: ${book.pageCount || 'Unknown'}`)}>
          <Ionicons name="information-circle-outline" size={28} color="#E85D54" />
        </TouchableOpacity>
      </View>

      {/* PDF Viewer — in-app only, no external browser */}
      <View style={styles.pdfContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={book.pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={book.title}
          />
        ) : (
          <>
            {webLoading && (
              <View style={styles.webLoadingOverlay}>
                <ActivityIndicator size="large" color="#E85D54" />
                <Text style={styles.loadingText}>Opening book...</Text>
              </View>
            )}
            <WebView
              source={{ uri: book.pdfUrl }}
              style={[styles.webview, webLoading && { opacity: 0 }]}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
              allowsInlineMediaPlayback
              onLoadStart={() => setWebLoading(true)}
              onLoadEnd={() => setWebLoading(false)}
              onError={() => {
                setWebLoading(false);
                setError('Failed to load the book. Please try again.');
              }}
              onShouldStartLoadWithRequest={(request) => {
                // Block any navigation away from our stream endpoint
                const allowedHosts = [
                  'api.i-shelf.app',
                  'localhost',
                  '127.0.0.1',
                ];
                try {
                  const host = new URL(request.url).hostname;
                  return allowedHosts.some(h => host.includes(h));
                } catch {
                  return false;
                }
              }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E85D54',
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E85D54',
    flex: 1,
    textAlign: 'center',
  },
  pdfContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#E85D54',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
