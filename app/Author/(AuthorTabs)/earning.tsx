import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function Earning() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalEarnings: 0, monthlyEarnings: 0, balance: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    try {
      const [statsData, purchasesData, accountData] = await Promise.all([
        authorAPI.getDashboardStats(),
        authorAPI.getLatestPurchases(),
        authorAPI.getSubaccountStatus()
      ]);
      setStats(statsData);
      setTransactions(purchasesData.purchases);
      setBankAccount(accountData.bankAccount);
    } catch (error) {
      console.error('Failed to load earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Earnings Cards */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E85D54" />
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            <View style={[styles.card, styles.cardBlue]}>
              <Ionicons name="layers-outline" size={28} color="#E85D54" />
              <Text style={styles.cardLabel}>Total Earnings</Text>
              <Text style={styles.cardAmount}>₦{stats.totalEarnings.toLocaleString()}</Text>
            </View>

            <View style={[styles.card, styles.cardGreen]}>
              <Ionicons name="layers-outline" size={28} color="#E85D54" />
              <Text style={styles.cardLabel}>{getMonthName()} Earnings</Text>
              <Text style={styles.cardAmount}>₦{stats.monthlyEarnings.toLocaleString()}</Text>
            </View>

            <View style={[styles.card, styles.cardPink]}>
              <Ionicons name="layers-outline" size={28} color="#E85D54" />
              <Text style={styles.cardLabel}>Balance</Text>
              <Text style={styles.cardAmount}>₦{stats.balance.toLocaleString()}</Text>
              <TouchableOpacity onPress={() => router.push("/Author/Withdraw/WithdrawScreen")}>
                <Text style={styles.withdrawLink}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions List</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet</Text>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                {transaction.coverImage ? (
                  <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${transaction.coverImage}` }} style={styles.transactionImage} />
                ) : (
                  <Image source={require('../../../assets/images/book-placeholder.png')} style={styles.transactionImage} />
                )}
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <View style={styles.badgesContainer}>
                    <View style={styles.buyersBadge}>
                      <Ionicons name="people" size={12} color="#4CAF50" />
                      <Text style={styles.badgeText}>{transaction.uniqueBuyers || 0} {transaction.uniqueBuyers === 1 ? 'buyer' : 'buyers'}</Text>
                    </View>
                    <View style={styles.salesBadge}>
                      <Ionicons name="cart" size={12} color="#2196F3" />
                      <Text style={styles.badgeText}>{transaction.salesCount || 0} {transaction.salesCount === 1 ? 'sale' : 'sales'}</Text>
                    </View>
                  </View>
                  <Text style={styles.transactionDate}>Last sale: {new Date(transaction.lastSaleDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>₦{transaction.totalEarnings.toLocaleString()}</Text>
                  <Text style={[styles.transactionStatus, { color: '#4CAF50' }]}>Completed</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Bank Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Account</Text>
          {bankAccount && bankAccount.accountNumber ? (
            <View style={styles.bankCard}>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bankAccount.bankName}</Text>
                <Text style={styles.accountNumber}>{bankAccount.accountNumber}</Text>
                <Text style={styles.accountName}>{bankAccount.accountName}</Text>
              </View>
              <View style={styles.bankActions}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginBottom: 4 }} />
                <TouchableOpacity onPress={() => router.push("/Author/Withdraw/WithdrawScreen")}>
                  <Text style={styles.editText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.setupBankCard}
              onPress={() => router.push("/Author/Withdraw/WithdrawScreen")}
            >
              <View style={styles.setupBankContent}>
                <Ionicons name="add-circle" size={24} color="#E85D54" />
                <View style={styles.setupBankText}>
                  <Text style={styles.setupBankTitle}>Setup Bank Account</Text>
                  <Text style={styles.setupBankDesc}>Add your bank details to withdraw funds</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#E85D54" />
            </TouchableOpacity>
          )}
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
    color: "#E85D54",
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
    backgroundColor: "#FFE8E6",
  },

  cardGreen: {
    backgroundColor: "#FFF4E6",
  },

  cardPink: {
    backgroundColor: "#FFD4D1",
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
    color: "#E85D54",
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
    marginBottom: 16,
  },

  seeAllText: {
    fontSize: 14,
    color: "#E85D54",
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
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
    marginBottom: 6,
  },

  badgesContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },

  buyersBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },

  salesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666666",
  },

  transactionDate: {
    fontSize: 12,
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

  bankCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
  },

  bankActions: {
    alignItems: "center",
  },

  setupBankCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF8F7",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderStyle: "dashed",
  },

  setupBankContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },

  setupBankText: {
    flex: 1,
  },

  setupBankTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E85D54",
    marginBottom: 2,
  },

  setupBankDesc: {
    fontSize: 13,
    color: "#999999",
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
    color: "#E85D54",
    fontWeight: "500",
  },

  setupLink: {
    fontSize: 14,
    color: "#E85D54",
    fontWeight: "500",
  },

  buttonContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  withdrawButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  withdrawButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
});
