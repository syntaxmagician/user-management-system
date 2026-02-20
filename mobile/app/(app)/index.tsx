import { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { api, getApiError, clearTokens } from "@/lib/api";
import type { User } from "@/types/api";
import type { ApiListSuccess } from "@/types/api";
import { useNetInfo } from "@/hooks/useNetInfo";

const LIMIT = 15;
const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function UserListScreen() {
  const router = useRouter();
  const isOnline = useNetInfo();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!isOnline) {
        setError("Perangkat offline. Periksa koneksi internet.");
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        return;
      }
      setError(null);
      if (pageNum === 1 && !append) setLoading(true);
      else if (append) setLoadingMore(true);
      try {
        const { data } = await api.get<ApiListSuccess<User>>("/users", {
          params: { page: pageNum, limit: LIMIT },
        });
        if (data.success) {
          if (append) setUsers((prev) => [...prev, ...data.data]);
          else setUsers(data.data);
          setTotalPages(data.meta.totalPages);
        }
      } catch (err: unknown) {
        const e = err as { _redirectLogin?: boolean };
        if (e._redirectLogin) {
          await clearTokens();
          router.replace("/login");
          return;
        }
        setError(getApiError(err));
        if (!append) setUsers([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [isOnline, router]
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  const onEndReached = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next, true);
  }, [page, totalPages, loading, loadingMore, fetchPage]);

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity
        style={[styles.row, isTablet && styles.rowTablet]}
        onPress={() => router.push({ pathname: "/(app)/user/[id]", params: { id: item.id } })}
        activeOpacity={0.7}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
        </View>
        <Text style={styles.chevron}>&#8250;</Text>
      </TouchableOpacity>
    ),
    [router, isTablet]
  );

  const keyExtractor = useCallback((item: User) => item.id, []);

  if (!isOnline && users.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.offlineTitle}>Tidak ada koneksi</Text>
        <Text style={styles.offlineText}>Periksa koneksi internet Anda dan tarik untuk menyegarkan.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Coba lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <Text style={styles.headerTitle}>Daftar User</Text>
        <TouchableOpacity onPress={async () => { await clearTokens(); router.replace("/login"); }} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
      {error && !loading ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchPage(1, false)}>
            <Text style={styles.retryText}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {loading && users.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Belum ada user.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[styles.list, isTablet && styles.listTablet]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563eb"]} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ padding: 16 }} color="#2563eb" /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTablet: { paddingHorizontal: 24, paddingVertical: 18 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  logoutBtn: { padding: 8 },
  logoutText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  list: { padding: 16, paddingBottom: 32 },
  listTablet: { padding: 24, maxWidth: 600, alignSelf: "center", width: "100%" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rowTablet: { maxWidth: 600, alignSelf: "center", width: "100%" },
  rowContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  email: { fontSize: 14, color: "#64748b", marginTop: 2 },
  chevron: { fontSize: 20, color: "#94a3b8", marginLeft: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { marginTop: 12, color: "#64748b" },
  emptyText: { color: "#64748b", fontSize: 16 },
  offlineTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b", marginBottom: 8 },
  offlineText: { color: "#64748b", textAlign: "center", marginBottom: 16 },
  retryButton: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  errorBox: { padding: 16, backgroundColor: "#fef2f2", margin: 16, borderRadius: 8 },
  errorText: { color: "#b91c1c", marginBottom: 8 },
});
