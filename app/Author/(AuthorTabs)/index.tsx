import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import { authorAPI } from "../../authorAPI";


export default function HomeTab() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalBooks: 0, totalEarnings: 0, totalSales: 0 });
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, purchasesData] = await Promise.all([
        authorAPI.getDashboardStats(),
        authorAPI.getLatestPurchases()
      ]);
      setStats(statsData);
      setPurchases(purchasesData.purchases || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeLeft={() => router.push("/Author/(AuthorTabs)/my-works")}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.notificationButton}
            //  onPress={() => 
            //     router.push("/notifications")}
                >
              <Ionicons name="notifications-outline" size={28} color="#DC143C" />
            </TouchableOpacity>
          </View>

          {/* Overview Section */}
          <Text style={styles.sectionTitle}>Overview</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#DC143C" />
            </View>
          ) : (
            <>
              <View style={styles.overviewContainer}>
                {/* Total Uploads Card */}
                <View style={[styles.card, styles.uploadsCard]}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#DC143C" />
                  <Text style={styles.cardLabel}>Total Uploads</Text>
                  <Text style={styles.cardValue}>{stats.totalBooks}</Text>
                </View>

                {/* Total Sales Card */}
                <View style={[styles.card, styles.salesCard]}>
                  <Ionicons name="people-outline" size={32} color="#DC143C" />
                  <Text style={styles.cardLabel}>Total Sales</Text>
                  <Text style={styles.cardValue}>{stats.totalSales || 0}</Text>
                </View>
              </View>

              {/* Earnings Card - Full Width */}
              <View style={styles.earningsFullCard}>
                <Ionicons name="wallet-outline" size={32} color="#DC143C" />
                <Text style={styles.cardLabel}>Total Earnings</Text>
                <Text style={styles.cardValue}>₦{stats.totalEarnings.toLocaleString()}</Text>
              </View>
            </>
          )}

          {/* Upload Your Book Section */}
          <Text style={styles.sectionTitle}>Upload Your Book</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => router.push("/Author/book/Upload1")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>

          {/* Latest Purchases Section */}
          <Text style={styles.sectionTitle}>Latest Purchases</Text>
          <View style={styles.purchasesList}>
            {purchases.length === 0 ? (
              <Text style={styles.emptyText}>No purchases yet</Text>
            ) : (
              purchases.map((purchase) => (
                <TouchableOpacity
                  key={purchase.id}
                  style={styles.purchaseItem}
                >
                  <View style={styles.bookThumbnail}>
                    {purchase.coverImage ? (
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${purchase.coverImage}` }}
                        style={styles.bookImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/book-placeholder.png')}
                        style={styles.bookImage}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  <View style={styles.purchaseInfo}>
                    <Text style={styles.purchaseTitle}>{purchase.title}</Text>
                    <View style={styles.purchaseMetaRow}>
                      <View style={styles.soldBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                        <Text style={styles.soldText}>Sold</Text>
                      </View>
                      <View style={styles.salesCountBadge}>
                        <Ionicons name="people" size={12} color="#666" />
                        <Text style={styles.salesCountText}>{purchase.uniqueBuyers || 0}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.purchaseRight}>
                    <Text style={styles.purchaseAmount}>₦{purchase.totalEarnings.toLocaleString()}</Text>
                    <Text style={styles.purchaseDate}>
                      {new Date(purchase.lastSaleDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  logoImage: {
    width: 100,
    height: 50,
  },

  notificationButton: {
    padding: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },

  overviewContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
  },

  card: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
  },

  uploadsCard: {
    backgroundColor: "#FFE5E5", // Light red/pink
  },

  salesCard: {
    backgroundColor: "#E8F5E9", // Light green
  },

  earningsFullCard: {
    backgroundColor: "#FFF0F0",
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
  },

  cardLabel: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },

  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#DC143C", // Crimson red
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC143C", // Crimson red
    marginHorizontal: 24,
    height: 56,
    borderRadius: 12,
    gap: 8,
  },

  uploadButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  purchasesList: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 24,
  },

  purchaseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  bookThumbnail: {
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 12,
    overflow: "hidden",
  },

  bookImage: {
    width: "100%",
    height: "100%",
  },

  purchaseInfo: {
    flex: 1,
  },

  purchaseMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  soldBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },

  soldText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
  },

  salesCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },

  salesCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },

  purchaseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  purchaseDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },

  purchaseRight: {
    alignItems: "flex-end",
  },

  purchaseAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC143C",
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
});