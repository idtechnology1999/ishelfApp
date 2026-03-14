import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Path, Line } from "react-native-svg";

const ITEMS = [
  { type: 'pen',  x: 30,  y: 40,  size: 26, opacity: 0.18, rotation: '30deg'  },
  { type: 'pen',  x: 320, y: 25,  size: 20, opacity: 0.15, rotation: '-20deg' },
  { type: 'pen',  x: 10,  y: 220, size: 30, opacity: 0.14, rotation: '50deg'  },
  { type: 'pen',  x: 340, y: 200, size: 22, opacity: 0.16, rotation: '-40deg' },
  { type: 'pen',  x: 60,  y: 580, size: 26, opacity: 0.15, rotation: '15deg'  },
  { type: 'pen',  x: 310, y: 560, size: 24, opacity: 0.17, rotation: '-30deg' },
  { type: 'pen',  x: 170, y: 130, size: 18, opacity: 0.12, rotation: '60deg'  },
  { type: 'pen',  x: 200, y: 460, size: 20, opacity: 0.13, rotation: '-15deg' },
  { type: 'pen',  x: 90,  y: 350, size: 16, opacity: 0.11, rotation: '45deg'  },
  { type: 'pen',  x: 280, y: 380, size: 18, opacity: 0.13, rotation: '-55deg' },
  { type: 'book', x: 15,  y: 100, size: 32, opacity: 0.16, rotation: '-10deg' },
  { type: 'book', x: 330, y: 90,  size: 28, opacity: 0.14, rotation: '12deg'  },
  { type: 'book', x: 5,   y: 430, size: 34, opacity: 0.15, rotation: '-8deg'  },
  { type: 'book', x: 320, y: 420, size: 30, opacity: 0.16, rotation: '10deg'  },
  { type: 'book', x: 140, y: 55,  size: 26, opacity: 0.12, rotation: '20deg'  },
  { type: 'book', x: 130, y: 620, size: 32, opacity: 0.14, rotation: '-18deg' },
  { type: 'book', x: 250, y: 280, size: 24, opacity: 0.11, rotation: '15deg'  },
  { type: 'book', x: 50,  y: 700, size: 28, opacity: 0.13, rotation: '-12deg' },
  { type: 'book', x: 300, y: 680, size: 26, opacity: 0.14, rotation: '8deg'   },
  { type: 'book', x: 180, y: 320, size: 22, opacity: 0.10, rotation: '-20deg' },
];

// Fountain pen — barrel + nib matching the logo pen
function PenIcon({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const w = size;
  const h = size * 2.4;
  return (
    <Svg width={w} height={h} viewBox="0 0 24 58">
      {/* Barrel */}
      <Path
        d="M9 4 Q12 2 15 4 L16 36 Q12 38 8 36 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        opacity={opacity}
      />
      {/* Cap top */}
      <Path
        d="M9 4 Q12 1 15 4"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        opacity={opacity}
      />
      {/* Nib */}
      <Path
        d="M8 36 L12 54 L16 36"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
        opacity={opacity}
      />
      {/* Nib slit */}
      <Line
        x1="12" y1="42" x2="12" y2="54"
        stroke={color}
        strokeWidth={0.8}
        opacity={opacity}
      />
      {/* Grip band */}
      <Path
        d="M8.5 32 Q12 33.5 15.5 32"
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={opacity}
      />
    </Svg>
  );
}

// Open book — two curved pages + the orange arc underline from the logo
function BookIcon({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const w = size * 2;
  const h = size;
  return (
    <Svg width={w} height={h} viewBox="0 0 52 28">
      {/* Left page */}
      <Path
        d="M26 6 Q14 2 2 6 L2 24 Q14 20 26 24 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
        opacity={opacity}
      />
      {/* Right page */}
      <Path
        d="M26 6 Q38 2 50 6 L50 24 Q38 20 26 24 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
        opacity={opacity}
      />
      {/* Spine */}
      <Path
        d="M26 6 Q25 15 26 24"
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={opacity}
      />
      {/* Gold arc underline — like the logo */}
      <Path
        d="M6 26 Q26 32 46 26"
        fill="none"
        stroke="#E8A838"
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={opacity + 0.06}
      />
    </Svg>
  );
}

function FloatingItem({ item }: { item: typeof ITEMS[0] }) {
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.random() * 2000;
    const duration = 3500 + Math.random() * 2500;
    const dx = (Math.random() - 0.5) * 28;
    const dy = (Math.random() - 0.5) * 28;

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(animX, { toValue: dx, duration, useNativeDriver: true }),
            Animated.timing(animY, { toValue: dy, duration, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(animX, { toValue: 0, duration, useNativeDriver: true }),
            Animated.timing(animY, { toValue: 0, duration, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }, delay);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        transform: [
          { translateX: animX },
          { translateY: animY },
          { rotate: item.rotation },
        ],
      }}
    >
      {item.type === 'pen'
        ? <PenIcon size={item.size} color="#E85D54" opacity={item.opacity} />
        : <BookIcon size={item.size} color="#E85D54" opacity={item.opacity} />
      }
    </Animated.View>
  );
}

export function DynamicBackgroundPattern() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} pointerEvents="none">
      {ITEMS.map((item, i) => (
        <FloatingItem key={i} item={item} />
      ))}
    </View>
  );
}

export function StaticBackgroundPattern() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} pointerEvents="none">
      {ITEMS.map((item, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            transform: [{ rotate: item.rotation }],
          }}
        >
          {item.type === 'pen'
            ? <PenIcon size={item.size} color="#E85D54" opacity={item.opacity} />
            : <BookIcon size={item.size} color="#E85D54" opacity={item.opacity} />
          }
        </View>
      ))}
    </View>
  );
}
