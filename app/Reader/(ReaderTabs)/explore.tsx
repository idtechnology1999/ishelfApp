import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GestureRecognizer from "react-native-swipe-gestures";

export default function Explore() {
  const router = useRouter();

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  const categories = [
    { id: 1, title: "Textbooks and Course Materials", color: "#C4D9F4" },
    { id: 2, title: "Journals & Research Papers", color: "#B8F4D4" },
    { id: 3, title: "Past Questions & Exam Guides", color: "#E5E5E5" },
    { id: 4, title: "General Studies (GNS/GST)", color: "#FFD4D4" },
    { id: 5, title: "Science & Technology", color: "#B8F4D4" },
    { id: 6, title: "Arts & Humanities", color: "#E5E5E5" },
    { id: 7, title: "Career & Professional Development", color: "#C4D9F4" },
  ];

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeRight={() => router.back()}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by course/author/Title ISBN"
              placeholderTextColor="#999"
            />
          </View>

          {/* Categories List */}
          <View style={styles.categoriesList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                onPress={() => router.push("/Reader/courses/CourseMaterials")}
              >
                <Text style={styles.categoryText}>{category.title}</Text>
                <View style={styles.categoryPattern}>
                  <View style={styles.patternLine} />
                  <View style={[styles.patternLine, styles.patternLine2]} />
                  <View style={[styles.patternLine, styles.patternLine3]} />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E85D54",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  categoryCard: {
    height: 80,
    borderRadius: 16,
    paddingHorizontal: 20,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    zIndex: 1,
  },
  categoryPattern: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    gap: 8,
  },
  patternLine: {
    width: 60,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    transform: [{ rotate: "45deg" }],
  },
  patternLine2: {
    width: 50,
    marginLeft: 10,
  },
  patternLine3: {
    width: 55,
    marginLeft: 5,
  },
});