import axios, { type AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { ApiError } from "@/types/api";

// Get base URL from environment or use platform-specific defaults
const getBaseURL = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Android emulator uses 10.0.2.2 to access host machine's localhost
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000/api/v1";
  }
  
  // iOS simulator and web can use localhost
  return "http://localhost:4000/api/v1";
};

const baseURL = getBaseURL();

// Log the API URL being used (helpful for debugging)
if (__DEV__) {
  console.log(`[API] Using base URL: ${baseURL}`);
}

const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
      if (refresh) {
        try {
          const { data } = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
            `${baseURL}/auth/refresh`,
            { refreshToken: refresh }
          );
          if (data?.data?.accessToken) {
            await SecureStore.setItemAsync(TOKEN_KEY, data.data.accessToken);
            if (data.data.refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, data.data.refreshToken);
            original.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(original);
          }
        } catch (_) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_KEY);
          if (original.url && !original.url.includes("/auth/")) {
            err._redirectLogin = true;
          }
        }
      }
    }
    return Promise.reject(err);
  }
);

export function getApiError(err: unknown): string {
  const axiosError = err as { 
    response?: { data?: ApiError }; 
    code?: string;
    message?: string;
  };
  
  // Handle API error responses
  if (axiosError.response?.data && !axiosError.response.data.success && axiosError.response.data.error) {
    return axiosError.response.data.error.message;
  }
  
  // Handle network errors
  if (axiosError.code === "ECONNREFUSED" || axiosError.code === "ERR_NETWORK" || axiosError.message?.includes("Network Error")) {
    return `Tidak dapat terhubung ke server. Pastikan backend berjalan di ${baseURL.replace("/api/v1", "")}`;
  }
  
  if (axiosError.code === "ETIMEDOUT") {
    return "Request timeout. Periksa koneksi internet Anda.";
  }
  
  return axiosError.message || "Terjadi kesalahan";
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
