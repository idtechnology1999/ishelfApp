import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PersonaInformation() {
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
          <Text style={styles.headerTitle}>Personal Information</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <TouchableOpacity onPress={() => router.push("/Author/Myprofile/editBio")}>
              <Ionicons name="pencil" size={24} color="#E85D54" />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.infoText}>Angela Phillips</Text>
            <Text style={styles.infoText}>angelaphillips@gmail.com</Text>
            <Text style={styles.infoText}>08123 456 7885</Text>
          </View>
        </View>

        {/* Academic Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Academic Details</Text>
            <TouchableOpacity onPress={() => router.push("/Author/Myprofile/editAcademic")}>
              <Ionicons name="pencil" size={24} color="#E85D54" />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.infoText}>Nnamdi Azikwe</Text>
            <Text style={styles.infoText}>300lvl</Text>
            <Text style={styles.infoText}>Business Management</Text>
          </View>
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
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
  },

  card: {
    backgroundColor: "#FFF9F8", // Very light coral tint
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFD4D1", // Light coral border
  },

  infoText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 12,
    lineHeight: 24,
  },
});