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
import { usePreventScreenCapture } from 'expo-screen-capture';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.i-shelf.app';

const getPdfViewerHtml = (pdfUrl: string) => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, minimum-scale=1.0, user-scalable=yes">
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<style>
* { margin:0; padding:0; box-sizing:border-box; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
body { background:#525659; overflow-x:hidden; }
#viewer { padding:8px; }
canvas { display:block; margin:0 auto 8px; background:white; box-shadow:0 2px 8px rgba(0,0,0,.35); max-width:100%; }
#loading { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; font-family:Arial,sans-serif; gap:16px; }
#error { display:none; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:#ff8080; font-family:Arial,sans-serif; text-align:center; padding:24px; gap:12px; }
.spinner { width:44px; height:44px; border:4px solid rgba(255,255,255,.25); border-top-color:white; border-radius:50%; animation:spin .85s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
</head>
<body>
<div id="loading"><div class="spinner"></div><p style="font-size:15px;opacity:.9">Opening book...</p></div>
<div id="viewer"></div>
<div id="error"><p style="font-size:16px;font-weight:bold">Could not load book</p><p style="font-size:13px;opacity:.8">Please go back and try again.</p></div>
<script>
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
(async function(){
  try {
    const pdf = await pdfjsLib.getDocument('${pdfUrl}').promise;
    document.getElementById('loading').style.display='none';
    const viewer = document.getElementById('viewer');
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = window.innerWidth - 16;
    for(let i=1;i<=pdf.numPages;i++){
      const page = await pdf.getPage(i);
      const base = page.getViewport({scale:1});
      const baseScale = cssWidth / base.width;
      const renderScale = baseScale * dpr;
      const vp = page.getViewport({scale:renderScale});
      const canvas = document.createElement('canvas');
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.style.width = cssWidth + 'px';
      canvas.style.height = (base.height * baseScale) + 'px';
      viewer.appendChild(canvas);
      await page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;
    }
  } catch(e) {
    document.getElementById('loading').style.display='none';
    document.getElementById('error').style.display='flex';
    console.error('PDF error:',e);
  }
})();
</script>
</body>
</html>`;

export default function BookReader() {
  usePreventScreenCapture();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookContent();
  }, []);

  const loadBookContent = async () => {
    try {
      const bookId = params.bookId as string;
      if (!bookId) { setError('Book ID not provided'); return; }

      const data = await readerBooks.getBookContent(bookId);
      const token = await AsyncStorage.getItem('readerToken');

      const streamUrl = `${API_URL}/api/readers/books/stream/${bookId}?token=${encodeURIComponent(token || '')}`;

      setBook({ ...data.book, pdfUrl: streamUrl });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
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
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
          <Text style={styles.errorText}>{error || 'Book not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBookContent}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.pdfContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={book.pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={book.title}
          />
        ) : (
          <WebView
            source={{
              html: getPdfViewerHtml(book.pdfUrl),
              baseUrl: API_URL,
            }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            mixedContentMode="always"
            allowUniversalAccessFromFileURLs
            allowFileAccess
            onError={() => setError('Failed to load book viewer.')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookInfo: { flex: 1, alignItems: 'center', marginHorizontal: 16 },
  bookTitle: { fontSize: 16, fontWeight: '700', color: '#E85D54', textAlign: 'center' },
  bookAuthor: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#E85D54', flex: 1, textAlign: 'center' },
  pdfContainer: { flex: 1 },
  webview: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#ff4444', textAlign: 'center', marginTop: 16, marginBottom: 24 },
  retryButton: { backgroundColor: '#E85D54', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  retryText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});
