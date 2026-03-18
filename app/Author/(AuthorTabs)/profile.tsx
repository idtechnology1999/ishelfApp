import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {
  const router = useRouter();
  const [author, setAuthor] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAuthorData();
    }, [])
  );

  const loadAuthorData = async () => {
    try {
      const data = await AsyncStorage.getItem('authorData');
      if (data) {
        setAuthor(JSON.parse(data));
      }
      
      const token = await AsyncStorage.getItem('authorToken');
      if (token) {
        const response = await axios.get(`${API_URL}/api/authors/profile/image`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.imageUrl) {
          // Cloudinary returns full URL, legacy returns path
          const url = response.data.imageUrl;
          setProfileImage(url.startsWith('http') ? url : `${API_URL}${url}`);
        }
      }
    } catch (error) {
      console.error('Error loading author data:', error);
    }
  };

  const handleLogOut = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.removeItem('authorToken');
      await AsyncStorage.removeItem('authorData');
      await AsyncStorage.removeItem('authorProfileImage');
      
      // Navigate to login screen
      router.replace('/Author/Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Avatar Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle" size={140} color="#FFD4D1" />
            )}
          </View>
          <Text style={styles.userName}>{author?.fullName || 'Author'}</Text>
          <Text style={styles.userRole}>{author?.displayName || 'Author'}</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Persona_Information")}
          >
            <Text style={styles.menuText}>Persona Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Purchase_History")}
          >
            <Text style={styles.menuText}>Purchase History</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Settings")}
          >
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Author/Myprofile/Support")}
          >
            <Text style={styles.menuText}>Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
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
    color: "#E85D54", // I-SHELF coral red
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
    backgroundColor: "#FFE8E6", // Light coral matching brand
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFD4D1", // Light coral border
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
    borderColor: "#FFD4D1", // Light coral border
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  logoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});