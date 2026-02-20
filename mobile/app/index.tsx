import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => {
      if (token) router.replace("/(app)");
      else router.replace("/login");
    });
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={{ marginTop: 12, color: "#64748b" }}>Memuat...</Text>
    </View>
  );
}
