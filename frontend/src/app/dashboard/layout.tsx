"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";
import type { User } from "@/types/api";
import type { ApiSuccess } from "@/types/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken === null && typeof window !== "undefined") {
      const stored = localStorage.getItem("accessToken");
      if (!stored) router.replace("/login");
    }
  }, [accessToken, router]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Get first user from list as current user (in real app, you'd have a /me endpoint)
        const { data } = await api.get<ApiSuccess<User[]>>("/users", {
          params: { page: 1, limit: 1 },
        });
        if (data.success && data.data.length > 0) {
          setCurrentUser(data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken || localStorage.getItem("accessToken")) {
      fetchCurrentUser();
    }
  }, [accessToken]);

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

  // Extract first and last name from user name
  const userName = currentUser?.name || "User";
  const nameParts = userName.split(" ");
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#F8F5EE] flex flex-col h-screen sticky top-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-8 bg-yellow-400 rounded"></div>
            <h1 className="text-xl font-bold text-gray-900">CRUD OPERATIONS</h1>
          </div>

          {/* User Profile */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3 shadow-md">
              <span className="text-2xl font-bold text-white">
                {firstName.charAt(0).toUpperCase()}
                {lastName ? lastName.charAt(0).toUpperCase() : ""}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{userName}</h2>
            <p className="text-sm font-medium text-[#893976]">Admin</p>
          </div>

          {/* Home Button */}
          <Link
            href="/dashboard"
            className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              pathname === "/dashboard"
                ? "bg-[#AA80F9] text-black"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg 
              className={`w-5 h-5 ${pathname === "/dashboard" ? "text-black" : ""}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-6 pt-0">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
