import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import { DynamicBackgroundPattern } from "../../components/BackgroundPattern";
import SupportWidget from "../../components/SupportWidget";

export default function OnboardingScreenThree() {
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
      onSwipeLeft={() => router.push("/Author/Login")}
    >
      <DynamicBackgroundPattern />
      <SafeAreaView style={styles.container}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#E85D54" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.push("/Author/Login")}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Stay Protected</Text>

          <Text style={styles.description}>
            Build your personal library. Your content is secure — no
            screenshots, no unauthorized sharing. You stay in control.
          </Text>

          <View style={styles.imageWrapper}>
            <View style={styles.penContainer}>
              <Image
                source={require("../../assets/images/pen.png")}
                style={styles.penImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/Author/Login")}
          >
            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <SupportWidget />
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E85D54",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#E85D54",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555",
    maxWidth: 300,
  },

  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  penContainer: {
    width: 140,
    height: 160,
    borderRadius: 24,
    backgroundColor: '#E85D54',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E85D54',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 7,
  },
  penImage: {
    width: 62,
    height: 100,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
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
    backgroundColor: "#FFD4D1", // Light coral
    marginHorizontal: 4,
  },

  activeDot: {
    width: 18,
    backgroundColor: "#E85D54", // I-SHELF coral red
  },

  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E85D54", // I-SHELF coral red
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#E85D54",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});