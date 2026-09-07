"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Heart, ListMusic, UserPlus, ShieldCheck, Wrench, Megaphone, ArrowRight } from "lucide-react";

function StatCard({ icon: Icon, iconClass, label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconClass}`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="font-display font-bold text-xl text-white">{value}</div>
      {sub && <div className="text-[11px] text-white/35 mt-1">{sub}</div>}
    </div>
  );
}

function QuickLink({ href, icon: Icon, iconClass, label, sub }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 hover:border-accent-soft/30 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm text-white">{label}</div>
        <div className="text-xs text-white/40">{sub}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-white/25 shrink-0" />
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
        else setError(res.message || "Gagal memuat data.");
      })
      .catch(() => setError("Gagal memuat data."))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm p-4">{error}</div>;
  }

  const s = data.stats;

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">{todayStr} · Ringkasan aktivitas ucamusic.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} iconClass="bg-sky-500/15 text-sky-400" label="Total Pengguna" value={s.totalUsers} sub={`+${s.newUsersToday} hari ini`} />
        <StatCard icon={ShieldCheck} iconClass="bg-violet-500/15 text-violet-400" label="Admin Aktif" value={s.totalAdmins} />
        <StatCard icon={Heart} iconClass="bg-pink-500/15 text-pink-400" label="Total Lagu Disukai" value={s.totalLiked} sub="Gabungan semua pengguna" />
        <StatCard icon={ListMusic} iconClass="bg-amber-500/15 text-amber-400" label="Total Playlist" value={s.totalPlaylists} sub="Dibuat pengguna" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <QuickLink href="/admin/users" icon={UserPlus} iconClass="bg-sky-500/15 text-sky-400" label="Kelola Member" sub="Lihat & atur peran pengguna" />
        <QuickLink href="/admin/settings" icon={Wrench} iconClass="bg-orange-500/15 text-orange-400" label="Pengaturan Situs" sub="Branding, pemeliharaan, pengumuman" />
      </div>

      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Status Sistem</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60 flex items-center gap-2"><Wrench className="w-4 h-4" /> Mode Pemeliharaan</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.maintenanceMode ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
              {s.maintenanceMode ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Pendaftaran Baru</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.registerEnabled ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {s.registerEnabled ? "Dibuka" : "Ditutup"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60 flex items-center gap-2"><Megaphone className="w-4 h-4" /> Banner Pengumuman</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.announcementEnabled ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/40"}`}>
              {s.announcementEnabled ? "Tampil" : "Sembunyi"}
            </span>
          </div>
        </div>
      </div>

      {data.recentUsers?.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Member Terbaru</h2>
          <div className="space-y-3">
            {data.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{u.displayName || u.username}</p>
                  <p className="text-xs text-white/40">@{u.username}</p>
                </div>
                {u.role === "admin" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 shrink-0">ADMIN</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
