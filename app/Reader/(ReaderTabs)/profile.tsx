import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readerAuth } from '../../readerAPI';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {
  const router = useRouter();
  const [reader, setReader] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReaderData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadReaderData();
    }, [])
  );

  const loadReaderData = async () => {
    try {
      const data = await AsyncStorage.getItem('readerData');
      if (data) {
        setReader(JSON.parse(data));
      }
      
      const token = await AsyncStorage.getItem('readerToken');
      if (token) {
        const response = await axios.get(`${API_URL}/api/readers/profile/image`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.imageUrl) {
          // Cloudinary returns full URL, legacy returns path
          const url = response.data.imageUrl;
          setProfileImage(url.startsWith('http') ? url : `${API_URL}${url}`);
        }
      }
    } catch (error) {
      console.error('Error loading reader data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all AsyncStorage data
              await AsyncStorage.removeItem('readerToken');
              await AsyncStorage.removeItem('readerData');
              await AsyncStorage.removeItem('readerProfileImage');
              await AsyncStorage.removeItem('downloadedBooks');
              
              // Navigate to login screen
              router.replace('/Reader/Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
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
        {loading ? (
          <ActivityIndicator size="large" color="#E85D54" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person-circle" size={140} color="#FFD4D1" />
                )}
              </View>
              <Text style={styles.userName}>{reader?.fullName || 'Reader'}</Text>
              <Text style={styles.userRole}>Student</Text>
            </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Reader/Myprofile/Persona_Information")}
          >
            <Text style={styles.menuText}>Persona Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Reader/Myprofile/Purchase_History")}
          >
            <Text style={styles.menuText}>Purchase History</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Reader/Myprofile/Settings")}
          >
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#E85D54" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("/Reader/Myprofile/Support")}
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
      </>
        )}
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
    color: "#E85D54",
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
    backgroundColor: "#FFE8E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFD4D1",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
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
    backgroundColor: "#E85D54",
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