import axios, { type AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import type { ApiError } from "@/types/api";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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
  const data = (err as { response?: { data?: ApiError } })?.response?.data;
  if (data && !data.success && data.error) return data.error.message;
  return (err as Error)?.message || "Terjadi kesalahan";
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
