"use client";
import Image from "next/image";
import { Music2, Sparkles, Heart, ListMusic, Clock, Trash2, Github } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useUIStore } from "@/store/useUIStore";
import InstallAppButton from "@/components/InstallAppButton";

export default function ProfilePage() {
  const liked = useLibraryStore((s) => s.liked);
  const playlists = useLibraryStore((s) => s.playlists);
  const recent = useLibraryStore((s) => s.recent);
  const showToast = useUIStore((s) => s.showToast);

  const clearHistory = () => {
    if (!window.confirm("Hapus semua riwayat putar lagu?")) return;
    useLibraryStore.setState({ recent: [] });
    showToast("Riwayat berhasil dihapus");
  };

  return (
    <main className="px-4 lg:px-8 pt-8 pb-6 max-w-2xl">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative w-20 h-20 rounded-3xl overflow-hidden border border-white/10 shadow-glow mb-3">
          <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized />
        </div>
        <h1 className="font-display text-2xl font-bold text-metallic">ucamusic</h1>
        <p className="text-sm text-white/45 mt-1 max-w-xs">Streaming musik gratis, tanpa iklan, dan tanpa perlu akun. Semua data lagu tersimpan langsung di perangkatmu.</p>
      </div>

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

      <div className="mb-4">
        <InstallAppButton />
        {recent.length > 0 && (
          <button
            onClick={clearHistory}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <Trash2 className="w-[18px] h-[18px] text-red-400" />
            <span className="flex-1 text-sm text-red-400 font-medium">Hapus Riwayat Putar</span>
          </button>
        )}
      </div>

      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-soft" />
          <h2 className="text-sm font-semibold text-white">Tentang ucamusic</h2>
        </div>
        <p className="text-[13px] text-white/50 leading-relaxed">
          ucamusic dibangun dengan Next.js, React, dan Tailwind CSS, dirancang untuk berjalan mulus di Vercel. Semua data
          lagu diambil secara real-time — tanpa iklan, tanpa akun, tanpa ribet. Lagu disukai, playlist, dan riwayat
          putarmu tersimpan lokal di perangkat ini.
        </p>
      </div>

      <p className="text-center text-[11px] text-white/25 mt-6 flex items-center justify-center gap-1.5">
        <Github className="w-3 h-3" /> ucamusic v6 · dibuat dengan ♥
      </p>
    </main>
  );
}
