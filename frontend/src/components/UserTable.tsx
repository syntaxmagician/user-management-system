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

  // Helper to get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 4;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 2) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - 1) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = page - 1; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {deleteError && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {deleteError}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Password</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const nameParts = u.name.split(" ");
              const firstName = nameParts[0] || "";
              const lastName = nameParts.slice(1).join(" ") || "";
              return (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-700">
                          {getInitials(u.name)}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{u.email}</td>
                  <td className="px-4 py-4 text-gray-600">••••••••••</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        className="transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="#893976" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u.id}
                        className="transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="#893976" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            ‹
          </button>
          {getPageNumbers().map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => typeof p === "number" && onPageChange(p)}
              disabled={typeof p !== "number"}
              className={`px-3 py-1.5 border rounded transition-colors ${
                p === page
                  ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
