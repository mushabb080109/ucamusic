"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Heart, ListPlus, Share2, Play, Music2 } from "lucide-react";
import { api } from "@/lib/api";
import { proxyImage, cx } from "@/lib/format";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useUIStore } from "@/store/useUIStore";

const REELS_QUERIES = ["viral tiktok songs indonesia", "top hits 2025", "trending songs indonesia", "sad indonesian songs", "party dance hits"];

function ReelItem({ track, queue, active }) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const openFullPlayer = usePlayerStore((s) => s.openFullPlayer);
  const isLiked = useLibraryStore((s) => s.isLiked);
  const toggleLike = useLibraryStore((s) => s.toggleLike);
  const openPlaylistPicker = useUIStore((s) => s.openPlaylistPicker);
  const showToast = useUIStore((s) => s.showToast);

  const isCurrent = currentTrack?.videoId === track.videoId;
  const liked = isLiked(track.videoId);

  useEffect(() => {
    if (active && !isCurrent) {
      playTrack(track, queue).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleTap = () => {
    if (isCurrent) togglePlay();
    else playTrack(track, queue);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/play/${track.videoId}` : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: track.title, text: `Dengar "${track.title}" di ucamusic`, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link disalin", { type: "success" });
      }
    } catch (e) {}
  };

  return (
    <div className="relative h-[100dvh] w-full snap-start shrink-0 overflow-hidden bg-base">
      <div className="absolute inset-0 opacity-45 blur-3xl scale-110">
        {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt="" fill className="object-cover" unoptimized />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      <button onClick={handleTap} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[78%] max-w-[340px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="360px" className="object-cover" unoptimized />}
          {isCurrent && isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          {(!isCurrent || !isPlaying) && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
              </span>
            </div>
          )}
        </div>
      </button>

      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-10">
        <button onClick={() => toggleLike(track)} className="flex flex-col items-center gap-1">
          <span className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-md flex items-center justify-center">
            <Heart className={cx("w-5 h-5", liked ? "fill-accent-pink text-accent-pink" : "text-white")} />
          </span>
        </button>
        <button onClick={() => openPlaylistPicker(track)} className="flex flex-col items-center gap-1">
          <span className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-md flex items-center justify-center">
            <ListPlus className="w-5 h-5 text-white" />
          </span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <span className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-md flex items-center justify-center">
            <Share2 className="w-[18px] h-[18px] text-white" />
          </span>
        </button>
        <button onClick={openFullPlayer} className="flex flex-col items-center gap-1">
          <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
            <Music2 className="w-5 h-5 text-black" />
          </span>
        </button>
      </div>

      <div className="absolute left-4 right-20 bottom-24 z-10">
        <p className="font-display text-lg font-bold text-white drop-shadow-md truncate">{track.title}</p>
        <p className="text-sm text-white/70 truncate mt-0.5">{track.artist || "Unknown"}</p>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [tracks, setTracks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    let live = true;
    Promise.all(REELS_QUERIES.map((q) => api.search(q, "songs").catch(() => null)))
      .then((results) => {
        if (!live) return;
        const seen = new Set();
        const all = [];
        results.forEach((res) => {
          (res?.result?.songs || []).forEach((s) => {
            if (s.videoId && !seen.has(s.videoId)) {
              seen.add(s.videoId);
              all.push(s);
            }
          });
        });
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        setTracks(all.slice(0, 30));
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex((prev) => (prev !== idx ? idx : prev));
  }, []);

  if (loading) {
    return (
      <main className="fixed inset-0 z-0 flex flex-col items-center justify-center gap-3 text-white/40 bg-base">
        <span className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm">Menyiapkan reels...</p>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-0 w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-base"
    >
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <p className="text-white font-display font-bold text-sm tracking-wide drop-shadow-md">Reels</p>
      </div>
      {tracks.map((t, i) => (
        <ReelItem key={t.videoId} track={t} queue={tracks} active={i === activeIndex} />
      ))}
    </main>
  );
}
