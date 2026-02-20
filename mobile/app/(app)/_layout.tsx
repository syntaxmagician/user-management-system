import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="user/[id]"
        options={{
          title: "Detail User",
          headerBackTitle: "Kembali",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
