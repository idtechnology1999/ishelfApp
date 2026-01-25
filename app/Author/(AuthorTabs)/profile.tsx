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

export default function Profile() {
  const router = useRouter();

  const handleLogOut = () => {
    // Add logout logic here
    console.log("Logging out...");
    router.push("/Author/Login")
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Avatar Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../../assets/images/avatar.png")}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.userName}>Angela Phillips</Text>
          <Text style={styles.userRole}>Student</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Persona_Information")}
          >
            <Text style={styles.menuText}>Persona Information</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Purchase_History")}
          >
            <Text style={styles.menuText}>Purchase History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Settings")}
          >
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Support")}
          >
            <Text style={styles.menuText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
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

  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },

  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFD4E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },

  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  userRole: {
    fontSize: 16,
    color: "#666666",
  },

  menuContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },

  menuItem: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  menuText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },

  logoutContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 100,
  },

  logoutButton: {
    height: 56,
    backgroundColor: "#FF3B30",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});