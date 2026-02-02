import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";

const { width } = Dimensions.get("window");

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
          <Text style={styles.title}>Stay Protected</Text>

          <Text style={styles.description}>
            Build your personal library. Your content is secure — no
            screenshots, no unauthorized sharing. You stay in control.
          </Text>

          {/* Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../assets/images/onboard3.png")}
              style={styles.image}
              resizeMode="contain"
            />
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
    fontSize: 34,
    fontWeight: "700",
    color: "#E85D54", // I-SHELF coral red
    marginBottom: 12,
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

  image: {
    width: width * 0.75,
    height: width * 0.75,
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