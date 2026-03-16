import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";

export default function WithdrawScreen() {
  const router = useRouter();
  const [bankAccount, setBankAccount] = useState(null);
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (bankSearch.trim()) {
      const filtered = banks.filter(bank =>
        bank.name.toLowerCase().includes(bankSearch.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banks);
    }
  }, [bankSearch, banks]);

  const verifyAccount = async () => {
    if (!accountNumber || accountNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit account number");
      return;
    }

    if (!selectedBank) {
      Alert.alert("Error", "Please select a bank first");
      return;
    }

    setVerifying(true);
    try {
      const response = await authorAPI.verifyAccount(accountNumber, selectedBank.code);
      setAccountName(response.accountName);
      Alert.alert("Success", `Account verified: ${response.accountName}`);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to verify account");
      setAccountName("");
    } finally {
      setVerifying(false);
    }
  };

  const handleSetupAccount = async () => {
    if (!accountName) {
      Alert.alert("Error", "Please verify your account number first");
      return;
    }

    setProcessing(true);
    try {
      const response = await authorAPI.setupSubaccount(
        accountNumber,
        accountName,
        selectedBank.name,
        selectedBank.code
      );
      setBankAccount(response.bankAccount);
      setShowSetupForm(false);
      setAccountNumber("");
      setAccountName("");
      setSelectedBank(null);
      setBankSearch("");
      Alert.alert(
        "Success", 
        "Bank account setup successfully! Payments will be automatically sent to your account within 1-2 business days.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to setup account");
    } finally {
      setProcessing(false);
    }
  };

  const loadData = async () => {
    try {
      const [accountData, banksData] = await Promise.all([
        authorAPI.getSubaccountStatus(),
        authorAPI.getBanks().catch(() => ({ banks: [] }))
      ]);
      
      const hasAccount = accountData.bankAccount && accountData.bankAccount.accountNumber;
      setBankAccount(hasAccount ? accountData.bankAccount : null);
      setBanks(banksData.banks || []);
      setFilteredBanks(banksData.banks || []);
      
      if (!hasAccount) {
        setShowSetupForm(true);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setShowSetupForm(true);
    } finally {
      setLoading(false);
    }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#E85D54" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setup Payment Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Bank Account Info or Setup Form */}
          {bankAccount && bankAccount.accountNumber ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Account</Text>
              <View style={styles.bankInfoCard}>
                <View style={{ flex: 1 }}>
                  <View style={styles.autoSettlementBadge}>
                    <Ionicons name="flash" size={14} color="#4CAF50" />
                    <Text style={styles.autoSettlementText}>Auto Settlement Enabled</Text>
                  </View>
                  <Text style={styles.bankName}>{bankAccount.bankName}</Text>
                  <Text style={styles.accountNumber}>{bankAccount.accountNumber}</Text>
                  <Text style={styles.accountName}>{bankAccount.accountName || 'Account Name'}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={20} color="#E85D54" />
                <Text style={styles.infoText}>
                  Payments are automatically transferred to your account within 1-2 business days after each sale. No withdrawal needed!
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => router.back()}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : showSetupForm ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Setup Bank Account</Text>
              <Text style={styles.sectionSubtitle}>Add your bank details to receive payments</Text>
              
              <Text style={styles.label}>Select Bank</Text>
              <TouchableOpacity
                style={styles.bankSelectCard}
                onPress={() => setShowBankDropdown(!showBankDropdown)}
              >
                <Ionicons name="business-outline" size={20} color="#E85D54" style={{ marginRight: 8 }} />
                <Text style={[styles.bankSelectText, !selectedBank && styles.placeholderText]}>
                  {selectedBank ? selectedBank.name : 'Choose your bank'}
                </Text>
                <Ionicons name={showBankDropdown ? "chevron-up" : "chevron-down"} size={20} color="#E85D54" />
              </TouchableOpacity>

              {showBankDropdown && (
                <View style={styles.dropdownContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search bank..."
                    value={bankSearch}
                    onChangeText={setBankSearch}
                  />
                  <ScrollView style={styles.bankDropdown} nestedScrollEnabled={true}>
                    {filteredBanks.map((bank) => (
                      <TouchableOpacity
                        key={bank.id}
                        style={styles.bankOption}
                        onPress={() => {
                          setSelectedBank(bank);
                          setShowBankDropdown(false);
                          setAccountName("");
                        }}
                      >
                        <Text style={styles.bankOptionText}>{bank.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.label}>Account Number</Text>
              <View style={styles.accountInputContainer}>
                <TextInput
                  style={styles.accountInput}
                  value={accountNumber}
                  onChangeText={(text) => {
                    setAccountNumber(text);
                    setAccountName("");
                  }}
                  placeholder="Enter 10-digit account number"
                  keyboardType="numeric"
                  maxLength={10}
                />
                <TouchableOpacity
                  style={[styles.verifyButton, (!accountNumber || accountNumber.length !== 10 || !selectedBank) && styles.verifyButtonDisabled]}
                  onPress={verifyAccount}
                  disabled={!accountNumber || accountNumber.length !== 10 || !selectedBank || verifying}
                >
                  {verifying ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  )}
                </TouchableOpacity>
              </View>

              {accountName ? (
                <View style={styles.verifiedCard}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.verifiedText}>{accountName}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.setupButton, (!accountName || processing) && styles.buttonDisabled]}
                onPress={handleSetupAccount}
                disabled={!accountName || processing}
              >
                {processing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.setupButtonText}>Complete Setup</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.warningCard}>
                <Ionicons name="alert-circle" size={24} color="#FF9800" />
                <View style={styles.warningText}>
                  <Text style={styles.warningTitle}>No Bank Account</Text>
                  <Text style={styles.warningDesc}>Setup your bank account to withdraw funds</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.setupAccountButton}
                onPress={() => setShowSetupForm(true)}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.setupAccountButtonText}>Setup Bank Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
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
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 16,
  },

  bankInfoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
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
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  autoSettlementText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
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

  warningCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE0B2",
    marginBottom: 16,
    gap: 12,
  },

  warningText: {
    flex: 1,
  },

  warningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E65100",
    marginBottom: 4,
  },

  warningDesc: {
    fontSize: 13,
    color: "#BF360C",
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
    marginTop: 16,
  },

  bankSelectCard: {
    height: 52,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  bankSelectText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },

  placeholderText: {
    color: "#999",
  },

  dropdownContainer: {
    marginTop: 8,
    marginBottom: 16,
  },

  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },

  bankDropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    maxHeight: 200,
  },

  bankOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },

  bankOptionText: {
    fontSize: 14,
    color: "#000",
  },

  accountInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  accountInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },

  verifyButton: {
    height: 52,
    paddingHorizontal: 20,
    backgroundColor: "#E85D54",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },

  verifyButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },

  verifyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  verifiedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },

  verifiedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E7D32",
    flex: 1,
  },

  setupButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    flexDirection: "row",
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

  setupButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  setupAccountButton: {
    height: 56,
    backgroundColor: "#E85D54",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  setupAccountButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF5F4",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4D1",
    gap: 12,
    marginBottom: 16,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },

  doneButton: {
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

  doneButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  cancelText: {
    fontSize: 14,
    color: "#E85D54",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 12,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },

  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#E85D54",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    height: 56,
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },

  helperText: {
    fontSize: 12,
    color: "#999999",
    marginTop: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  infoLabel: {
    fontSize: 14,
    color: "#666666",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#FFD4D1",
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

  buttonDisabled: {
    opacity: 0.6,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});