"use client";

import { useState } from "react";
import { api, getApiError } from "@/lib/api";
import type { User } from "@/types/api";

interface UserTableProps {
  users: User[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDeleted: () => void;
}

export function UserTable({ users, page, totalPages, total, onPageChange, onEdit, onDeleted }: UserTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (user: User) => {
    if (!confirm(`Hapus user "${user.name}"?`)) return;
    setDeletingId(user.id);
    setDeleteError(null);
    try {
      await api.delete(`/users/${user.id}`);
      onDeleted();
    } catch (err) {
      setDeleteError(getApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {deleteError && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {deleteError}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Nama</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Tanggal Dibuat</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">
                  {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(u)}
                    className="text-primary-600 hover:underline mr-3 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(u)}
                    disabled={deletingId === u.id}
                    className="text-red-600 hover:underline font-medium disabled:opacity-50"
                  >
                    {deletingId === u.id ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Menampilkan {(page - 1) * users.length + 1}–{Math.min(page * users.length, total)} dari {total}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
