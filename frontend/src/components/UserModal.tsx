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

const defaultForm = { email: "", name: "", password: "" };

export function UserModal({ mode, user, onClose, onSuccess }: UserModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && user) {
      setForm({ email: user.email, name: user.name, password: "" });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [mode, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !form.name.trim()) {
      setError("Email dan nama wajib diisi.");
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
      if (mode === "create") {
        await api.post("/users", { email: form.email.trim(), name: form.name.trim(), password: form.password });
      } else if (user) {
        const body: { email: string; name: string; password?: string } = {
          email: form.email.trim(),
          name: form.name.trim(),
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
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {mode === "create" ? "Tambah User" : "Edit User"}
        </h2>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="nama@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Nama Lengkap"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password {mode === "edit" && "(kosongkan jika tidak mengubah)"}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder={mode === "create" ? "Min. 8 karakter" : "••••••••"}
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
            >
              {loading ? "Memproses..." : mode === "create" ? "Simpan" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
