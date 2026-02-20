"use client";

import { useEffect, useState, useCallback } from "react";
import { api, getApiError } from "@/lib/api";
import type { User } from "@/types/api";
import type { ApiListSuccess } from "@/types/api";
import { UserTable } from "@/components/UserTable";
import { UserTableSkeleton } from "@/components/UserTableSkeleton";
import { UserModal } from "@/components/UserModal";
import { EmptyState } from "@/components/EmptyState";

const LIMIT = 10;

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiListSuccess<User>>("/users", {
        params: { page, limit: LIMIT, search: search || undefined },
      });
      if (data.success) {
        setUsers(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      setError(getApiError(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleCreated = () => {
    setModal(null);
    fetchUsers();
  };

  const handleUpdated = () => {
    setModal(null);
    setEditingUser(null);
    fetchUsers();
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setModal("edit");
  };

  const empty = !loading && users.length === 0;
  const emptySearch = empty && !!search;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Daftar User</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama atau email..."
              className="px-3 py-2 border border-slate-300 rounded-lg w-48 sm:w-56 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Cari
            </button>
          </form>
          <button
            type="button"
            onClick={() => setModal("create")}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Tambah User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <UserTableSkeleton />
      ) : empty ? (
        <EmptyState
          title={emptySearch ? "Tidak ada hasil" : "Belum ada user"}
          message={
            emptySearch
              ? "Coba ubah kata kunci pencarian."
              : "Tambahkan user pertama dengan tombol \"Tambah User\"."
          }
        />
      ) : (
        <UserTable
          users={users}
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPageChange={setPage}
          onEdit={openEdit}
          onDeleted={fetchUsers}
        />
      )}

      {modal === "create" && (
        <UserModal mode="create" onClose={() => setModal(null)} onSuccess={handleCreated} />
      )}
      {modal === "edit" && editingUser && (
        <UserModal
          mode="edit"
          user={editingUser}
          onClose={() => { setModal(null); setEditingUser(null); }}
          onSuccess={handleUpdated}
        />
      )}
    </div>
  );
}
