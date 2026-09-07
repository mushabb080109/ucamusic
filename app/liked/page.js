"use client";
import { Heart, Play, Shuffle } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SongRow } from "@/components/cards/SongCard";

export default function LikedPage() {
  const liked = useLibraryStore((s) => s.liked);
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <main className="px-4 pt-8">
      <div
        className="rounded-3xl p-6 mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.25))" }}
      >
        <Heart className="w-9 h-9 text-white mb-3" fill="white" />
        <h1 className="font-display text-2xl font-bold text-white">Lagu Disukai</h1>
        <p className="text-sm text-white/70 mt-1">{liked.length} lagu tersimpan</p>

        {liked.length > 0 && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => playTrack(liked[0], liked)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4" fill="black" /> Putar
            </button>
            <button
              onClick={() => playTrack(liked[Math.floor(Math.random() * liked.length)], liked)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass text-white text-sm font-medium active:scale-95 transition-transform"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {liked.length === 0 ? (
        <p className="text-center text-white/35 text-sm py-10">Belum ada lagu yang disukai. Ketuk ikon hati saat memutar lagu.</p>
      ) : (
        <div className="space-y-0.5 pb-4">
          {liked.map((t) => (
            <SongRow key={t.videoId} track={t} queue={liked} />
          ))}
        </div>
      )}
    </main>
  );
}
