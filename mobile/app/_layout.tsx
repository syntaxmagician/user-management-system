import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/auth-store";
import { clearTokens } from "@/lib/api";

export default function RootLayout() {
  const [checked, setChecked] = useState(false);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then(() => {
      setHydrated();
      setChecked(true);
    });
  }, [setHydrated]);

  if (!checked) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
