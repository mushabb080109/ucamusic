"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Play, ListMusic, X } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SongRow } from "@/components/cards/SongCard";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const playlists = useLibraryStore((s) => s.playlists);
  const removeFromPlaylist = useLibraryStore((s) => s.removeFromPlaylist);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <main className="px-4 pt-10 text-center text-white/40">
        <p className="text-sm">Playlist tidak ditemukan.</p>
        <button onClick={() => router.push("/library")} className="mt-3 text-xs text-accent-soft underline">
          Kembali ke Koleksi
        </button>
      </main>
    );
  }

  return (
    <main className="px-4 pt-10">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-4 active:scale-95 transition-transform">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/30 to-white/5 flex items-center justify-center shrink-0 ring-1 ring-white/10 shadow-glow">
          <ListMusic className="w-8 h-8 text-white/60" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold text-white truncate">{playlist.name}</h1>
          <p className="text-xs text-white/45">{playlist.tracks.length} lagu</p>
        </div>
      </motion.div>

      {playlist.tracks.length > 0 && (
        <button
          onClick={() => playTrack(playlist.tracks[0], playlist.tracks)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold mb-5 active:scale-90 transition-transform shadow-glow"
        >
          <Play className="w-4 h-4" fill="black" /> Putar Semua
        </button>
      )}

      {playlist.tracks.length === 0 ? (
        <p className="text-center text-white/35 text-sm py-10">Playlist ini masih kosong. Tambahkan lagu dari halaman pencarian.</p>
      ) : (
        <div className="space-y-0.5">
          {playlist.tracks.map((t) => (
            <div key={t.videoId} className="flex items-center gap-1">
              <div className="flex-1 min-w-0">
                <SongRow track={t} queue={playlist.tracks} />
              </div>
              <button onClick={() => removeFromPlaylist(playlist.id, t.videoId)} className="p-2 text-white/25 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
