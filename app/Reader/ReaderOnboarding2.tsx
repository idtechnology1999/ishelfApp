// ReaderOnboarding2.tsx
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
  image: {
    width: width * 0.48,
    height: width * 0.48,
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