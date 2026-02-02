import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PreviewAddToCart() {
  const router = useRouter();

  const handleAddToCart = () => {
    router.push("/Reader/(ReaderTabs)/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D55" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creative Art Book</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#E85D55" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="#E85D55" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Book Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/book-placeholder.png")}
            style={styles.bookImage}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Author */}
          <Text style={styles.authorText}>Dr Ade-Ajayi Tokunbo</Text>

          {/* Title */}
          <Text style={styles.bookTitle}>Abstract Colorful poster book</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              Abstract Colorful Poster Book is a vibrant collection of modern,
              expressive poster-style artworks designed to inspire creativity through
              bold colors, dynamic shapes, and imaginative abstract compositions.
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>N1500</Text>
          </View>

          {/* Book Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Format: </Text>
                <Text style={styles.detailValue}>PDF</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pages: </Text>
                <Text style={styles.detailValue}>210</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Published: </Text>
                <Text style={styles.detailValue}>2024</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category: </Text>
                <Text style={styles.detailValue}>Creative art, Humanities</Text>
              </View>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#E85D55",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF5F4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE5E3",
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
  },
  bookImage: {
    width: 180,
    height: 260,
  },
  contentContainer: {
    backgroundColor: "#FFF5F4",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  authorText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 20,
    lineHeight: 28,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  priceSection: {
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E85D55",
  },
  detailsContainer: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  addToCartButton: {
    backgroundColor: "#E85D55",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#E85D55",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});