import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authorAPI } from "../../authorAPI";
import BookCover from "../../../components/BookCover";

type Transaction = {
  id: string;
  date: string;
  readerName: string;
  readerEmail: string;
  bookTitle: string;
  bookCover: string | null;
  bookId: string | null;
  amountPaid: number;
  authorEarnings: number;
  platformCommission: number;
  reference: string;
};

type BookFilter = { id: string; title: string };

export default function TransactionHistory() {
  const router = useRouter();
  const { bookId: initialBookId, bookTitle: initialBookTitle } = useLocalSearchParams<{
    bookId?: string;
    bookTitle?: string;
  }>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Book filter
  const [selectedBookId, setSelectedBookId] = useState<string | undefined>(initialBookId);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | undefined>(initialBookTitle);
  const [books, setBooks] = useState<BookFilter[]>([]);
  const [showBookPicker, setShowBookPicker] = useState(false);

  const fetchTransactions = useCallback(async (pageNum = 1, bookFilter?: string, append = false) => {
    try {
      if (!append) setLoading(true);
      const data = await authorAPI.getTransactionHistory(bookFilter, pageNum);
      const incoming: Transaction[] = data.transactions || [];

      // Collect unique books for filter dropdown
      if (pageNum === 1 && !bookFilter) {
        const seen = new Set<string>();
        const uniqueBooks: BookFilter[] = [];
        for (const t of incoming) {
          if (t.bookId && !seen.has(t.bookId)) {
            seen.add(t.bookId);
            uniqueBooks.push({ id: t.bookId, title: t.bookTitle });
          }
        }
        if (uniqueBooks.length > 0) setBooks(uniqueBooks);
      }

      setTransactions(append ? (prev) => [...prev, ...incoming] : incoming);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
      setPage(pageNum);
    } catch {
      // silently fail — UI shows empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(1, selectedBookId);
  }, [selectedBookId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions(1, selectedBookId);
  };

  const onLoadMore = () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    fetchTransactions(page + 1, selectedBookId, true);
  };

  const selectBook = (book: BookFilter | null) => {
    setShowBookPicker(false);
    if (book) {
      setSelectedBookId(book.id);
      setSelectedBookTitle(book.title);
    } else {
      setSelectedBookId(undefined);
      setSelectedBookTitle(undefined);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
  };

  const [downloading, setDownloading] = useState(false);

  const downloadAsPDF = async () => {
    if (transactions.length === 0) {
      Alert.alert("No Data", "There are no transactions to export.");
      return;
    }
    setDownloading(true);
    try {
      const title = selectedBookTitle ? `Sales — ${selectedBookTitle}` : "Transaction History";
      const generatedOn = new Date().toLocaleDateString("en-NG", {
        day: "numeric", month: "long", year: "numeric",
      });
      const totalEarned = transactions.reduce((s, t) => s + t.authorEarnings, 0);
      const totalPaid = transactions.reduce((s, t) => s + t.amountPaid, 0);

      const rows = transactions.map((t, i) => `
        <tr style="background:${i % 2 === 0 ? "#fff" : "#fafafa"}">
          <td>${i + 1}</td>
          <td>${formatDate(t.date)}<br/><span style="color:#999;font-size:11px">${formatTime(t.date)}</span></td>
          <td>${t.readerName}<br/><span style="color:#999;font-size:11px">${t.readerEmail}</span></td>
          <td style="max-width:160px">${t.bookTitle}</td>
          <td style="color:#16a34a;font-weight:700">₦${t.authorEarnings.toLocaleString()}</td>
          <td>₦${t.amountPaid.toLocaleString()}</td>
        </tr>
      `).join("");

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: Arial, sans-serif; color: #111; margin: 0; padding: 24px; font-size: 13px; }
            .brand { color: #E85D54; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
            .subtitle { color: #555; font-size: 13px; margin-top: 2px; }
            .meta { margin: 18px 0 8px; color: #666; font-size: 12px; }
            h2 { margin: 0 0 4px; font-size: 17px; color: #111; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th { background: #E85D54; color: #fff; padding: 9px 10px; text-align: left; font-size: 12px; }
            td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; font-size: 12px; }
            .summary { margin-top: 20px; background: #fff5f4; border: 1px solid #ffd4d1; border-radius: 8px; padding: 14px 18px; display: flex; gap: 40px; }
            .sum-label { font-size: 11px; color: #888; }
            .sum-value { font-size: 16px; font-weight: 700; color: #E85D54; }
            .footer { margin-top: 24px; font-size: 11px; color: #bbb; text-align: center; }
          </style>
        </head>
        <body>
          <div class="brand">I-SHELF</div>
          <div class="subtitle">Author Transaction Report</div>
          <hr style="border:none;border-top:1px solid #f0f0f0;margin:12px 0"/>
          <h2>${title}</h2>
          <div class="meta">Generated on ${generatedOn} &nbsp;·&nbsp; ${total} total sale${total !== 1 ? "s" : ""} (showing ${transactions.length})</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Reader</th>
                <th>Book</th>
                <th>You Earned</th>
                <th>Reader Paid</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="summary">
            <div>
              <div class="sum-label">Total You Earned</div>
              <div class="sum-value">₦${totalEarned.toLocaleString()}</div>
            </div>
            <div>
              <div class="sum-label">Total Readers Paid</div>
              <div class="sum-value" style="color:#444">₦${totalPaid.toLocaleString()}</div>
            </div>
            <div>
              <div class="sum-label">Transactions Shown</div>
              <div class="sum-value" style="color:#444">${transactions.length}</div>
            </div>
          </div>
          <div class="footer">I-Shelf · This report was generated automatically · For disputes contact support</div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Save or share your transaction report",
        UTI: "com.adobe.pdf",
      });
    } catch (err) {
      Alert.alert("Error", "Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <BookCover uri={item.bookCover} style={styles.bookCover} />
      <View style={styles.cardBody}>
        <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
        <View style={styles.readerRow}>
          <Ionicons name="person-circle-outline" size={14} color="#888" />
          <Text style={styles.readerName}>{item.readerName}</Text>
        </View>
        <View style={styles.amountRow}>
          <View style={styles.amountBlock}>
            <Text style={styles.amountLabel}>You earned</Text>
            <Text style={styles.amountEarned}>₦{item.authorEarnings.toLocaleString()}</Text>
          </View>
          <View style={styles.amountBlock}>
            <Text style={styles.amountLabel}>Reader paid</Text>
            <Text style={styles.amountPaid}>₦{item.amountPaid.toLocaleString()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardMeta}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Text style={styles.timeText}>{formatTime(item.date)}</Text>
        <View style={styles.paidBadge}>
          <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
          <Text style={styles.paidText}>Paid</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#E85D54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity
          style={styles.pdfButton}
          onPress={downloadAsPDF}
          disabled={downloading || transactions.length === 0}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#E85D54" />
          ) : (
            <Ionicons name="download-outline" size={22} color={transactions.length === 0 ? "#ccc" : "#E85D54"} />
          )}
        </TouchableOpacity>
      </View>

      {/* Book filter */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowBookPicker((v) => !v)}
        >
          <Ionicons name="filter" size={16} color="#E85D54" />
          <Text style={styles.filterLabel} numberOfLines={1}>
            {selectedBookTitle ? selectedBookTitle : "All Books"}
          </Text>
          <Ionicons
            name={showBookPicker ? "chevron-up" : "chevron-down"}
            size={14}
            color="#888"
          />
        </TouchableOpacity>
        {total > 0 && (
          <Text style={styles.totalLabel}>
            {total} sale{total !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {/* Book picker dropdown */}
      {showBookPicker && (
        <View style={styles.pickerDropdown}>
          <TouchableOpacity style={styles.pickerItem} onPress={() => selectBook(null)}>
            <Text style={[styles.pickerText, !selectedBookId && styles.pickerSelected]}>
              All Books
            </Text>
            {!selectedBookId && <Ionicons name="checkmark" size={16} color="#E85D54" />}
          </TouchableOpacity>
          {books.map((b) => (
            <TouchableOpacity key={b.id} style={styles.pickerItem} onPress={() => selectBook(b)}>
              <Text
                style={[styles.pickerText, selectedBookId === b.id && styles.pickerSelected]}
                numberOfLines={1}
              >
                {b.title}
              </Text>
              {selectedBookId === b.id && <Ionicons name="checkmark" size={16} color="#E85D54" />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E85D54" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={64} color="#ddd" />
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptyText}>
            {selectedBookId
              ? "No sales found for this book."
              : "Your book sale records will appear here once readers start purchasing."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#E85D54" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#E85D54" },
  pdfButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F4",
    borderWidth: 1,
    borderColor: "#FFD4D1",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF5F4",
    borderWidth: 1,
    borderColor: "#FFD4D1",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    maxWidth: "70%",
  },
  filterLabel: { fontSize: 13, color: "#333", fontWeight: "500", flex: 1 },
  totalLabel: { fontSize: 13, color: "#888", fontWeight: "500" },
  pickerDropdown: {
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 50,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  pickerText: { fontSize: 14, color: "#333", flex: 1 },
  pickerSelected: { color: "#E85D54", fontWeight: "600" },
  list: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  bookCover: { width: 52, height: 70, borderRadius: 8 },
  cardBody: { flex: 1, gap: 4 },
  bookTitle: { fontSize: 13, fontWeight: "700", color: "#111" },
  readerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  readerName: { fontSize: 12, color: "#555" },
  amountRow: { flexDirection: "row", gap: 16, marginTop: 4 },
  amountBlock: { gap: 1 },
  amountLabel: { fontSize: 10, color: "#999" },
  amountEarned: { fontSize: 14, fontWeight: "700", color: "#16a34a" },
  amountPaid: { fontSize: 13, fontWeight: "600", color: "#444" },
  cardMeta: { alignItems: "flex-end", justifyContent: "space-between" },
  dateText: { fontSize: 11, color: "#888" },
  timeText: { fontSize: 10, color: "#bbb" },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  paidText: { fontSize: 10, color: "#16a34a", fontWeight: "600" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  loadingText: { fontSize: 14, color: "#999", marginTop: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#333", textAlign: "center" },
  emptyText: { fontSize: 14, color: "#999", textAlign: "center", lineHeight: 20 },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
});
