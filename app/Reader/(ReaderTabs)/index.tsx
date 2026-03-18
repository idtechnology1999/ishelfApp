import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import GestureRecognizer from "react-native-swipe-gestures";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { readerBooks, readerCart, readerReferral } from "../../readerAPI";

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
      loadCartCount();
      loadEarnings();
      loadNotifications();

      // Poll notifications every 30 seconds
      pollRef.current = setInterval(loadNotifications, 30000);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, [])
  );

  const loadNotifications = async () => {
    try {
      const data = await readerReferral.getNotifications();
      const notifs = data.notifications || [];
      setNotifications(notifs);
      // Count unread from AsyncStorage
      const seenRaw = await AsyncStorage.getItem('seenNotifIds');
      const seen: string[] = seenRaw ? JSON.parse(seenRaw) : [];
      setUnreadCount(notifs.filter((n: any) => !seen.includes(n.id)).length);
    } catch {}
  };

  const handleOpenNotifications = async () => {
    setShowNotifications(v => !v);
    if (!showNotifications) {
      // Mark all as seen
      const ids = notifications.map((n: any) => n.id);
      await AsyncStorage.setItem('seenNotifIds', JSON.stringify(ids));
      setUnreadCount(0);
    }
  };

  const notifIcon = (type: string) => {
    switch (type) {
      case 'registered': return { name: 'person-add' as const, color: '#8b5cf6' };
      case 'earned':     return { name: 'cash' as const, color: '#22c55e' };
      case 'requested':  return { name: 'time' as const, color: '#f59e0b' };
      case 'paid':       return { name: 'checkmark-circle' as const, color: '#3b82f6' };
      default:           return { name: 'notifications' as const, color: '#E85D54' };
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const loadEarnings = async () => {
    try {
      const data = await readerReferral.getSummary();
      setTotalEarnings(data.totalAvailable || 0);
    } catch {}
  };

  const loadCartCount = async () => {
    try {
      const data = await readerCart.getCartItems();
      setCartCount(data.cartItems?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  const loadBooks = async () => {
    try {
      const data = await readerBooks.getAllBooks();
      setBooks(data.books);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const data = await readerBooks.getAllBooks(search);
      setBooks(data.books);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const handleAddToCart = (bookId: string) => {
    router.push(`Reader/courses/PreviewAddToCart?bookId=${bookId}`);
  };

  return (
    <GestureRecognizer style={{ flex: 1 }} config={swipeConfig}>
      <SafeAreaView style={styles.container}>
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/Reader/earnings')}>
                <View style={styles.earningsButton}>
                  <Ionicons name="wallet-outline" size={20} color="#fff" />
                  <Text style={styles.earningsText}>₦{totalEarnings.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/Reader/(ReaderTabs)/cart')}>
                <View>
                  <Ionicons name="cart-outline" size={24} color="#E85D54" />
                  {cartCount > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleOpenNotifications}>
                <View>
                  <Ionicons name="notifications-outline" size={24} color="#E85D54" />
                  {unreadCount > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by course/author/Title ISBN"
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
            />
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>Recommendation</Text>
        </View>

        {/* Notification Panel */}
        {showNotifications && (
          <View style={styles.notifPanel}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {notifications.length === 0 ? (
              <View style={styles.notifEmpty}>
                <Ionicons name="notifications-off-outline" size={36} color="#ddd" />
                <Text style={styles.notifEmptyText}>No notifications yet</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                style={{ maxHeight: 340 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const icon = notifIcon(item.type);
                  return (
                    <View style={styles.notifItem}>
                      <View style={[styles.notifIconBox, { backgroundColor: `${icon.color}18` }]}>
                        <Ionicons name={icon.name} size={18} color={icon.color} />
                      </View>
                      <View style={styles.notifContent}>
                        <Text style={styles.notifMsg}>{item.message}</Text>
                        <Text style={styles.notifSub}>{item.sub}</Text>
                        <Text style={styles.notifTime}>{timeAgo(item.time)}</Text>
                      </View>
                    </View>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.notifDivider} />}
              />
            )}
          </View>
        )}

        {/* Scrollable Content */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E85D54" />
            </View>
          ) : books.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No books available</Text>
            </View>
          ) : (
            <View style={styles.booksContainer}>
              {books.map((book: any) => (
                <View key={book._id} style={styles.bookCard}>
                  {book.coverImage ? (
                    <Image
                      source={{ uri: book.coverImage.startsWith('http') ? book.coverImage : `${process.env.EXPO_PUBLIC_API_URL}/${book.coverImage}` }}
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
                  <View style={styles.bookInfo}>
                    <Text style={styles.authorText}>{book.authorId?.displayName || 'Unknown Author'}</Text>
                    <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                    <View style={styles.priceContainer}>
                      <View>
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={styles.price}>₦{book.price?.toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={20} color="#E85D54" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.addToCartButton}
                      onPress={() => handleAddToCart(book._id)}
                    >
                      <Text style={styles.addToCartText}>Add to Cart</Text>
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
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 16,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#E85D54',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  earningsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E85D54',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  earningsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginLeft: 20,
    marginTop: 20,
  },
  scrollContent: {
    flex: 1,
  },
  booksContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  authorText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E85D54",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E85D54",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  addToCartButton: {
    backgroundColor: "#E85D54",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "600",
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
  notifPanel: {
    position: 'absolute',
    top: 70,
    right: 16,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  notifEmpty: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  notifEmptyText: { fontSize: 14, color: '#bbb' },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  notifIconBox: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifMsg: { fontSize: 13, fontWeight: '600', color: '#1e293b', lineHeight: 18 },
  notifSub: { fontSize: 12, color: '#64748b', marginTop: 2, lineHeight: 17 },
  notifTime: { fontSize: 11, color: '#bbb', marginTop: 4 },
  notifDivider: { height: 1, backgroundColor: '#f8f9fa', marginHorizontal: 16 },
});