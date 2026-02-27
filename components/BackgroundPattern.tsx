import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const SQUARES = [
  { x: 290, y: 20, size: 55, opacity: 0.18, strokeWidth: 2 },
  { x: 330, y: 50, size: 35, opacity: 0.24, strokeWidth: 1.5 },
  { x: 310, y: 90, size: 22, opacity: 0.15, strokeWidth: 1.5 },
  { x: 355, y: 18, size: 18, opacity: 0.28, strokeWidth: 1 },
  { x: 270, y: 65, size: 28, opacity: 0.20, strokeWidth: 1.5 },
  { x: 10, y: 30, size: 40, opacity: 0.22, strokeWidth: 1.5 },
  { x: 40, y: 10, size: 20, opacity: 0.16, strokeWidth: 1.5 },
  { x: 5, y: 80, size: 25, opacity: 0.26, strokeWidth: 1 },
  { x: 340, y: 180, size: 45, opacity: 0.14, strokeWidth: 2 },
  { x: 365, y: 220, size: 25, opacity: 0.19, strokeWidth: 1.5 },
  { x: 0, y: 200, size: 50, opacity: 0.12, strokeWidth: 2 },
  { x: 20, y: 250, size: 22, opacity: 0.23, strokeWidth: 1.5 },
  { x: 5, y: 600, size: 60, opacity: 0.21, strokeWidth: 2 },
  { x: 50, y: 640, size: 35, opacity: 0.17, strokeWidth: 1.5 },
  { x: 15, y: 680, size: 20, opacity: 0.25, strokeWidth: 1.5 },
  { x: 70, y: 600, size: 15, opacity: 0.13, strokeWidth: 1 },
  { x: 300, y: 620, size: 50, opacity: 0.19, strokeWidth: 2 },
  { x: 340, y: 660, size: 30, opacity: 0.27, strokeWidth: 1.5 },
  { x: 310, y: 700, size: 18, opacity: 0.15, strokeWidth: 1 },
  { x: 355, y: 590, size: 22, opacity: 0.22, strokeWidth: 1.5 },
  { x: 150, y: 120, size: 18, opacity: 0.11, strokeWidth: 1 },
  { x: 200, y: 500, size: 14, opacity: 0.18, strokeWidth: 1 },
  { x: 80, y: 400, size: 20, opacity: 0.14, strokeWidth: 1 },
  { x: 330, y: 400, size: 16, opacity: 0.20, strokeWidth: 1 },
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
        position: "absolute",
        transform: [{ translateX: animX }, { translateY: animY }],
      }}
    >
      <Svg
        width={sq.size + 10}
        height={sq.size + 10}
        style={{ position: "absolute", left: sq.x - 5, top: sq.y - 5 }}
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

function StaticSquare({ sq }: { sq: typeof SQUARES[0] }) {
  return (
    <Svg
      width={sq.size + 10}
      height={sq.size + 10}
      style={{ position: "absolute", left: sq.x - 5, top: sq.y - 5 }}
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
  );
}

export function DynamicBackgroundPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {SQUARES.map((sq, i) => (
        <AnimatedSquare key={i} sq={sq} index={i} />
      ))}
    </View>
  );
}

export function StaticBackgroundPattern() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {SQUARES.map((sq, i) => (
        <StaticSquare key={i} sq={sq} />
      ))}
    </View>
  );
}

export function CompactStaticPattern() {
  const compactSquares = [
    { x: 20, y: 10, size: 40, opacity: 0.18, strokeWidth: 2 },
    { x: 70, y: 5, size: 25, opacity: 0.22, strokeWidth: 1.5 },
    { x: 100, y: 30, size: 18, opacity: 0.15, strokeWidth: 1 },
    { x: 5, y: 50, size: 30, opacity: 0.20, strokeWidth: 1.5 },
    { x: 130, y: 15, size: 15, opacity: 0.25, strokeWidth: 1 },
    { x: 45, y: 65, size: 20, opacity: 0.16, strokeWidth: 1.5 },
    { x: 110, y: 55, size: 35, opacity: 0.19, strokeWidth: 2 },
    { x: 150, y: 40, size: 22, opacity: 0.14, strokeWidth: 1.5 },
    { x: 10, y: 100, size: 28, opacity: 0.21, strokeWidth: 1.5 },
    { x: 80, y: 90, size: 16, opacity: 0.17, strokeWidth: 1 },
    { x: 140, y: 85, size: 25, opacity: 0.23, strokeWidth: 1.5 },
    { x: 50, y: 120, size: 20, opacity: 0.13, strokeWidth: 1 },
  ];

  return (
    <View style={{ width: 180, height: 140, position: 'relative' }}>
      {compactSquares.map((sq, i) => (
        <Svg
          key={i}
          width={sq.size + 10}
          height={sq.size + 10}
          style={{ position: "absolute", left: sq.x - 5, top: sq.y - 5 }}
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
      ))}
    </View>
  );
}
