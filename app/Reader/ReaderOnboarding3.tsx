// ReaderOnboarding3.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function ReaderOnboarding3() {
  const router = useRouter();

  const swipeConfig = {
    velocityThreshold: 0.25,
    directionalOffsetThreshold: 70,
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      config={swipeConfig}
      onSwipeRight={() => router.back()}
      onSwipeLeft={() => router.push("/Reader/SignUp")}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#E85D55" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>
            Organize{"\n"}Your{"\n"}Study Life
          </Text>

          <Text style={styles.description}>
            Build your personal library, bookmark favorites, and track your learning progress.
          </Text>

          <View style={styles.imageWrapper}>
            <Image
              source={require("../../assets/images/design.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/Reader/SignUp")}
          >
            <Ionicons name="chevron-forward" size={24} color="#E85D55" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
    color: "#E85D55",
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    maxWidth: 320,
    marginBottom: 20,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60, // Add padding to prevent collision with pagination
  },
  image: {
    width: width * 0.48,
    height: width * 0.48,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D7E2",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: "#E85D55",
  },
  nextButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF5F4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFE5E3",
  },
});