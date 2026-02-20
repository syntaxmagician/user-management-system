import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, getApiError, clearTokens } from "@/lib/api";
import type { User } from "@/types/api";
import type { ApiSuccess } from "@/types/api";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    api
      .get<ApiSuccess<User>>(`/users/${id}`)
      .then(({ data }) => {
        if (!cancelled && data.success) setUser(data.data);
      })
      .catch((err: unknown) => {
        const e = err as { _redirectLogin?: boolean };
        if (e._redirectLogin) {
          clearTokens().then(() => router.replace("/login"));
          return;
        }
        if (!cancelled) setError(getApiError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, router]);

  const handleDelete = () => {
    if (!id || !user) return;
    Alert.alert("Hapus User", `Hapus "${user.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await api.delete(`/users/${id}`);
            router.replace("/(app)");
          } catch (err: unknown) {
            const e = err as { _redirectLogin?: boolean };
            if (e._redirectLogin) {
              await clearTokens();
              router.replace("/login");
            } else setError(getApiError(err));
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "User tidak ditemukan."}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}>
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Tanggal Dibuat</Text>
        <Text style={styles.value}>{new Date(user.createdAt).toLocaleDateString("id-ID")}</Text>
        <TouchableOpacity
          style={[styles.deleteBtn, deleting && styles.deleteBtnDisabled]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.deleteBtnText}>Hapus User</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 24 },
  containerTablet: { padding: 24, maxWidth: 500, alignSelf: "center", width: "100%" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTablet: { maxWidth: 500, alignSelf: "center", width: "100%" },
  label: { fontSize: 12, fontWeight: "600", color: "#64748b", marginTop: 16, marginBottom: 4 },
  value: { fontSize: 16, color: "#1e293b" },
  deleteBtn: {
    marginTop: 24,
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtnDisabled: { opacity: 0.6 },
  deleteBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { marginTop: 12, color: "#64748b" },
  errorText: { color: "#b91c1c", textAlign: "center", marginBottom: 16 },
  backBtn: { padding: 12 },
  backBtnText: { color: "#2563eb", fontWeight: "600" },
});
