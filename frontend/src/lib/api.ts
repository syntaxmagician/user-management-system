import axios, { type AxiosInstance } from "axios";
import type { ApiError } from "@/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        try {
          const { data } = await axios.post<{ data: { accessToken: string } }>(`${baseURL}/auth/refresh`, {
            refreshToken: refresh,
          });
          if (data?.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
            original.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(original);
          }
        } catch (_) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (typeof window !== "undefined") window.location.href = "/login";
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
