"use client";
import Image from "next/image";
import { Play, Pause, SkipForward, SkipBack, Heart } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { proxyImage, cx } from "@/lib/format";

export default function MiniPlayer() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const openFullPlayer = usePlayerStore((s) => s.openFullPlayer);
  const isLiked = useLibraryStore((s) => s.isLiked);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  if (!currentTrack) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.videoId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-md sm:max-w-lg px-2 pb-2">
        <button
          onClick={openFullPlayer}
          className="w-full glass-dock rounded-2xl overflow-hidden shadow-dock text-left relative active:scale-[0.99] transition-transform"
        >
          <div className="absolute top-0 left-0 h-[2px] bg-accent-gradient transition-all" style={{ width: `${progress}%` }} />
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-white/5">
              {currentTrack.thumbnail && (
                <Image src={proxyImage(currentTrack.thumbnail)} alt={currentTrack.title} fill sizes="44px" className="object-cover" unoptimized />
              )}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-white truncate">{currentTrack.title}</p>
              <p className="text-[11.5px] text-white/45 truncate">{currentTrack.artist || "Unknown"}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(currentTrack); }}
              className="p-2 text-white/60 hover:text-accent-pink shrink-0"
            >
              <Heart className={cx("w-[18px] h-[18px]", liked && "fill-accent-pink text-accent-pink")} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="p-2 text-white/80 hover:text-white shrink-0 hidden xs:inline-flex">
              <SkipBack className="w-[18px] h-[18px]" fill="currentColor" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" fill="black" /> : <Play className="w-4 h-4 ml-0.5" fill="black" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="p-2 text-white/80 hover:text-white shrink-0">
              <SkipForward className="w-[18px] h-[18px]" fill="currentColor" />
            </button>
          </div>
        </button>
      </div>
    </div>
  );
}
