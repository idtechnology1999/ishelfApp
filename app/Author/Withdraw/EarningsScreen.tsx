import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function EarningsScreen() {
  const router = useRouter();
  const [bankAccount, setBankAccount] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const accountData = await authorAPI.getSubaccountStatus();
      const hasAccount = accountData.bankAccount && accountData.bankAccount.accountNumber;
      setBankAccount(hasAccount ? accountData.bankAccount : null);
      setShowSetupPrompt(!hasAccount);

      // Fetch earnings from backend
      const purchasesData = await authorAPI.getLatestPurchases();
      const statsData = await authorAPI.getDashboardStats();
      
      setEarnings(purchasesData.purchases || []);
      setTotalEarnings(statsData.totalEarnings || 0);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load earnings data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E85D54']}
            tintColor="#E85D54"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Earnings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Bank Account Setup Prompt */}
        {showSetupPrompt ? (
          <View style={styles.section}>
            <View style={styles.setupPromptCard}>
              <Ionicons name="wallet-outline" size={48} color="#E85D54" />
              <Text style={styles.setupPromptTitle}>Setup Your Bank Account</Text>
              <Text style={styles.setupPromptText}>
                Add your bank details to receive automatic payments when readers purchase your books
              </Text>
              <TouchableOpacity 
                style={styles.setupButton}
                onPress={() => router.push('/Author/Withdraw/WithdrawScreen')}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.setupButtonText}>Setup Bank Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Bank Account Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Account</Text>
              <View style={styles.bankCard}>
                <View style={styles.bankCardHeader}>
                  <Ionicons name="card-outline" size={24} color="#E85D54" />
                  <View style={styles.autoSettlementBadge}>
                    <Ionicons name="flash" size={12} color="#4CAF50" />
                    <Text style={styles.autoSettlementText}>Auto Settlement</Text>
                  </View>
                </View>
                <Text style={styles.bankName}>{bankAccount?.bankName}</Text>
                <Text style={styles.accountNumber}>{bankAccount?.accountNumber}</Text>
                <Text style={styles.accountName}>{bankAccount?.accountName}</Text>
                <View style={styles.settlementInfo}>
                  <Ionicons name="information-circle-outline" size={16} color="#666" />
                  <Text style={styles.settlementInfoText}>
                    Payments are automatically transferred to your account within 1-2 business days
                  </Text>
                </View>
              </View>
            </View>

            {/* Total Earnings */}
            <View style={styles.section}>
              <View style={styles.totalEarningsCard}>
                <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
                <Text style={styles.totalEarningsAmount}>₦{totalEarnings.toLocaleString()}</Text>
                <Text style={styles.totalEarningsSubtext}>All-time book sales revenue</Text>
              </View>
            </View>

            {/* Earnings History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              {earnings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={64} color="#CCC" />
                  <Text style={styles.emptyStateTitle}>No Earnings Yet</Text>
                  <Text style={styles.emptyStateText}>
                    Your earnings will appear here when readers purchase your books
                  </Text>
                </View>
              ) : (
                earnings.map((earning: any, index: number) => (
                  <View key={index} style={styles.earningCard}>
                    <View style={styles.earningIcon}>
                      <Ionicons name="book" size={20} color="#E85D54" />
                    </View>
                    <View style={styles.earningDetails}>
                      <Text style={styles.earningTitle}>{earning.title}</Text>
                      <View style={styles.earningMeta}>
                        <View style={styles.salesBadge}>
                          <Ionicons name="people" size={12} color="#4CAF50" />
                          <Text style={styles.salesText}>{earning.uniqueBuyers || 0} {earning.uniqueBuyers === 1 ? 'buyer' : 'buyers'}</Text>
                        </View>
                        <View style={styles.transactionBadge}>
                          <Ionicons name="cart" size={12} color="#2196F3" />
                          <Text style={styles.transactionText}>{earning.salesCount || 0} {earning.salesCount === 1 ? 'sale' : 'sales'}</Text>
                        </View>
                      </View>
                      <Text style={styles.earningDate}>Last sale: {new Date(earning.lastSaleDate).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.earningAmount}>₦{earning.totalEarnings.toLocaleString()}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Info Section */}
            <View style={styles.section}>
              <View style={styles.infoCard}>
                <Ionicons name="help-circle-outline" size={24} color="#E85D54" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>How Automatic Settlement Works</Text>
                  <Text style={styles.infoText}>
                    • When a reader purchases your book, you earn 80% of the sale{'\n'}
                    • Payments are automatically sent to your bank account{'\n'}
                    • Settlement happens within 1-2 business days{'\n'}
                    • No withdrawal requests needed
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
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
    color: "#E85D54",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 36,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  setupPromptCard: {
    backgroundColor: "#FFF5F4",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD4D1",
  },
  setupPromptTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  setupPromptText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  setupButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E85D54",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bankCard: {
    backgroundColor: "#FFF5F4",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFD4D1",
  },
  bankCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  autoSettlementBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  autoSettlementText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
  },
  bankName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 6,
  },
  accountNumber: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
    letterSpacing: 1,
  },
  accountName: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  settlementInfo: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  settlementInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#666666",
    lineHeight: 16,
  },
  totalEarningsCard: {
    backgroundColor: "#E85D54",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  totalEarningsLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  totalEarningsAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  totalEarningsSubtext: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  earningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  earningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  earningDetails: {
    flex: 1,
  },
  earningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
  },
  earningMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  salesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  salesText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4CAF50",
  },
  transactionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  transactionText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2196F3",
  },
  earningDate: {
    fontSize: 11,
    color: "#999999",
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF5F4",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
