"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ListMusic, Trash2, Clock, Heart } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { SongRow } from "@/components/cards/SongCard";

export default function LibraryPage() {
  const playlists = useLibraryStore((s) => s.playlists);
  const recent = useLibraryStore((s) => s.recent);
  const liked = useLibraryStore((s) => s.liked);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);
  const [tab, setTab] = useState("playlists");

  const tabs = [
    { key: "playlists", label: "Playlist" },
    { key: "liked", label: "Disukai" },
    { key: "recent", label: "Riwayat" },
  ];

  return (
    <main className="px-4 pt-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between mb-5">
        <h1 className="font-display text-2xl font-bold text-white">Koleksi</h1>
        <button
          onClick={() => {
            const name = window.prompt("Nama playlist baru:");
            if (name && name.trim()) createPlaylist(name.trim());
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black text-xs font-semibold active:scale-90 transition-transform shadow-glow"
        >
          <Plus className="w-3.5 h-3.5" /> Playlist
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }} className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              tab === t.key
                ? "px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-black transition-transform active:scale-90"
                : "px-4 py-1.5 rounded-full text-xs font-medium text-white/60 glass transition-transform active:scale-90"
            }
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {tab === "playlists" && (
        <>
          {playlists.length === 0 ? (
            <div className="mt-16 text-center text-white/30">
              <ListMusic className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Belum ada playlist. Buat satu untuk mulai mengoleksi lagu favoritmu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {playlists.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
                  className="relative group"
                >
                  <Link href={`/library/${p.id}`} className="block w-full aspect-square rounded-2xl bg-gradient-to-br from-accent/25 to-white/5 border border-white/5 flex items-center justify-center card-hover">
                    <ListMusic className="w-8 h-8 text-white/50" />
                  </Link>
                  <button
                    onClick={() => window.confirm(`Hapus playlist "${p.name}"?`) && deletePlaylist(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="mt-2 text-[13px] font-medium text-white truncate">{p.name}</p>
                  <p className="text-[11.5px] text-white/45 truncate">{p.tracks.length} lagu</p>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "liked" && (
        <>
          {liked.length === 0 ? (
            <div className="mt-16 text-center text-white/30">
              <Heart className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Belum ada lagu yang disukai. Ketuk ikon hati saat memutar lagu.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {liked.map((t, i) => (
                <SongRow key={t.videoId} track={t} queue={liked} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "recent" && (
        <>
          {recent.length === 0 ? (
            <div className="mt-16 text-center text-white/30">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Riwayat putar akan muncul di sini.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recent.map((t) => (
                <SongRow key={t.videoId} track={t} queue={recent} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
