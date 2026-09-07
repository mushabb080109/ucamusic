"use client";
import { useEffect, useState } from "react";
import { Search, Loader2, ShieldCheck, Shield, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = (query = q, p = page) => {
    setLoading(true);
    fetch(`/api/admin/users?q=${encodeURIComponent(query)}&page=${p}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setUsers(res.users);
          setTotalPages(res.totalPages);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(q, 1);
  };

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      }).then((r) => r.json());
      if (res.success) {
        setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)));
        showToast(`${u.username} sekarang ${newRole === "admin" ? "admin" : "member biasa"}`, { type: "success" });
      } else {
        showToast(res.message || "Gagal mengubah role", { type: "error" });
      }
    } catch (e) {
      showToast("Gagal mengubah role", { type: "error" });
    }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Hapus akun "${u.username}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" }).then((r) => r.json());
      if (res.success) {
        setUsers((list) => list.filter((x) => x.id !== u.id));
        showToast("Akun dihapus", { type: "success" });
      } else {
        showToast(res.message || "Gagal menghapus", { type: "error" });
      }
    } catch (e) {
      showToast("Gagal menghapus", { type: "error" });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-5">Member</h1>

      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-5 max-w-sm">
        <div className="flex items-center gap-2 glass rounded-xl px-3.5 py-2.5 flex-1">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari username..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/35"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold shrink-0">
          Cari
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/40 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Memuat...
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-white/35 text-sm py-10">Tidak ada member ditemukan.</p>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 last:border-0">
              <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
                {(u.displayName || u.username).slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{u.displayName || u.username}</p>
                <p className="text-xs text-white/40 truncate">
                  @{u.username} · {u.likedCount} disukai · {u.playlistsCount} playlist
                </p>
              </div>
              {u.role === "admin" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 shrink-0">ADMIN</span>}
              <button
                onClick={() => toggleRole(u)}
                disabled={u.id === currentUser?.id}
                title={u.role === "admin" ? "Turunkan jadi member" : "Jadikan admin"}
                className="p-2 text-white/40 hover:text-white shrink-0 disabled:opacity-30"
              >
                {u.role === "admin" ? <Shield className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </button>
              <button
                onClick={() => deleteUser(u)}
                disabled={u.id === currentUser?.id}
                className="p-2 text-white/40 hover:text-red-400 shrink-0 disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-full glass text-white/60 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/50">
            Halaman {page} / {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 rounded-full glass text-white/60 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
