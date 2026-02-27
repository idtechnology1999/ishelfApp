import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import GestureRecognizer from "react-native-swipe-gestures";

type UserRole = "author" | "student";

// Scattered hollow squares — mirroring the FCMB background pattern
// Each entry: { x, y, size, opacity, strokeWidth }
const SQUARES = [
  // Top-right cluster
  { x: 290, y: 20,  size: 55, opacity: 0.35, strokeWidth: 2 },
  { x: 330, y: 50,  size: 35, opacity: 0.28, strokeWidth: 1.5 },
  { x: 310, y: 90,  size: 22, opacity: 0.40, strokeWidth: 1.5 },
  { x: 355, y: 18,  size: 18, opacity: 0.25, strokeWidth: 1 },
  { x: 270, y: 65,  size: 28, opacity: 0.30, strokeWidth: 1.5 },

  // Top-left area
  { x: 10,  y: 30,  size: 40, opacity: 0.28, strokeWidth: 1.5 },
  { x: 40,  y: 10,  size: 20, opacity: 0.32, strokeWidth: 1.5 },
  { x: 5,   y: 80,  size: 25, opacity: 0.25, strokeWidth: 1 },

  // Middle-right
  { x: 340, y: 180, size: 45, opacity: 0.25, strokeWidth: 2 },
  { x: 365, y: 220, size: 25, opacity: 0.30, strokeWidth: 1.5 },

  // Middle-left
  { x: 0,   y: 200, size: 50, opacity: 0.22, strokeWidth: 2 },
  { x: 20,  y: 250, size: 22, opacity: 0.28, strokeWidth: 1.5 },

  // Bottom-left cluster
  { x: 5,   y: 600, size: 60, opacity: 0.30, strokeWidth: 2 },
  { x: 50,  y: 640, size: 35, opacity: 0.25, strokeWidth: 1.5 },
  { x: 15,  y: 680, size: 20, opacity: 0.35, strokeWidth: 1.5 },
  { x: 70,  y: 600, size: 15, opacity: 0.28, strokeWidth: 1 },

  // Bottom-right cluster
  { x: 300, y: 620, size: 50, opacity: 0.30, strokeWidth: 2 },
  { x: 340, y: 660, size: 30, opacity: 0.25, strokeWidth: 1.5 },
  { x: 310, y: 700, size: 18, opacity: 0.35, strokeWidth: 1 },
  { x: 355, y: 590, size: 22, opacity: 0.28, strokeWidth: 1.5 },

  // Scattered mid-screen
  { x: 150, y: 120, size: 18, opacity: 0.22, strokeWidth: 1 },
  { x: 200, y: 500, size: 14, opacity: 0.20, strokeWidth: 1 },
  { x: 80,  y: 400, size: 20, opacity: 0.22, strokeWidth: 1 },
  { x: 330, y: 400, size: 16, opacity: 0.22, strokeWidth: 1 },
];

const ACCENT = "#E85D55";

function AnimatedSquare({ sq, index }: { sq: typeof SQUARES[0]; index: number }) {
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomDelay = Math.random() * 2000;
    const randomDuration = 3000 + Math.random() * 2000;
    const randomX = (Math.random() - 0.5) * 40;
    const randomY = (Math.random() - 0.5) * 40;

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(animX, {
              toValue: randomX,
              duration: randomDuration,
              useNativeDriver: true,
            }),
            Animated.timing(animY, {
              toValue: randomY,
              duration: randomDuration,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(animX, {
              toValue: 0,
              duration: randomDuration,
              useNativeDriver: true,
            }),
            Animated.timing(animY, {
              toValue: 0,
              duration: randomDuration,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }, randomDelay);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [{ translateX: animX }, { translateY: animY }],
      }}
    >
      <Svg
        width={sq.size + 10}
        height={sq.size + 10}
        style={{ position: 'absolute', left: sq.x - 5, top: sq.y - 5 }}
      >
        <Rect
          x={5}
          y={5}
          width={sq.size}
          height={sq.size}
          rx={3}
          ry={3}
          fill="none"
          stroke={ACCENT}
          strokeWidth={sq.strokeWidth}
          opacity={sq.opacity}
        />
      </Svg>
    </Animated.View>
  );
}

function BackgroundPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {SQUARES.map((sq, i) => (
        <AnimatedSquare key={i} sq={sq} index={i} />
      ))}
    </View>
  );
}

export default function ContinueAsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const logoAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const cardScale1 = useRef(new Animated.Value(1)).current;
  const cardScale2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const handleSelect = (role: UserRole) => {
    setSelected(role);
    const scale = role === "author" ? cardScale1 : cardScale2;
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (role === "author") {
        router.push("/Author/");
      } else {
        router.push("/Reader/");
      }
    });
  };

  return (
    <GestureRecognizer style={styles.container} config={swipeConfig}>
      {/* Decorative background */}
      <BackgroundPattern />

      {/* Content */}
      <Animated.View
        style={{
          opacity: logoAnim,
          transform: [
            {
              translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: subtitleAnim,
            transform: [
              {
                translateY: subtitleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        Continue as
      </Animated.Text>

      <Animated.View
        style={[
          styles.cardRow,
          {
            opacity: cardsAnim,
            transform: [
              {
                translateY: cardsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: cardScale1 }] }}>
          <TouchableOpacity
            style={[styles.card, selected === "author" && styles.activeCard]}
            onPress={() => handleSelect("author")}
            activeOpacity={0.8}
          >
            <Image
              source={require("../assets/images/author.png")}
              style={styles.image}
            />
            <Text style={styles.label}>Author / Lecturer</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: cardScale2 }] }}>
          <TouchableOpacity
            style={[styles.card, selected === "student" && styles.activeCard]}
            onPress={() => handleSelect("student")}
            activeOpacity={0.8}
          >
            <Image
              source={require("../assets/images/student.png")}
              style={styles.image}
            />
            <Text style={styles.label}>Student / Reader</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 120,
  },
  logo: {
    width: 330,
    height: 90,
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 65,
    fontWeight: "600",
  },
  cardRow: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20,
  },
  card: {
    width: 140,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 3,
    borderColor: "#E85D55",
    shadowColor: "#E85D55",
    shadowOpacity: 0.15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
  },
});