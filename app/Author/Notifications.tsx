import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { authorAPI } from '../authorAPI';

interface NotificationItem {
  _id: string;
  type: string;
  action: string;
  userName: string;
  userEmail: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

const getIcon = (action: string): { name: any; color: string; bg: string } => {
  switch (action) {
    case 'withdrawal_requested': return { name: 'wallet-outline', color: '#f59e0b', bg: '#fef3c7' };
    case 'withdrawal_completed': return { name: 'checkmark-circle', color: '#22c55e', bg: '#dcfce7' };
    case 'withdrawal_rejected': return { name: 'close-circle', color: '#ef4444', bg: '#fee2e2' };
    case 'book_approved': return { name: 'book', color: '#22c55e', bg: '#dcfce7' };
    case 'book_rejected': return { name: 'book-outline', color: '#ef4444', bg: '#fee2e2' };
    case 'book_uploaded': return { name: 'cloud-upload', color: '#DC143C', bg: '#FFE5E5' };
    case 'author_verified': return { name: 'shield-checkmark', color: '#22c55e', bg: '#dcfce7' };
    case 'author_suspended': return { name: 'ban', color: '#f59e0b', bg: '#fef3c7' };
    default: return { name: 'notifications-outline', color: '#DC143C', bg: '#FFE5E5' };
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

export default function AuthorNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await authorAPI.getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkRead = async (id: string) => {
    try {
      await authorAPI.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await authorAPI.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const icon = getIcon(item.action);
    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.cardUnread]}
        activeOpacity={0.7}
        onPress={() => !item.isRead && handleMarkRead(item._id)}
      >
        <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
          <Ionicons name={icon.name} size={22} color={icon.color} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardMessage}>{item.message || item.action}</Text>
          <Text style={styles.cardTime}>{timeAgo(item.createdAt)}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#DC143C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#DC143C" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} tintColor="#DC143C" />
          }
          contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyInner}>
              <Ionicons name="notifications-off-outline" size={56} color="#ddd" />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubText}>We'll notify you when something important happens</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  markAllText: { fontSize: 13, color: '#DC143C', fontWeight: '600' },
  listContent: { paddingVertical: 8, paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardUnread: { borderColor: '#FECACA', backgroundColor: '#FFF7F7' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  cardBody: { flex: 1 },
  cardMessage: { fontSize: 14, fontWeight: '500', color: '#111827', lineHeight: 20, marginBottom: 4 },
  cardTime: { fontSize: 12, color: '#9CA3AF' },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#DC143C',
    marginTop: 4,
    flexShrink: 0,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1 },
  emptyInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
  emptySubText: { fontSize: 13, color: '#9CA3AF', marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});
