// ReaderOnboarding2.tsx
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ReaderOnboarding2() {
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
      onSwipeLeft={() => router.push("/Reader/ReaderOnboarding3")}
    >
      <DynamicBackgroundPattern />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#E8533F" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>
            Learn{"\n"}Anywhere,{"\n"}Anytime
          </Text>

          <Text style={styles.description}>
            Download or read online, stay connected to your studies wherever you are.
          </Text>

          <View style={styles.imageWrapper}>
            <Svg width={220} height={120} viewBox="0 0 52 28">
              <Path d="M26 6 Q14 2 2 6 L2 24 Q14 20 26 24 Z" fill="none" stroke="#E85D54" strokeWidth={1.4} strokeLinejoin="round" />
              <Path d="M26 6 Q38 2 50 6 L50 24 Q38 20 26 24 Z" fill="none" stroke="#E85D54" strokeWidth={1.4} strokeLinejoin="round" />
              <Path d="M26 6 Q25 15 26 24" fill="none" stroke="#E85D54" strokeWidth={1} />
              <Path d="M6 26 Q26 32 46 26" fill="none" stroke="#E8A838" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/Reader/ReaderOnboarding3")}
          >
            <Ionicons name="chevron-forward" size={24} color="#E8533F" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
    color: "#E8533F",
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    maxWidth: 320,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    backgroundColor: "#E8533F",
  },
  nextButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FCDAD6",
    alignItems: "center",
    justifyContent: "center",
  },
});