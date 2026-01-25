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
        source={require("../assets/images/icon9.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>Continue as</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity
          style={[
            styles.card,
            styles.authorCard,
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
            styles.studentCard,
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
    paddingTop: 120, // increased top spacing
  },
  logo: {
    width: 140,
    height: 40,
    marginBottom: 60, // more space below the logo
  },
  subtitle: {
    fontSize: 16,
    color: "#0A3D91",
    marginBottom: 65, // increased space between text and cards
    fontWeight: "500",
  },
  cardRow: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20, // add horizontal padding to prevent cards touching edges
  },
  card: {
    width: 140, // slightly smaller width
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
  },
  authorCard: { backgroundColor: "#D7E9FF" },
  studentCard: { backgroundColor: "#FFDCDC" },
  activeCard: { borderWidth: 2, borderColor: "#0A3D91" },
  image: {
    width: 100, // reduced size
    height: 100, // reduced size
    borderRadius: 14,
    marginBottom: 10,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#000", textAlign: "center" },
});
