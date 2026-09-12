"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Shuffle, ArrowDownAZ, Clock3, Mic2 } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SongRow } from "@/components/cards/SongCard";

const SORTS = [
  { key: "recent", label: "Terbaru", icon: Clock3 },
  { key: "az", label: "A-Z", icon: ArrowDownAZ },
];

export default function LikedPage() {
  const liked = useLibraryStore((s) => s.liked);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const [sort, setSort] = useState("recent");

  const sorted = useMemo(() => {
    if (sort === "az") return [...liked].sort((a, b) => a.title.localeCompare(b.title));
    return liked;
  }, [liked, sort]);

  const uniqueArtists = useMemo(() => new Set(liked.map((t) => t.artist || "Unknown")).size, [liked]);

  return (
    <main className="px-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[28px] p-7 mb-4 relative overflow-hidden border border-white/10"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(236,72,153,0.28))" }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl float-y" />
        <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-black/20 blur-3xl" />
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-4 ring-1 ring-white/20">
            <Heart className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="font-display text-[26px] font-bold text-white">Lagu Disukai</h1>
          <p className="text-sm text-white/70 mt-1">{liked.length} lagu tersimpan</p>

          {liked.length > 0 && (
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => playTrack(sorted[0], sorted)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold active:scale-90 transition-transform shadow-glow"
              >
                <Play className="w-4 h-4" fill="black" /> Putar
              </button>
              <button
                onClick={() => playTrack(liked[Math.floor(Math.random() * liked.length)], liked)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-medium active:scale-90 transition-transform"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {liked.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-10 h-10 mx-auto mb-3 text-white/20" />
          <p className="text-white/35 text-sm">Belum ada lagu yang disukai. Ketuk ikon hati saat memutar lagu.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className="glass rounded-2xl p-3.5 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-soft shrink-0">
                <Mic2 className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white leading-tight">{uniqueArtists}</p>
                <p className="text-[10.5px] text-white/40 leading-tight">Artis berbeda</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-3.5 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-soft shrink-0">
                <Heart className="w-4 h-4" fill="currentColor" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white leading-tight">{liked.length}</p>
                <p className="text-[10.5px] text-white/40 leading-tight">Total lagu</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/40">Urutkan</p>
            <div className="flex gap-1.5">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={
                    sort === s.key
                      ? "flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white text-black transition-transform active:scale-90"
                      : "flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/60 glass transition-transform active:scale-90"
                  }
                >
                  <s.icon className="w-3 h-3" /> {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0.5 pb-4">
            {sorted.map((t) => (
              <SongRow key={t.videoId} track={t} queue={sorted} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
