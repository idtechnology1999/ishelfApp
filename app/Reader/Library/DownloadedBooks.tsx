import React, { useState } from "react";
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

export default function DownloadedBooks() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const books = [
    {
      id: 1,
      author: "Dr Ade-Ajayi",
      title: "Abstract Color Poster",
    },
    {
      id: 2,
      author: "Dr Ade-Ajayi",
      title: "Abstract Color Poster",
    },
  ];

  const handleReadNow = (bookId: number) => {
    // router.push(`/ReadBook/${bookId}`);
    alert("read book now")
  };

  const handleDelete = (bookId: number) => {
    // Handle delete logic
    console.log("Deleting book:", bookId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D55" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloaded Books</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            style={viewMode === "list" && styles.activeView}
          >
            <Ionicons
              name="list"
              size={24}
              color={viewMode === "list" ? "#E85D55" : "#999"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("grid")}
            style={viewMode === "grid" && styles.activeView}
          >
            <Ionicons
              name="grid"
              size={24}
              color={viewMode === "grid" ? "#E85D55" : "#999"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.booksContainer}>
          {books.map((book) => (
            <View key={book.id} style={styles.bookCard}>
              <Image
                source={require("../../../assets/images/book-placeholder.png")}
                style={styles.bookImage}
                resizeMode="cover"
              />
              <View style={styles.bookDetails}>
                <View style={styles.bookInfo}>
                  <Text style={styles.authorText}>{book.author}</Text>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(book.id)}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.bookActions}>
                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() => handleReadNow(book.id)}
                >
                  <Text style={styles.readButtonText}>Read Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    fontSize: 20,
    fontWeight: "700",
    color: "#E85D55",
    flex: 1,
    textAlign: "center",
  },
  viewToggle: {
    flexDirection: "row",
    gap: 12,
  },
  activeView: {
    backgroundColor: "#FFF5F4",
    borderRadius: 8,
    padding: 4,
  },
  booksContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#FFF5F4",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FFE5E3",
  },
  bookImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookInfo: {
    flex: 1,
  },
  authorText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
    lineHeight: 24,
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  bookActions: {
    position: "absolute",
    bottom: 12,
    right: 12,
    left: 144,
  },
  readButton: {
    backgroundColor: "#E85D55",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#E85D55",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});