// ReaderOnboarding3.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import GestureRecognizer from "react-native-swipe-gestures";
import { DynamicBackgroundPattern } from "../../components/BackgroundPattern";
import SupportWidget from "../../components/SupportWidget";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
      <DynamicBackgroundPattern />
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
            <View style={styles.bookContainer}>
              <Svg width={90} height={50} viewBox="0 0 52 28">
                <Path d="M26 6 Q14 2 2 6 L2 24 Q14 20 26 24 Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.4} strokeLinejoin="round" />
                <Path d="M26 6 Q38 2 50 6 L50 24 Q38 20 26 24 Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.4} strokeLinejoin="round" />
                <Path d="M26 6 Q25 15 26 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1} />
                <Path d="M6 26 Q26 32 46 26" fill="none" stroke="#E8C96A" strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </View>
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
      <SupportWidget />
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: "#E85D55",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    maxWidth: 300,
    marginBottom: 16,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  bookContainer: {
    width: 150,
    height: 130,
    borderRadius: 22,
    backgroundColor: '#E85D54',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E85D54',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 7,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 28,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D0D7E2",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#E85D55",
  },
  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF5F4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFE5E3",
  },
});