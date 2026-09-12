"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Mic2,
  ListMusic,
  Volume2,
  Volume1,
  VolumeX,
  AlertCircle,
} from "lucide-react";
import { usePlayerStore, REPEAT_ALL, REPEAT_ONE } from "@/store/usePlayerStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { proxyImage, cx } from "@/lib/format";
import LyricsView from "./LyricsView";
import QueueView from "./QueueView";

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function FullPlayer() {
  const showFullPlayer = usePlayerStore((s) => s.showFullPlayer);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const error = usePlayerStore((s) => s.error);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);

  const closeFullPlayer = usePlayerStore((s) => s.closeFullPlayer);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const seek = usePlayerStore((s) => s.seek);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);

  const isLiked = useLibraryStore((s) => s.isLiked);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  const [tab, setTab] = useState("cover"); // cover | lyrics | queue

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.videoId);
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const RepeatIcon = repeat === REPEAT_ONE ? Repeat1 : Repeat;
  const VolIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <AnimatePresence>
      {showFullPlayer && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 260 }}
          className="fixed inset-0 z-50 bg-base overflow-hidden"
        >
          {/* ambient background */}
          <div className="absolute inset-0 opacity-40 blur-3xl scale-110 pointer-events-none">
            {currentTrack.thumbnail && (
              <Image src={proxyImage(currentTrack.thumbnail)} alt="" fill className="object-cover" unoptimized />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-base/60 via-base/85 to-base pointer-events-none" />

          <div
            className="relative z-10 h-full flex flex-col px-5 max-w-lg mx-auto"
            style={{ paddingTop: "calc(1.5rem + env(safe-area-inset-top))", paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          >
            {/* header */}
            <div className="flex items-center justify-between shrink-0">
              <button onClick={closeFullPlayer} className="p-2 -ml-2 text-white/80 hover:text-white">
                <ChevronDown className="w-6 h-6" />
              </button>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-widest text-white/40">Sedang diputar</p>
              </div>
              <button
                onClick={() => setTab(tab === "queue" ? "cover" : "queue")}
                className={cx("p-2 -mr-2", tab === "queue" ? "text-accent-soft" : "text-white/80 hover:text-white")}
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* main content area */}
            <div className="flex-1 min-h-0 my-4">
              {tab === "cover" && (
                <div className="h-full flex flex-col items-center justify-center">
                  <motion.div
                    key={currentTrack.videoId}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  >
                    {currentTrack.thumbnail && (
                      <Image src={proxyImage(currentTrack.thumbnail)} alt={currentTrack.title} fill sizes="320px" className="object-cover" unoptimized priority />
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
              {tab === "lyrics" && <LyricsView />}
              {tab === "queue" && <QueueView />}
            </div>

            {/* track info + like */}
            <div className="shrink-0 flex items-center justify-between gap-3 mb-1">
              <div className="min-w-0">
                <h2 className="font-display text-[20px] font-semibold text-white truncate">{currentTrack.title}</h2>
                <p className="text-[13px] text-white/50 truncate">{currentTrack.artist || "Unknown"}</p>
              </div>
              <button onClick={() => toggleLike(currentTrack)} className="p-2 shrink-0 text-white/70 hover:text-accent-pink">
                <Heart className={cx("w-6 h-6", liked && "fill-accent-pink text-accent-pink")} />
              </button>
            </div>

            {/* progress */}
            <div className="shrink-0 mt-3">
              <input
                type="range"
                className="uca-range w-full"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[11px] text-white/40 font-mono mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* transport controls */}
            <div className="shrink-0 flex items-center justify-between mt-3">
              <button onClick={toggleShuffle} className={cx("p-2", shuffle ? "text-accent-soft" : "text-white/50 hover:text-white")}>
                <Shuffle className="w-[19px] h-[19px]" />
              </button>
              <button onClick={prev} className="p-2 text-white hover:text-accent-soft">
                <SkipBack className="w-7 h-7" fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-glow active:scale-95 transition-transform"
              >
                {isLoading ? (
                  <span className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7" fill="black" />
                ) : (
                  <Play className="w-7 h-7 ml-1" fill="black" />
                )}
              </button>
              <button onClick={next} className="p-2 text-white hover:text-accent-soft">
                <SkipForward className="w-7 h-7" fill="currentColor" />
              </button>
              <button onClick={cycleRepeat} className={cx("p-2", repeat !== "off" ? "text-accent-soft" : "text-white/50 hover:text-white")}>
                <RepeatIcon className="w-[19px] h-[19px]" />
              </button>
            </div>

            {/* bottom row: lyrics toggle + volume */}
            <div className="shrink-0 flex items-center gap-3 mt-5">
              <button
                onClick={() => setTab(tab === "lyrics" ? "cover" : "lyrics")}
                className={cx(
                  "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                  tab === "lyrics" ? "bg-white text-black border-white" : "text-white/70 border-white/15 hover:border-white/30"
                )}
              >
                <Mic2 className="w-3.5 h-3.5" /> Lirik
              </button>
              <button onClick={toggleMute} className="text-white/60 hover:text-white shrink-0">
                <VolIcon className="w-[18px] h-[18px]" />
              </button>
              <input
                type="range"
                className="uca-range flex-1"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
