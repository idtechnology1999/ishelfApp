import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { readerReferral } from '../readerAPI';

type Referral = {
  id: string;
  authorName: string;
  authorEmail: string;
  hasPaid: boolean;
  amount: number;
  status: 'pending' | 'available' | 'requested' | 'paid';
  payoutRequestedAt?: string;
  paidAt?: string;
  createdAt: string;
};

type BankAccount = {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
};

export default function EarningsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState({ accountNumber: '', accountName: '', bankName: '', bankCode: '' });
  const [savingBank, setSavingBank] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await readerReferral.getSummary();
      setTotalAvailable(data.totalAvailable || 0);
      setTotalEarned(data.totalEarned || 0);
      setReferrals(data.referrals || []);
      setBankAccount(data.bankAccount || null);
      setReferralCode(data.referralCode || null);
      if (data.bankAccount) {
        setBankForm(data.bankAccount);
      }
    } catch {
      Alert.alert('Error', 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleShareCode = () => {
    if (!referralCode) return;
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', `${referralCode} has been copied to your clipboard.`);
  };

  const handleSaveBank = async () => {
    if (!bankForm.accountNumber || !bankForm.accountName || !bankForm.bankName) {
      Alert.alert('Error', 'Please fill in bank name, account number and account name');
      return;
    }
    setSavingBank(true);
    try {
      await readerReferral.saveBankAccount(
        bankForm.accountNumber, bankForm.accountName, bankForm.bankName, bankForm.bankCode
      );
      setBankAccount({ ...bankForm });
      setShowBankForm(false);
      Alert.alert('Saved', 'Bank account details saved successfully');
    } catch {
      Alert.alert('Error', 'Failed to save bank details');
    } finally {
      setSavingBank(false);
    }
  };

  const handleRequestPayout = async (earningId: string) => {
    if (!bankAccount?.accountNumber) {
      Alert.alert('Bank Account Required', 'Please add your bank account details before requesting a payout.');
      setShowBankForm(true);
      return;
    }
    setRequestingId(earningId);
    try {
      await readerReferral.requestPayout(earningId);
      await loadData();
      Alert.alert('Request Sent! 🎉', 'Your payout request has been submitted. We will credit your account within 1 hour.');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setRequestingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'requested': return '#f59e0b';
      case 'paid': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Awaiting Payment';
      case 'available': return 'Ready to Claim';
      case 'requested': return 'Request Sent';
      case 'paid': return 'Paid';
      default: return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E85D54" />
        </View>
      </SafeAreaView>
    );
  }

  const activeReferrals = referrals.filter(r => r.status !== 'paid');
  const paidHistory = referrals.filter(r => r.status === 'paid');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={28} color="#E85D54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Earnings</Text>
        <TouchableOpacity onPress={() => setShowBankForm(!showBankForm)} style={styles.headerBtn}>
          <Ionicons name="card-outline" size={24} color="#E85D54" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#E85D54' }]}>
            <Ionicons name="wallet" size={22} color="#fff" />
            <Text style={styles.summaryAmount}>₦{totalAvailable.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Available</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#1e293b' }]}>
            <Ionicons name="trending-up" size={22} color="#fff" />
            <Text style={styles.summaryAmount}>₦{totalEarned.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Referral Code Card */}
        {referralCode && (
          <TouchableOpacity style={styles.referralCodeCard} onPress={handleShareCode}>
            <View style={styles.referralCodeLeft}>
              <Ionicons name="gift-outline" size={22} color="#E85D54" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
                <Text style={styles.referralCodeValue}>{referralCode}</Text>
              </View>
            </View>
            <View style={styles.shareBtn}>
              <Ionicons name="copy-outline" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Bank Account Card */}
        <TouchableOpacity style={styles.bankCard} onPress={() => setShowBankForm(!showBankForm)}>
          <View style={styles.bankCardLeft}>
            <View style={[styles.bankIcon, { backgroundColor: bankAccount ? '#f0fdf4' : '#fff5f5' }]}>
              <Ionicons name="business-outline" size={20} color={bankAccount ? '#22c55e' : '#E85D54'} />
            </View>
            <View>
              <Text style={styles.bankCardTitle}>
                {bankAccount ? bankAccount.bankName : 'Add Bank Account'}
              </Text>
              <Text style={styles.bankCardSub}>
                {bankAccount
                  ? `****${bankAccount.accountNumber?.slice(-4) ?? '----'} · ${bankAccount.accountName ?? ''}`
                  : 'Required to receive payouts'}
              </Text>
            </View>
          </View>
          <Ionicons name={showBankForm ? 'chevron-up' : 'chevron-down'} size={18} color="#999" />
        </TouchableOpacity>

        {/* Bank Form (inline, no Modal) */}
        {showBankForm && (
          <View style={styles.bankForm}>
            <Text style={styles.bankFormTitle}>Bank Account Details</Text>
            <Text style={styles.bankFormSub}>Your payout will be sent to this account</Text>

            {[
              { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. First Bank', keyboard: 'default' as const },
              { label: 'Account Number', key: 'accountNumber', placeholder: '10-digit account number', keyboard: 'numeric' as const },
              { label: 'Account Name', key: 'accountName', placeholder: 'As it appears on your account', keyboard: 'default' as const },
              { label: 'Bank Code (Optional)', key: 'bankCode', placeholder: 'e.g. 011', keyboard: 'numeric' as const },
            ].map(field => (
              <View key={field.key} style={styles.formGroup}>
                <Text style={styles.formLabel}>{field.label}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={field.placeholder}
                  placeholderTextColor="#bbb"
                  value={(bankForm as any)[field.key]}
                  onChangeText={v => setBankForm(prev => ({ ...prev, [field.key]: v }))}
                  keyboardType={field.keyboard}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.saveBtn, savingBank && { opacity: 0.6 }]}
              onPress={handleSaveBank}
              disabled={savingBank}
            >
              {savingBank
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Save Bank Account</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Referrals */}
        <Text style={styles.sectionTitle}>Referrals ({activeReferrals.length})</Text>

        {activeReferrals.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={40} color="#ddd" />
            <Text style={styles.emptyText}>No referrals yet</Text>
            <Text style={styles.emptySubText}>Share your referral code with authors. Earn ₦4,000 when they pay the upload fee.</Text>
          </View>
        ) : (
          activeReferrals.map(item => (
            <View key={item.id} style={styles.referralCard}>
              <View style={styles.referralAvatar}>
                <Text style={styles.referralAvatarText}>{item.authorName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{item.authorName}</Text>
                <Text style={styles.referralEmail} numberOfLines={1}>{item.authorEmail}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}18` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>
                  <Text style={styles.referralAmount}>₦{item.amount.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.referralAction}>
                {item.status === 'available' && (
                  <TouchableOpacity
                    style={styles.requestBtn}
                    onPress={() => handleRequestPayout(item.id)}
                    disabled={requestingId === item.id}
                  >
                    {requestingId === item.id
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.requestBtnText}>Request</Text>
                    }
                  </TouchableOpacity>
                )}
                {item.status === 'requested' && (
                  <View style={styles.sentBadge}>
                    <Text style={styles.sentText}>Sent ✓</Text>
                    <Text style={styles.sentSub}>~1 day</Text>
                  </View>
                )}
                {item.status === 'pending' && (
                  <View style={styles.pendingBadge}>
                    <Ionicons name="time-outline" size={14} color="#9ca3af" />
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        {/* Payment History */}
        {paidHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Payment History</Text>
            {paidHistory.map(item => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={styles.historyIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                  </View>
                  <View>
                    <Text style={styles.historyName}>{item.authorName}</Text>
                    <Text style={styles.historyDate}>
                      {item.paidAt
                        ? new Date(item.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyAmount}>+₦{item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  summaryRow: { flexDirection: 'row', gap: 12, padding: 20 },
  summaryCard: {
    flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  summaryAmount: { fontSize: 20, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  referralCodeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff5f5', marginHorizontal: 20, marginBottom: 8,
    borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: '#FFD4D1',
  },
  referralCodeLeft: { flexDirection: 'row', alignItems: 'center' },
  referralCodeLabel: { fontSize: 11, color: '#999', fontWeight: '500', marginBottom: 2 },
  referralCodeValue: { fontSize: 18, fontWeight: '800', color: '#E85D54', letterSpacing: 1 },
  shareBtn: {
    backgroundColor: '#E85D54', width: 36, height: 36,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  bankCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 4,
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#f0f0f0',
  },
  bankCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bankIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bankCardTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  bankCardSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  bankForm: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 8,
    borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb',
  },
  bankFormTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  bankFormSub: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  formGroup: { marginBottom: 14 },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  formInput: {
    height: 46, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 14, fontSize: 14, color: '#1e293b', backgroundColor: '#fafafa',
  },
  saveBtn: {
    height: 50, backgroundColor: '#E85D54', borderRadius: 25,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#1e293b',
    marginHorizontal: 20, marginTop: 20, marginBottom: 12,
  },
  emptyBox: {
    alignItems: 'center', padding: 40, marginHorizontal: 20,
    backgroundColor: '#fff', borderRadius: 16, gap: 8,
  },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#9ca3af' },
  emptySubText: { fontSize: 13, color: '#bbb', textAlign: 'center', lineHeight: 20 },
  referralCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 20, marginBottom: 10, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  referralAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFE8E6',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  referralAvatarText: { fontSize: 18, fontWeight: '700', color: '#E85D54' },
  referralInfo: { flex: 1 },
  referralName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  referralEmail: { fontSize: 12, color: '#64748b', marginTop: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  referralAmount: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  referralAction: { marginLeft: 8, alignItems: 'center' },
  requestBtn: {
    backgroundColor: '#E85D54', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, minWidth: 72, alignItems: 'center',
  },
  requestBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  sentBadge: { alignItems: 'center' },
  sentText: { fontSize: 11, fontWeight: '600', color: '#f59e0b' },
  sentSub: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  pendingBadge: { alignItems: 'center', justifyContent: 'center' },
  historyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 8,
    borderRadius: 12, padding: 14,
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center',
  },
  historyName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  historyDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
  historyAmount: { fontSize: 16, fontWeight: '700', color: '#22c55e' },
});
