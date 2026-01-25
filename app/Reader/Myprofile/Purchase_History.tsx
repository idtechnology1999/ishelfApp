import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the Purchase type
type Purchase = {
  id: number;
  title: string;
  price: string;
  status: string;
  statusColor: string;
  paymentMethod: string;
  date: string;
};

export default function PurchaseHistory() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Purchase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const purchases: Purchase[] = [
    {
      id: 1,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Paid",
      statusColor: "#4CAF50",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
    {
      id: 2,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Failed",
      statusColor: "#EF5350",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
    {
      id: 3,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Pending",
      statusColor: "#FFA726",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
    {
      id: 4,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Paid",
      statusColor: "#4CAF50",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
    {
      id: 5,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Failed",
      statusColor: "#EF5350",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
    {
      id: 6,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Pending",
      statusColor: "#FFA726",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
    {
      id: 7,
      title: "Abstract Color Poster",
      price: "₦1500",
      status: "Paid",
      statusColor: "#4CAF50",
      paymentMethod: "Card",
      date: "25th of November 2026",
    },
  ];

  const handleItemPress = (item: Purchase) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchase Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Purchase List */}
        <View style={styles.listContainer}>
          {purchases.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.purchaseCard}
              onPress={() => handleItemPress(item)}
            >
              <Image
                source={require("../../../assets/images/book-placeholder.png")} // Adjust path
                style={styles.bookImage}
              />
              <View style={styles.purchaseDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
              </View>
              <View style={styles.purchaseRight}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={[styles.status, { color: item.statusColor }]}>
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={32} color="#000000" />
            </TouchableOpacity>

            {selectedItem && (
              <View style={styles.detailContainer}>
                <Image
                  source={require("../../../assets/images/book-placeholder.png")} // Adjust path
                  style={styles.modalBookImage}
                />
                <Text style={styles.modalBookTitle}>{selectedItem.title}</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.modalPrice}>{selectedItem.price}</Text>
                  <Text style={[styles.modalStatus, { color: selectedItem.statusColor }]}>
                    {selectedItem.status}
                  </Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Payment Method</Text>
                  <Text style={styles.infoValue}>{selectedItem.paymentMethod}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{selectedItem.date}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A3D91",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },

  purchaseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  bookImage: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },

  purchaseDetails: {
    flex: 1,
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },

  purchaseRight: {
    alignItems: "flex-end",
  },

  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  status: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Modal Styles
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
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },

  detailContainer: {
    alignItems: "center",
    paddingTop: 20,
  },

  modalBookImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginBottom: 16,
  },

  modalBookTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },

  modalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },

  modalStatus: {
    fontSize: 16,
    fontWeight: "600",
  },

  infoSection: {
    width: "100%",
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 16,
    color: "#666666",
  },
});