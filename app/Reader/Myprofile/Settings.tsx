import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const router = useRouter();
  const [themeEnabled, setThemeEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Settings Card */}
        <View style={styles.settingsCard}>
          {/* Theme Setting */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#0A3D91" }}
              thumbColor={themeEnabled ? "#FFFFFF" : "#FFFFFF"}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setThemeEnabled}
              value={themeEnabled}
              style={styles.switch}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Notification Setting */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notification</Text>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#0A3D91" }}
              thumbColor={notificationEnabled ? "#FFFFFF" : "#FFFFFF"}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setNotificationEnabled}
              value={notificationEnabled}
              style={styles.switch}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Language Preference */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Language Preference</Text>
            <View style={styles.languageContainer}>
              <Text style={styles.languageText}>English(USA)</Text>
              <View style={styles.languageIcon}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A3D91",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  settingsCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 8,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },

  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 16,
  },

  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  languageText: {
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#C5E1F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  languageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0A3D91",
    alignItems: "center",
    justifyContent: "center",
  },
});