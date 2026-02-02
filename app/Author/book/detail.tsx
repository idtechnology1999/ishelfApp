import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreativeArtBook() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Creative Art Book</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Book Cover */}
        <View style={styles.bookCoverContainer}>
          <Image
            source={require('../../../assets/images/book-placeholder.png')}
            style={styles.bookCover}
            resizeMode="contain"
          />
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <Text style={styles.authorName}>Dr Ade-Ajayi Tokunbo</Text>
          <Text style={styles.bookTitle}>Abstract Colorful poster book</Text>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              Abstract Colorful Poster Book is a vibrant collection of modern,
              expressive poster-style artworks designed to inspire creativity through
              bold colors, dynamic shapes, and imaginative abstract compositions.
            </Text>
          </View>

          {/* Price Section */}
          <View style={styles.section}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceAmount}>₦1500</Text>
          </View>

          {/* Book Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book Details</Text>
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

          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  bookCoverContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
  },

  bookCover: {
    width: 200,
    height: 280,
    borderRadius: 8,
  },

  contentCard: {
    backgroundColor: "#FFE8E6", // Light coral matching brand
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },

  authorName: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
  },

  bookTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 24,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },

  descriptionText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
  },

  priceLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },

  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  detailLabel: {
    fontSize: 14,
    color: "#000000",
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  editButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  editButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});