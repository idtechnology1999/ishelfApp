import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Section = {
  icon: keyof typeof import("@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json");
  title: string;
  items: string[];
};

const sections: Section[] = [
  {
    icon: "cash-outline",
    title: "Pricing & Commission Policy",
    items: [
      "You set the price you want to earn per book sale.",
      "I-Shelf adds a platform commission on top of your price — this is what readers pay.",
      "Commission tiers based on your set price:",
      "   • ₦2,000 and below → 20% added (e.g. ₦1,500 → reader pays ₦1,800)",
      "   • ₦2,001 – ₦3,500 → 15% added (e.g. ₦3,000 → reader pays ₦3,450)",
      "   • ₦3,501 and above → 10% added (e.g. ₦5,000 → reader pays ₦5,500)",
      "You receive your full set price. The commission covers platform operations and maintenance.",
      "You can preview the public price live while setting your price during upload.",
    ],
  },
  {
    icon: "shield-checkmark-outline",
    title: "Copyright & Ownership",
    items: [
      "You must own the copyright to every book you upload, or have written permission from the copyright holder.",
      "Uploading books, textbooks, journals, or any content that does not belong to you is strictly prohibited.",
      "Plagiarism, re-uploading another author's work, or submitting scanned pirated content will result in immediate account suspension and possible legal action.",
      "I-Shelf reserves the right to remove any content suspected of copyright infringement without prior notice.",
    ],
  },
  {
    icon: "document-text-outline",
    title: "Content Standards",
    items: [
      "All books must be academic, educational, or informational in nature.",
      "Content must be accurate and must match the title, description, and ISBN/ISSN you provide.",
      "Misleading book descriptions, fake page counts, or wrong edition information are grounds for rejection.",
      "Books are reviewed by our admin team before being approved for sale. Approval may take 24–72 hours.",
      "Rejected books will be returned with a reason. You may resubmit after making corrections.",
    ],
  },
  {
    icon: "wallet-outline",
    title: "Earnings & Withdrawals",
    items: [
      "Your earnings accumulate in your I-Shelf wallet each time a reader purchases your book.",
      "You can request a withdrawal at any time, subject to a minimum withdrawal of ₦1,000.",
      "Withdrawals are processed manually by the admin team within 1–3 business days.",
      "Ensure your bank account details are correct before requesting a withdrawal — I-Shelf is not liable for transfers to wrong accounts.",
    ],
  },
  {
    icon: "warning-outline",
    title: "Violations & Consequences",
    items: [
      "First violation (e.g. misleading content): book removed, formal warning issued.",
      "Second violation: account temporarily suspended and earnings held pending review.",
      "Serious violations (copyright theft, fraud): permanent account ban and forfeiture of pending earnings.",
      "I-Shelf cooperates fully with law enforcement on copyright and fraud cases.",
    ],
  },
  {
    icon: "information-circle-outline",
    title: "General Terms",
    items: [
      "By uploading a book, you agree to all policies stated here.",
      "I-Shelf reserves the right to update these policies at any time. Continued use of the platform constitutes acceptance of any updates.",
      "For disputes or questions, contact support through the app's Support section.",
    ],
  },
];

export default function PolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Author Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Intro */}
        <View style={styles.introCard}>
          <Ionicons name="book-outline" size={32} color="#E85D54" />
          <Text style={styles.introTitle}>I-Shelf Author Guidelines</Text>
          <Text style={styles.introText}>
            Please read these policies carefully before uploading your book. By proceeding you agree to all terms below.
          </Text>
        </View>

        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name={section.icon} size={20} color="#E85D54" />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                {!item.startsWith("   ") && (
                  <View style={styles.bullet} />
                )}
                <Text style={[styles.itemText, item.startsWith("   ") && styles.itemTextIndented]}>
                  {item.trimStart()}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.acceptButton} onPress={() => router.back()}>
          <Text style={styles.acceptButtonText}>I Understand</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: "#FFE8E6",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#E85D54", flex: 1, textAlign: "center" },
  headerSpacer: { width: 36 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48 },
  introCard: {
    backgroundColor: "#FFF5F4", borderRadius: 16, borderWidth: 1, borderColor: "#FFD4D1",
    padding: 20, alignItems: "center", marginBottom: 24,
  },
  introTitle: { fontSize: 17, fontWeight: "700", color: "#333", marginTop: 12, marginBottom: 8, textAlign: "center" },
  introText: { fontSize: 13, color: "#666", textAlign: "center", lineHeight: 20 },
  section: {
    marginBottom: 24, backgroundColor: "#FAFAFA", borderRadius: 14,
    borderWidth: 1, borderColor: "#F0F0F0", padding: 16,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: "#FFF0EE",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#222", flex: 1 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  bullet: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: "#E85D54",
    marginTop: 6, marginRight: 10, flexShrink: 0,
  },
  itemText: { fontSize: 13, color: "#444", lineHeight: 20, flex: 1 },
  itemTextIndented: { paddingLeft: 16, color: "#555", fontStyle: "italic" },
  acceptButton: {
    height: 56, backgroundColor: "#E85D54", borderRadius: 28,
    alignItems: "center", justifyContent: "center", marginTop: 8,
    shadowColor: "#E85D54", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  acceptButtonText: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
});
