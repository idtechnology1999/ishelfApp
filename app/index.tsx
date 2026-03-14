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
import GestureRecognizer from "react-native-swipe-gestures";
import { DynamicBackgroundPattern } from "../components/BackgroundPattern";
import Svg, { Path, Line } from "react-native-svg";

type UserRole = "author" | "student";

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
      <DynamicBackgroundPattern />
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
            <View style={styles.cardBody}>
              {/* Fountain pen icon */}
              <Svg width={44} height={90} viewBox="0 0 24 58">
                <Path d="M9 4 Q12 2 15 4 L16 36 Q12 38 8 36 Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} />
                <Path d="M9 4 Q12 1 15 4" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} />
                <Path d="M8 36 L12 54 L16 36" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} strokeLinejoin="round" />
                <Line x1="12" y1="42" x2="12" y2="54" stroke="rgba(255,255,255,0.85)" strokeWidth={0.8} />
                <Path d="M8.5 32 Q12 33.5 15.5 32" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1} />
              </Svg>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.label}>Author / Lecturer</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: cardScale2 }] }}>
          <TouchableOpacity
            style={[styles.card, selected === "student" && styles.activeCard]}
            onPress={() => handleSelect("student")}
            activeOpacity={0.8}
          >
            <View style={styles.cardBody}>
              {/* Open book icon */}
              <Svg width={80} height={44} viewBox="0 0 52 28">
                <Path d="M26 6 Q14 2 2 6 L2 24 Q14 20 26 24 Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} strokeLinejoin="round" />
                <Path d="M26 6 Q38 2 50 6 L50 24 Q38 20 26 24 Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} strokeLinejoin="round" />
                <Path d="M26 6 Q25 15 26 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1} />
                <Path d="M6 26 Q26 32 46 26" fill="none" stroke="#E8C96A" strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.label}>Student / Reader</Text>
            </View>
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
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: "#E85D55",
    shadowColor: "#E85D55",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'flex-end',
  },
  activeCard: {
    shadowOpacity: 0.45,
    elevation: 8,
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    backgroundColor: '#C9A84C',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});