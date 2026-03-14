import { Tabs, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReaderAuth } from '../_useReaderAuth';
import { useState, useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { readerCart } from "../../readerAPI";

export default function ReaderTabLayout() {
  useReaderAuth();
  const insets = useSafeAreaInsets();
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    try {
      const data = await readerCart.getCartItems();
      setCartCount(data.cartItems?.length || 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E85D54",
        tabBarInactiveTintColor: "#999",

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",

          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={size}
                color={color}
              />
              {cartCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: '#E85D54',
                  borderRadius: 10,
                  minWidth: 18,
                  height: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}