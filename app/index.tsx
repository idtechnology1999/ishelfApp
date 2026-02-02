import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useRouter } from "expo-router";

type UserRole = "author" | "student";

export default function ContinueAsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const handleSelect = (role: UserRole) => {
    setSelected(role);

    if (role === "author") {
      router.push("/Author/");
    } else {
      router.push("/Reader/");
    }
  };

  return (
    <GestureRecognizer style={styles.container} config={swipeConfig}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>Continue as</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity
          style={[
            styles.card,
            selected === "author" && styles.activeCard,
          ]}
          onPress={() => handleSelect("author")}
        >
          <Image
            source={require("../assets/images/author.png")}
            style={styles.image}
          />
          <Text style={styles.label}>Author / Lecturer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selected === "student" && styles.activeCard,
          ]}
          onPress={() => handleSelect("student")}
        >
          <Image
            source={require("../assets/images/student.png")}
            style={styles.image}
          />
          <Text style={styles.label}>Student / Reader</Text>
        </TouchableOpacity>
      </View>
    </GestureRecognizer>
  );
}


/* ---------------- Styles ---------------- */

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
    borderColor: "#E85D55", // I-SHELF red/coral color
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
    textAlign: "center" 
  },
});