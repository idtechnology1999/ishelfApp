import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Library() {
  const router = useRouter();

  const handleViewPurchasedBooks = () => {
    router.push("/Reader/Library/PurchasedBooks");
  };

  const handleViewDownloadedBooks = () => {
    router.push("/Reader/Library/DownloadedBooks");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#0A3D91" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Purchased Books Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchased Books</Text>
          <View style={styles.booksContainer}>
            <Image
              source={require("../../../assets/images/categoriespic.png")}
              style={styles.booksImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleViewPurchasedBooks}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Downloaded Books Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Downloaded Books</Text>
          <View style={styles.booksContainer}>
            <Image
              source={require("../../../assets/images/categoriespic.png")}
              style={styles.booksImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleViewDownloadedBooks}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: "#0A3D91",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
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
    backgroundColor: "#0A3D91",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});