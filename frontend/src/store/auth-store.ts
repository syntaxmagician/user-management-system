import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (access, refresh) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", access);
          localStorage.setItem("refreshToken", refresh);
        }
        set({ accessToken: access, refreshToken: refresh });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({ accessToken: null, refreshToken: null });
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    { name: "auth-storage" }
  )
);
