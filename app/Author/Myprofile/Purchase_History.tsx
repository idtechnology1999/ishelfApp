import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.i-shelf.app';

export default function PurchaseHistory() {
  const router = useRouter();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const data = await authorAPI.getLatestPurchases();
      setSales(data.purchases || []);
    } catch (error) {
      console.error('Failed to load purchase history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoverUri = (coverImage: string | undefined) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `${API_URL}/${coverImage.replace(/^\//, '')}`;
  };

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sales History</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#E85D54" />
            </View>
          ) : sales.length === 0 ? (
            <View style={styles.centered}>
              <Ionicons name="receipt-outline" size={64} color="#FFD4D1" />
              <Text style={styles.emptyText}>No sales yet</Text>
              <Text style={styles.emptySubtext}>Your book sales will appear here</Text>
            </View>
          ) : (
            sales.map((item: any, index: number) => {
              const coverUri = getCoverUri(item.coverImage);
              return (
                <TouchableOpacity
                  key={item.id || item._id || index}
                  style={styles.purchaseCard}
                  onPress={() => handleItemPress(item)}
                >
                  {coverUri ? (
                    <Image source={{ uri: coverUri }} style={styles.bookImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.bookImage, styles.noImagePlaceholder]}>
                      <Ionicons name="book-outline" size={24} color="#E85D54" />
                    </View>
                  )}
                  <View style={styles.purchaseDetails}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{item.title || 'Untitled'}</Text>
                    <View style={styles.statRow}>
                      <Ionicons name="people-outline" size={13} color="#888" />
                      <Text style={styles.statText}>{item.uniqueBuyers || 0} buyer{item.uniqueBuyers !== 1 ? 's' : ''}</Text>
                      <Ionicons name="cart-outline" size={13} color="#888" style={{ marginLeft: 8 }} />
                      <Text style={styles.statText}>{item.salesCount || 0} sale{item.salesCount !== 1 ? 's' : ''}</Text>
                    </View>
                  </View>
                  <View style={styles.purchaseRight}>
                    <Text style={styles.price}>₦{(item.totalEarnings || 0).toLocaleString()}</Text>
                    <Text style={[styles.status, { color: '#4CAF50' }]}>Completed</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={32} color="#E85D54" />
            </TouchableOpacity>

            {selectedItem && (
              <View style={styles.detailContainer}>
                {getCoverUri(selectedItem.coverImage) ? (
                  <Image
                    source={{ uri: getCoverUri(selectedItem.coverImage)! }}
                    style={styles.modalBookImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.modalBookImage, styles.noImagePlaceholder]}>
                    <Ionicons name="book-outline" size={40} color="#E85D54" />
                  </View>
                )}
                <Text style={styles.modalBookTitle}>{selectedItem.title || 'Untitled'}</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.modalPrice}>₦{(selectedItem.totalEarnings || 0).toLocaleString()}</Text>
                  <Text style={[styles.modalStatus, { color: '#4CAF50' }]}>Completed</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Total Sales</Text>
                  <Text style={styles.infoValue}>{selectedItem.salesCount || 0} sale{selectedItem.salesCount !== 1 ? 's' : ''}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Unique Buyers</Text>
                  <Text style={styles.infoValue}>{selectedItem.uniqueBuyers || 0}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Last Sale</Text>
                  <Text style={styles.infoValue}>{formatDate(selectedItem.lastSaleDate)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 20, fontWeight: "600", color: "#E85D54",
    flex: 1, textAlign: "center",
  },
  headerSpacer: { width: 36 },

  listContainer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 },

  centered: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 13, color: '#bbb', marginTop: 6 },

  purchaseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
  },
  bookImage: { width: 50, height: 70, borderRadius: 6, marginRight: 12 },
  noImagePlaceholder: {
    backgroundColor: "#FFE8E6",
    alignItems: "center",
    justifyContent: "center",
  },
  purchaseDetails: { flex: 1 },
  bookTitle: { fontSize: 15, fontWeight: "600", color: "#000000", marginBottom: 6 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: '#888' },

  purchaseRight: { alignItems: "flex-end" },
  price: { fontSize: 15, fontWeight: "700", color: "#E85D54", marginBottom: 4 },
  status: { fontSize: 13, fontWeight: "500" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxHeight: "70%",
    position: "relative",
    borderWidth: 2,
    borderColor: "#FFD4D1",
  },
  closeButton: { position: "absolute", top: 16, right: 16, zIndex: 1 },
  detailContainer: { alignItems: "center", paddingTop: 20 },
  modalBookImage: { width: 100, height: 140, borderRadius: 8, marginBottom: 16 },
  modalBookTitle: {
    fontSize: 18, fontWeight: "600", color: "#000000",
    marginBottom: 12, textAlign: "center",
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  modalPrice: { fontSize: 20, fontWeight: "700", color: "#E85D54" },
  modalStatus: { fontSize: 16, fontWeight: "600" },
  infoSection: { width: "100%", marginBottom: 14 },
  infoLabel: { fontSize: 14, fontWeight: "600", color: "#000000", marginBottom: 2 },
  infoValue: { fontSize: 14, color: "#666666" },
});
