"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Music2, Sparkles, Heart, ListMusic, LogOut, LogIn, UserPlus, ChevronRight, ShieldCheck } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import InstallAppButton from "@/components/InstallAppButton";

export default function ProfilePage() {
  const liked = useLibraryStore((s) => s.liked);
  const playlists = useLibraryStore((s) => s.playlists);
  const recent = useLibraryStore((s) => s.recent);
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);
  const showToast = useUIStore((s) => s.showToast);

  const initials = (user?.displayName || user?.username || "?").slice(0, 2).toUpperCase();

  return (
    <main className="px-4 pt-8 pb-6">
      <div className="flex flex-col items-center text-center mb-6">
        {user ? (
          <div className="w-20 h-20 rounded-full bg-accent-gradient flex items-center justify-center text-xl font-bold text-white shadow-glow mb-3">
            {initials}
          </div>
        ) : (
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden border border-white/10 shadow-glow mb-3">
            <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized />
          </div>
        )}

        {user ? (
          <>
            <h1 className="font-display text-xl font-bold text-white">{user.displayName || user.username}</h1>
            <p className="text-xs text-white/40 mt-0.5">@{user.username}</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-metallic">ucamusic</h1>
            <p className="text-sm text-white/45 mt-1 max-w-xs">Masuk untuk menyimpan lagu disukai & playlist di semua perangkatmu.</p>
          </>
        )}
      </div>

      {status !== "loading" && !user && (
        <div className="flex gap-2 mb-7">
          <Link href="/login" className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold py-2.5 rounded-full active:scale-95 transition-transform">
            <LogIn className="w-4 h-4" /> Masuk
          </Link>
          <Link href="/register" className="flex-1 flex items-center justify-center gap-2 glass text-white text-sm font-medium py-2.5 rounded-full active:scale-95 transition-transform">
            <UserPlus className="w-4 h-4" /> Daftar
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="glass rounded-2xl p-4 text-center">
          <Heart className="w-5 h-5 mx-auto mb-1.5 text-accent-pink" />
          <p className="text-lg font-bold text-white">{liked.length}</p>
          <p className="text-[11px] text-white/40">Disukai</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <ListMusic className="w-5 h-5 mx-auto mb-1.5 text-accent-soft" />
          <p className="text-lg font-bold text-white">{playlists.length}</p>
          <p className="text-[11px] text-white/40">Playlist</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Music2 className="w-5 h-5 mx-auto mb-1.5 text-accent-amber" />
          <p className="text-lg font-bold text-white">{recent.length}</p>
          <p className="text-[11px] text-white/40">Riwayat</p>
        </div>
      </div>

      {user && (
        <div className="mb-4">
          {[
            { href: "/liked", label: "Lagu Disukai", icon: Heart },
            { href: "/library", label: "Playlist Saya", icon: ListMusic },
            ...(user.role === "admin" ? [{ href: "/admin", label: "Admin Panel", icon: ShieldCheck }] : []),
          ].map((item) => (
            <Link key={item.href} href={item.href} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors">
              <item.icon className="w-[18px] h-[18px] text-white/60" />
              <span className="flex-1 text-sm text-white font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-white/30" />
            </Link>
          ))}
          <button
            onClick={async () => {
              await logout();
              showToast("Berhasil keluar");
            }}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <LogOut className="w-[18px] h-[18px] text-red-400" />
            <span className="flex-1 text-sm text-red-400 font-medium">Keluar</span>
          </button>
        </div>
      )}

      <div className="mb-4">
        <InstallAppButton />
      </div>

      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-soft" />
          <h2 className="text-sm font-semibold text-white">Tentang ucamusic</h2>
        </div>
        <p className="text-[13px] text-white/50 leading-relaxed">
          ucamusic dibangun dengan Next.js, React, dan Tailwind CSS, dan dirancang untuk berjalan mulus di Vercel. Semua data lagu diambil
          secara real-time, tanpa iklan.
        </p>
      </div>

      <p className="text-center text-[11px] text-white/25 mt-6">ucamusic v1.0 · dibuat dengan ♥</p>
    </main>
  );
}
