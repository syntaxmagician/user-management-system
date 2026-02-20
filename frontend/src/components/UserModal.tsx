"use client";

import { useState, useEffect } from "react";
import { api, getApiError } from "@/lib/api";
import type { User } from "@/types/api";

interface UserModalProps {
  mode: "create" | "edit";
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultForm = { firstName: "", lastName: "", email: "", password: "" };

export function UserModal({ mode, user, onClose, onSuccess }: UserModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (mode === "edit" && user) {
      // Split name into first and last name
      const nameParts = user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      setForm({ 
        firstName, 
        lastName, 
        email: user.email, 
        password: "" 
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
    setShowPassword(false);
  }, [mode, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setError("Format email tidak valid.");
      return;
    }
    if (mode === "create" && form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (mode === "edit" && form.password && form.password.length < 8) {
      setError("Password minimal 8 karakter (kosongkan jika tidak mengubah).");
      return;
    }
    setLoading(true);
    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      if (mode === "create") {
        await api.post("/users", { 
          email: form.email.trim(), 
          name, 
          password: form.password 
        });
      } else if (user) {
        const body: { email: string; name: string; password?: string } = {
          email: form.email.trim(),
          name,
        };
        if (form.password) body.password = form.password;
        await api.put(`/users/${user.id}`, body);
      }
      onSuccess();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {mode === "create" ? "Create an account" : "Edit account"}
        </h2>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800"
              placeholder="First name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800"
              placeholder="Last name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800"
              placeholder="Email"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {mode === "edit" && "(kosongkan jika tidak mengubah)"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800"
                placeholder={mode === "create" ? "Password" : "••••••••"}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.906 5.69m0 0L19 19m-4-4l4 4m0 0l3 3m-3-3l3-3" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? "Memproses..." : mode === "create" ? "Save" : "Edit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
