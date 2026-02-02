import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";


export default function HomeTab() {
  const router = useRouter();

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const purchases = [
    {
      id: "1",
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Successful",
    },
    {
      id: "2",
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Successful",
    },
    {
      id: "3",
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Successful",
    },
    {
      id: "4",
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Successful",
    },
  ];

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
          <View style={styles.overviewContainer}>
            {/* Total Uploads Card */}
            <View style={[styles.card, styles.uploadsCard]}>
              <Ionicons name="cloud-upload-outline" size={32} color="#DC143C" />
              <Text style={styles.cardLabel}>Total Uploads</Text>
              <Text style={styles.cardValue}>25</Text>
            </View>

            {/* Total Earnings Card */}
            <View style={[styles.card, styles.earningsCard]}>
              <Ionicons name="wallet-outline" size={32} color="#DC143C" />
              <Text style={styles.cardLabel}>Total Earnings</Text>
              <Text style={styles.cardValue}>₦23,500</Text>
            </View>
          </View>

          {/* Upload Your Book Section */}
          <Text style={styles.sectionTitle}>Upload Your Book</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            // onPress={() => router.push("/upload")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>

          {/* Latest Purchases Section */}
          <Text style={styles.sectionTitle}>Latest Purchases</Text>
          <View style={styles.purchasesList}>
            {purchases.map((purchase) => (
              <TouchableOpacity
                key={purchase.id}
                style={styles.purchaseItem}
                // onPress={() => router.push(`/book/${purchase.id}`)}
              >
                <View style={styles.bookThumbnail}>
                  <Image
                    source={require('../../../assets/images/book-placeholder.png')}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.purchaseInfo}>
                  <Text style={styles.purchaseTitle}>{purchase.title}</Text>
                  <Text style={styles.purchaseDate}>{purchase.date}</Text>
                </View>
                <View style={styles.purchaseRight}>
                  <Text style={styles.purchaseAmount}>{purchase.amount}</Text>
                  <Text style={styles.purchaseStatus}>{purchase.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
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

  earningsCard: {
    backgroundColor: "#FFF0F0", // Very light red/pink
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

  purchaseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  purchaseDate: {
    fontSize: 13,
    color: "#666",
  },

  purchaseRight: {
    alignItems: "flex-end",
  },

  purchaseAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC143C", // Crimson red for amounts
    marginBottom: 4,
  },

  purchaseStatus: {
    fontSize: 13,
    color: "#2ECC71", // Keep green for "Successful" status
  },
});