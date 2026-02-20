"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api, getApiError } from "@/lib/api";
import type { User } from "@/types/api";
import type { ApiListSuccess } from "@/types/api";
import { UserTable } from "@/components/UserTable";
import { UserTableSkeleton } from "@/components/UserTableSkeleton";
import { UserModal } from "@/components/UserModal";
import { EmptyState } from "@/components/EmptyState";

const LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 500; // 500ms debounce delay

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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If empty, search immediately
    if (!value.trim()) {
      setSearch("");
      setPage(1);
      return;
    }

    // Set up debounced search
    debounceTimerRef.current = setTimeout(() => {
      setSearch(value.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
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
        <h1 className="text-3xl font-bold text-gray-900">User List</h1>
        <button
          type="button"
          onClick={() => setModal("create")}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors"
        >
          ADD USER
        </button>
      </div>

      {/* Filter and Search - Single Container */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Add Filter Dropdown */}
          <button
            type="button"
            onClick={() => {
              // TODO: Implement filter dropdown
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <span className="text-sm">Add filter</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200"></div>

          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for a student by name or email"
                className="w-full pl-9 pr-4 py-2 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
              />
            </form>
          </div>
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
