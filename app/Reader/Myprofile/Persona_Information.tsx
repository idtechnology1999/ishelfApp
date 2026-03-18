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
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useReaderAuth } from '../_useReaderAuth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PersonaInformation() {
  useReaderAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reader, setReader] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
      const token = await AsyncStorage.getItem('readerToken');
      if (token) {
        const response = await axios.get(`${API_URL}/api/readers/profile/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setReader(response.data);
          await AsyncStorage.setItem('readerData', JSON.stringify(response.data));
        }
        
        const imgResponse = await axios.get(`${API_URL}/api/readers/profile/image`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (imgResponse.data.imageUrl) {
          setProfileImage(imgResponse.data.imageUrl);
        }
      }
    } catch (error) {
      console.error('Error loading reader data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const token = await AsyncStorage.getItem('readerToken');
        const response = await axios.post(
          `${API_URL}/api/readers/profile/upload-image`,
          { image: `data:image/jpeg;base64,${result.assets[0].base64}` },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileImage(response.data.imageUrl);
        Alert.alert('Success', 'Profile image updated successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload profile image');
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#E85D54" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

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

        {/* Profile Image */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person-circle" size={120} color="#FFD4D1" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <TouchableOpacity onPress={() => router.push("/Reader/Myprofile/editBio")}>
              <Ionicons name="pencil" size={24} color="#E85D54" />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.infoText}>{reader?.fullName || 'Not set'}</Text>
            <Text style={styles.infoText}>{reader?.email || 'Not set'}</Text>
            <Text style={styles.infoText}>Phone: {reader?.phone || 'Not set'}</Text>
          </View>
        </View>

        {/* Academic Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Academic Details</Text>
            <TouchableOpacity onPress={() => router.push("/Reader/Myprofile/editAcademic")}>
              <Ionicons name="pencil" size={24} color="#E85D54" />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.infoText}>Institution: {reader?.institution || 'Not set'}</Text>
            <Text style={styles.infoText}>Level: {reader?.level || 'Not set'}</Text>
            <Text style={styles.infoText}>Department: {reader?.department || 'Not set'}</Text>
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
    color: "#E85D54",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 36,
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFD4D1",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF9F8",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#E85D54",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
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
    backgroundColor: "#FFF9F8",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFD4D1",
  },
  infoText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 12,
    lineHeight: 24,
  },
});
