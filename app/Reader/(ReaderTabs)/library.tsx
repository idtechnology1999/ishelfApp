import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { readerBooks } from "../../readerAPI";

export default function Library() {
  const router = useRouter();
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseCount();
  }, []);

  const loadPurchaseCount = async () => {
    try {
      const data = await readerBooks.getMyPurchases();
      setPurchaseCount(data.purchases?.length || 0);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPurchasedBooks = () => {
    router.push("/Reader/Library/PurchasedBooks");
  };

  const handleViewDownloadedBooks = () => {
    router.push("/Reader/Library/DownloadedBooks");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      );
    }
    return (
      <View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Purchased Books</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{purchaseCount}</Text>
            </View>
          </View>
          <View style={styles.booksContainer}>
            <Image source={require("../../../assets/images/categoriespic.png")} style={styles.booksImage} resizeMode="contain" />
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewPurchasedBooks}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Downloaded Books</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{purchaseCount}</Text>
            </View>
          </View>
          <View style={styles.booksContainer}>
            <Image source={require("../../../assets/images/categoriespic.png")} style={styles.booksImage} resizeMode="contain" />
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewDownloadedBooks}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
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
    color: "#E85D54",
    flex: 1,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  countBadge: {
    backgroundColor: "#E85D54",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  booksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  booksImage: {
    width: 240,
    height: 180,
  },
  viewAllButton: {
    backgroundColor: "#E85D54",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
});