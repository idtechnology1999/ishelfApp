import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Earning() {
  const router = useRouter();

  const transactions = [
    {
      id: 1,
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Successful",
      statusColor: "#4CAF50",
    },
    {
      id: 2,
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Pending",
      statusColor: "#FFA726",
    },
    {
      id: 3,
      title: "Abstract Color Poster",
      date: "12 Nov 2025",
      amount: "+₦1500",
      status: "Failed",
      statusColor: "#EF5350",
    },
  ];

  const withdrawals = [
    { id: 1, amount: "-₦50,000", date: "12 Nov 2025" },
    { id: 2, amount: "-₦50,000", date: "12 Nov 2025" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A3D91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Earnings Cards */}
        <View style={styles.cardsContainer}>
          {/* Total Earnings Card */}
          <View style={[styles.card, styles.cardBlue]}>
            <Ionicons name="layers-outline" size={28} color="#0A3D91" />
            <Text style={styles.cardLabel}>Total Earnings</Text>
            <Text style={styles.cardAmount}>₦234,500</Text>
          </View>

          {/* July Earnings Card */}
          <View style={[styles.card, styles.cardGreen]}>
            <Ionicons name="layers-outline" size={28} color="#2E7D32" />
            <Text style={styles.cardLabel}>July Earnings</Text>
            <Text style={styles.cardAmount}>₦64,500</Text>
          </View>

          {/* Balance Card */}
          <View style={[styles.card, styles.cardPink]}>
            <Ionicons name="layers-outline" size={28} color="#C2185B" />
            <Text style={styles.cardLabel}>Balance</Text>
            <Text style={styles.cardAmount}>₦24,500</Text>
            <TouchableOpacity onPress={() => router.push("/Author/Withdraw/WithdrawScreen")}>
              <Text style={styles.withdrawLink}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions List</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <Image
                source={require('../../../assets/images/book-placeholder.png')} // Adjust path
                
                style={styles.transactionImage}
              />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                <Text style={[styles.transactionStatus, { color: transaction.statusColor }]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Withdrawal Section */}
        <View style={styles.section}>
          <View style={styles.withdrawalHeader}>
            <Text style={styles.sectionTitle}>Withdrawal</Text>
            <View style={styles.withdrawalBadge}>
              <Ionicons name="arrow-up" size={16} color="#EF5350" />
              <Text style={styles.withdrawalBadgeText}>-₦50,000</Text>
            </View>
          </View>

          <View style={styles.bankCard}>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>Polaris Bank</Text>
              <Text style={styles.accountNumber}>0984737274</Text>
              <Text style={styles.accountName}>Tunde Afolayan</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.withdrawalTitle}>Last Withdrawal Activity</Text>

          {withdrawals.map((withdrawal) => (
            <View key={withdrawal.id} style={styles.withdrawalItem}>
              <View style={styles.withdrawalIcon}>
                <Ionicons name="arrow-up" size={20} color="#EF5350" />
              </View>
              <Text style={styles.withdrawalAmount}>{withdrawal.amount}</Text>
              <Text style={styles.withdrawalDate}>{withdrawal.date}</Text>
            </View>
          ))}
        </View>

        {/* Withdraw Now Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => router.push("/Author/Withdraw/WithdrawScreen")}
          >
            <Text style={styles.withdrawButtonText}>Withdraw Now</Text>
          </TouchableOpacity>
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

  scrollContent: {
    paddingBottom: 100,
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

  cardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    minHeight: 135,
  },

  cardBlue: {
    backgroundColor: "#C5E1F5",
  },

  cardGreen: {
    backgroundColor: "#C8E6C9",
  },

  cardPink: {
    backgroundColor: "#F8BBD0",
  },

  cardLabel: {
    fontSize: 13,
    color: "#000000",
    marginTop: 6,
    marginBottom: 6,
  },

  cardAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },

  withdrawLink: {
    fontSize: 13,
    color: "#0A3D91",
    textDecorationLine: "underline",
    marginTop: 4,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },

  seeAllText: {
    fontSize: 14,
    color: "#0A3D91",
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  transactionImage: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },

  transactionDetails: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  transactionDate: {
    fontSize: 13,
    color: "#666666",
  },

  transactionRight: {
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  transactionStatus: {
    fontSize: 13,
    fontWeight: "500",
  },

  withdrawalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  withdrawalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  withdrawalBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  bankCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  bankInfo: {
    flex: 1,
  },

  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },

  accountNumber: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },

  accountName: {
    fontSize: 14,
    color: "#666666",
  },

  editText: {
    fontSize: 14,
    color: "#EF5350",
    fontWeight: "500",
  },

  withdrawalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },

  withdrawalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  withdrawalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  withdrawalAmount: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },

  withdrawalDate: {
    fontSize: 14,
    color: "#666666",
  },

  buttonContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  withdrawButton: {
    height: 56,
    backgroundColor: "#0A3D91",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  withdrawButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
