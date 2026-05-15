import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.i-shelf.app";

const ID_TYPE_LABELS: Record<string, string> = {
  nin: "NIN",
  drivers_license: "Driver's License",
  international_passport: "International Passport",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "#FFF3CD", text: "#92400E", label: "Pending" },
  approved: { bg: "#D4EDDA", text: "#166534", label: "Approved" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C", label: "Rejected" },
};

export default function DeletionRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return;
      const response = await axios.get(`${API_URL}/api/admin/deletion-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.requests);
    } catch (error) {
      console.error("Failed to fetch deletion requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      await axios.patch(
        `${API_URL}/api/admin/deletion-requests/${id}/status`,
        { status, adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedId(null);
      setAdminNote("");
      fetchRequests();
      Alert.alert("Success", `Request ${status} successfully`);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update");
    }
  };

  const confirmAction = (id: string, status: string) => {
    const label = status === "approved" ? "approve" : "reject";
    Alert.alert(
      `${label === "approve" ? "Approve" : "Reject"} Request`,
      `Are you sure you want to ${label} this deletion request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: label === "approve" ? "Approve" : "Reject",
          style: label === "approve" ? "default" : "destructive",
          onPress: () => handleUpdateStatus(id, status),
        },
      ]
    );
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours > 0) return `${hours}h ago`;
    const mins = Math.floor(diff / 60000);
    return `${mins}m ago`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E85D54" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#E85D54" />
        </TouchableOpacity>
        <Text style={styles.title}>Deletion Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.countText}>{requests.length} request{requests.length !== 1 ? "s" : ""}</Text>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={48} color="#D0D7E2" />
            <Text style={styles.emptyText}>No deletion requests yet</Text>
          </View>
        ) : (
          requests.map((req) => {
            const statusStyle = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
            const isOpen = selectedId === req._id;
            return (
              <TouchableOpacity
                key={req._id}
                style={styles.card}
                onPress={() => setSelectedId(isOpen ? null : req._id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.userName}>{req.fullName}</Text>
                    <Text style={styles.userEmail}>{req.email}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>
                    <Text style={styles.metaLabel}>ID: </Text>
                    {ID_TYPE_LABELS[req.idType] || req.idType} — {req.idNumber}
                  </Text>
                  <Text style={styles.timeAgo}>{getTimeAgo(req.createdAt)}</Text>
                </View>

                {req.reason ? (
                  <Text style={styles.reasonText}>"{req.reason}"</Text>
                ) : null}

                {isOpen && req.status === "pending" && (
                  <View style={styles.actionArea}>
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Add admin note (optional)"
                      placeholderTextColor="#999"
                      value={adminNote}
                      onChangeText={setAdminNote}
                      multiline
                    />
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => confirmAction(req._id, "approved")}
                      >
                        <Ionicons name="checkmark-outline" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => confirmAction(req._id, "rejected")}
                      >
                        <Ionicons name="close-outline" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {isOpen && req.status !== "pending" && req.adminNote ? (
                  <View style={styles.adminNoteBox}>
                    <Text style={styles.adminNoteLabel}>Admin Note:</Text>
                    <Text style={styles.adminNoteText}>{req.adminNote}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 16, backgroundColor: "#FFFFFF",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#E85D54" },
  countText: { fontSize: 13, color: "#888", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  content: { flex: 1, padding: 16 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingTop: 80 },
  emptyText: { fontSize: 15, color: "#999", marginTop: 12 },
  card: {
    backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16,
    marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  cardInfo: { flex: 1, marginRight: 12 },
  userName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 2 },
  userEmail: { fontSize: 13, color: "#888" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "700" },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  metaText: { fontSize: 13, color: "#666", flex: 1 },
  metaLabel: { fontWeight: "600", color: "#888" },
  timeAgo: { fontSize: 12, color: "#aaa", marginLeft: 8 },
  reasonText: {
    fontSize: 13, color: "#888", fontStyle: "italic",
    marginTop: 4, paddingLeft: 4,
  },
  actionArea: { marginTop: 12, borderTopWidth: 1, borderTopColor: "#F0F0F0", paddingTop: 12 },
  noteInput: {
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8,
    padding: 10, fontSize: 14, height: 60, textAlignVertical: "top",
    marginBottom: 10, color: "#333",
  },
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 8,
  },
  approveBtn: { backgroundColor: "#22C55E" },
  rejectBtn: { backgroundColor: "#EF4444" },
  actionBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  adminNoteBox: {
    marginTop: 8, backgroundColor: "#F9FAFB", borderRadius: 8,
    padding: 10, borderLeftWidth: 3, borderLeftColor: "#E85D54",
  },
  adminNoteLabel: { fontSize: 12, fontWeight: "600", color: "#888", marginBottom: 2 },
  adminNoteText: { fontSize: 13, color: "#555" },
});
