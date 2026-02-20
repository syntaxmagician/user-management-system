"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (accessToken === null && typeof window !== "undefined") {
      const stored = localStorage.getItem("accessToken");
      if (!stored) router.replace("/login");
    }
  }, [accessToken, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (accessToken === null && typeof window !== "undefined") {
    const stored = localStorage.getItem("accessToken");
    if (!stored) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Memuat...</div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`font-medium ${pathname === "/dashboard" ? "text-primary-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              Dashboard
            </Link>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            Keluar
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
