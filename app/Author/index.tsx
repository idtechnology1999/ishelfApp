import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Svg, { Path, Line } from "react-native-svg";
import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DynamicBackgroundPattern } from "../../components/BackgroundPattern";

export default function OnboardingScreenOne() {
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
      onSwipeLeft={() => router.push("/Author/OnboardingScreen2")}
    >
      <DynamicBackgroundPattern />
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#E85D54" />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Share with{"\n"}Ease
          </Text>

          <Text style={styles.description}>
            Upload your books, research papers, or course materials in just a few
            clicks — no stress, no piracy.
          </Text>

          <View style={styles.imageWrapper}>
            <Svg width={120} height={288} viewBox="0 0 24 58">
              <Path d="M9 4 Q12 2 15 4 L16 36 Q12 38 8 36 Z" fill="none" stroke="#E85D54" strokeWidth={1.4} />
              <Path d="M9 4 Q12 1 15 4" fill="none" stroke="#E85D54" strokeWidth={1.4} />
              <Path d="M8 36 L12 54 L16 36" fill="none" stroke="#E85D54" strokeWidth={1.4} strokeLinejoin="round" />
              <Line x1="12" y1="42" x2="12" y2="54" stroke="#E85D54" strokeWidth={0.8} />
              <Path d="M8.5 32 Q12 33.5 15.5 32" fill="none" stroke="#E85D54" strokeWidth={1} />
            </Svg>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/Author/OnboardingScreen2")}
          >
            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureRecognizer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    maxWidth: 320,
  },

  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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