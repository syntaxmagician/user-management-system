import { create } from "zustand";

interface AuthState {
  isHydrated: boolean;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  setHydrated: () => set({ isHydrated: true }),
  logout: () => {},
}));
