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
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

const ITEMS_PER_PAGE = 7;

export default function Earning() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalEarnings: 0, monthlyEarnings: 0, balance: 0 });
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'manual' | 'automatic'>('manual');
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const parseAmountFromMessage = (message: string): number => {
    if (!message) return 0;
    const match = message.match(/₦([\d,]+)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };

  const buildHistoryFromNotifications = (notifications: any[]): any[] => {
    const withdrawalNotifs = notifications
      .filter((n: any) => n.action?.startsWith('withdrawal'))
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const built: any[] = [];
    let pending: any = null;

    for (const notif of withdrawalNotifs) {
      if (notif.action === 'withdrawal_requested') {
        if (pending) {
          built.push({
            _id: pending._id,
            amount: pending.metadata?.amount || parseAmountFromMessage(pending.message),
            createdAt: pending.createdAt,
            status: 'pending',
            bankAccount: pending.metadata?.bankAccount || null,
          });
        }
        pending = notif;
      } else if (notif.action === 'withdrawal_completed' || notif.action === 'withdrawal_rejected') {
        const base = pending || notif;
        built.push({
          _id: base._id,
          amount: base.metadata?.amount || notif.metadata?.amount || parseAmountFromMessage(notif.message),
          createdAt: base.createdAt,
          status: notif.action === 'withdrawal_completed' ? 'completed' : 'rejected',
          bankAccount: base.metadata?.bankAccount || notif.metadata?.bankAccount || null,
        });
        pending = null;
      }
    }

    if (pending) {
      built.push({
        _id: pending._id,
        amount: pending.metadata?.amount || parseAmountFromMessage(pending.message),
        createdAt: pending.createdAt,
        status: 'pending',
        bankAccount: pending.metadata?.bankAccount || null,
      });
    }

    return built.reverse();
  };

  const loadEarningsData = async () => {
    try {
      const [statsData, accountData, paymentModeData, withdrawalData, notifData] = await Promise.all([
        authorAPI.getDashboardStats(),
        authorAPI.getSubaccountStatus(),
        authorAPI.getPaymentMode().catch(() => ({ paymentMode: 'manual' })),
        authorAPI.getWithdrawalHistory().catch(() => ({})),
        authorAPI.getNotifications().catch(() => ({ notifications: [] })),
      ]);
      setStats(statsData);
      setBankAccount(accountData.bankAccount);
      setPaymentMode(paymentModeData.paymentMode);

      let history =
        withdrawalData.history ||
        withdrawalData.withdrawals ||
        withdrawalData.data ||
        withdrawalData.requests ||
        withdrawalData.transactions ||
        (Array.isArray(withdrawalData) ? withdrawalData : []);

      // If dedicated endpoint returned nothing, build from notifications
      if (history.length === 0) {
        history = buildHistoryFromNotifications(notifData.notifications || []);
      }

      setWithdrawalHistory(history);
    } catch (error) {
      console.error('Failed to load earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadEarningsData();
    setRefreshing(false);
  };

  const getMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 1000) {
      Alert.alert('Error', 'Minimum withdrawal amount is ₦1,000');
      return;
    }
    if (amount > stats.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setWithdrawing(true);
    try {
      await authorAPI.initiateWithdrawal(amount);
      setWithdrawModal(false);
      setWithdrawAmount('');
      Alert.alert('Success', 'Withdrawal request submitted successfully. Admin will process your payment.', [
        { text: 'OK', onPress: () => loadEarningsData() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'Received';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return '#4CAF50';
    if (status === 'rejected') return '#EF5350';
    return '#FFA726';
  };

  const totalPages = Math.ceil(withdrawalHistory.length / ITEMS_PER_PAGE);
  const pagedWithdrawals = withdrawalHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E85D54']} tintColor="#E85D54" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
              {paymentMode === 'manual' && bankAccount?.accountNumber && (
                <TouchableOpacity onPress={() => setWithdrawModal(true)}>
                  <Text style={styles.withdrawLink}>Withdraw</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Recent Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transaction History</Text>

          {withdrawalHistory.length === 0 ? (
            <Text style={styles.emptyText}>No withdrawal requests yet</Text>
          ) : (
            <>
              {pagedWithdrawals.map((item, index) => (
                <View key={item._id || index} style={styles.withdrawalCard}>
                  <View style={styles.withdrawalIconWrap}>
                    <Ionicons name="cash-outline" size={28} color="#E85D54" />
                  </View>
                  <View style={styles.withdrawalDetails}>
                    <Text style={styles.withdrawalAmount}>₦{item.amount?.toLocaleString()}</Text>
                    <Text style={styles.withdrawalDate}>
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                    {item.bankAccount && (
                      <Text style={styles.withdrawalBank}>
                        {item.bankAccount.bankName} • {item.bankAccount.accountNumber}
                      </Text>
                    )}
                  </View>
                  <View style={styles.withdrawalRight}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '22' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <View style={styles.pagination}>
                  <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                    onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <Ionicons name="chevron-back" size={18} color={currentPage === 1 ? '#ccc' : '#E85D54'} />
                  </TouchableOpacity>

                  <Text style={styles.pageText}>
                    Page {currentPage} of {totalPages}
                  </Text>

                  <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                    onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? '#ccc' : '#E85D54'} />
                  </TouchableOpacity>
                </View>
              )}
            </>
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
                {paymentMode === 'manual' && (
                  <TouchableOpacity onPress={() => router.push("/Author/Withdraw/WithdrawScreen")}>
                    <Text style={styles.editText}>Update</Text>
                  </TouchableOpacity>
                )}
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
        {paymentMode === 'manual' && bankAccount?.accountNumber && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.withdrawButton} onPress={() => setWithdrawModal(true)}>
              <Text style={styles.withdrawButtonText}>Withdraw Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Automatic Payment Info */}
        {paymentMode === 'automatic' && (
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#E85D54" />
              <Text style={styles.infoText}>
                Payments are automatically sent to your bank account within 1-2 business days after each sale.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => { setWithdrawModal(false); setWithdrawAmount(''); }}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Withdrawal</Text>
              <TouchableOpacity onPress={() => { setWithdrawModal(false); setWithdrawAmount(''); }}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {(() => {
              const entered = parseFloat(withdrawAmount) || 0;
              const overBalance = withdrawAmount !== '' && entered > stats.balance;
              const belowMin = withdrawAmount !== '' && entered > 0 && entered < 1000;
              const isDisabled = !withdrawAmount || overBalance || belowMin || entered === 0 || withdrawing;

              return (
                <>
                  <Text style={styles.modalLabel}>Amount (₦)</Text>
                  <TextInput
                    style={[styles.modalInput, overBalance && styles.modalInputError]}
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    color="#000"
                  />

                  {overBalance ? (
                    <View style={styles.errorRow}>
                      <Ionicons name="alert-circle" size={14} color="#dc2626" />
                      <Text style={styles.errorText}>
                        Insufficient balance. You only have ₦{stats.balance.toLocaleString()} available.
                      </Text>
                    </View>
                  ) : belowMin ? (
                    <View style={styles.errorRow}>
                      <Ionicons name="alert-circle" size={14} color="#f59e0b" />
                      <Text style={[styles.errorText, { color: '#f59e0b' }]}>
                        Minimum withdrawal amount is ₦1,000.
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.modalHelper}>Minimum: ₦1,000 | Available: ₦{stats.balance.toLocaleString()}</Text>
                  )}

                  {bankAccount && (
                    <View style={styles.modalBankInfo}>
                      <Ionicons name="card" size={16} color="#666" />
                      <Text style={styles.modalBankText}>
                        {bankAccount.bankName} • {bankAccount.accountNumber}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.modalButton, isDisabled && styles.modalButtonDisabled]}
                    onPress={handleWithdraw}
                    disabled={isDisabled}
                  >
                    {withdrawing ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalButtonText}>Submit Request</Text>
                    )}
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#E85D54", flex: 1, textAlign: "center" },
  headerSpacer: { width: 36 },

  cardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
  },
  card: { flex: 1, padding: 14, borderRadius: 16, minHeight: 135 },
  cardBlue: { backgroundColor: "#FFE8E6" },
  cardGreen: { backgroundColor: "#FFF4E6" },
  cardPink: { backgroundColor: "#FFD4D1" },
  cardLabel: { fontSize: 13, color: "#000000", marginTop: 6, marginBottom: 6 },
  cardAmount: { fontSize: 20, fontWeight: "700", color: "#000000" },
  withdrawLink: { fontSize: 13, color: "#E85D54", textDecorationLine: "underline", marginTop: 4 },

  section: { paddingHorizontal: 24, marginBottom: 24 },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },

  emptyText: { textAlign: 'center', color: '#999', fontSize: 14, paddingVertical: 20 },

  withdrawalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
  },
  withdrawalIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFE8E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  withdrawalDetails: { flex: 1 },
  withdrawalAmount: { fontSize: 17, fontWeight: "700", color: "#000", marginBottom: 3 },
  withdrawalDate: { fontSize: 12, color: "#888", marginBottom: 2 },
  withdrawalBank: { fontSize: 12, color: "#666" },
  withdrawalRight: { alignItems: "flex-end" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: { fontSize: 13, fontWeight: "600" },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 16,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFE8E6",
    alignItems: "center",
    justifyContent: "center",
  },
  pageButtonDisabled: { backgroundColor: "#F5F5F5" },
  pageText: { fontSize: 14, color: "#666", fontWeight: "500" },

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
  bankInfo: { flex: 1 },
  bankName: { fontSize: 16, fontWeight: "600", color: "#000000", marginBottom: 4 },
  accountNumber: { fontSize: 14, color: "#666666", marginBottom: 4 },
  accountName: { fontSize: 14, color: "#666666" },
  bankActions: { alignItems: "center" },
  editText: { fontSize: 14, color: "#E85D54", fontWeight: "500" },

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
  setupBankContent: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  setupBankText: { flex: 1 },
  setupBankTitle: { fontSize: 16, fontWeight: "600", color: "#E85D54", marginBottom: 2 },
  setupBankDesc: { fontSize: 13, color: "#999999" },

  buttonContainer: { paddingHorizontal: 24, marginBottom: 20 },
  withdrawButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  withdrawButtonText: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },

  loadingContainer: { paddingVertical: 60, alignItems: 'center' },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF5F4",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    gap: 12,
  },
  infoText: { flex: 1, fontSize: 13, color: "#666666", lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  modalLabel: { fontSize: 14, fontWeight: '500', color: '#1A1A1A', marginBottom: 8 },
  modalInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#FFD4D1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  modalInputError: { borderColor: '#dc2626', borderWidth: 2 },
  modalHelper: { fontSize: 12, color: '#999', marginBottom: 16 },
  modalBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalBankText: { fontSize: 13, color: '#666' },
  modalButton: { height: 56, backgroundColor: '#E85D54', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  modalButtonDisabled: { backgroundColor: '#CCCCCC' },
  modalButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: 2 },
  errorText: { fontSize: 12, color: '#dc2626', flex: 1 },
});
