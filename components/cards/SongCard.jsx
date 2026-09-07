"use client";
import Image from "next/image";
import { Play, Pause, MoreVertical } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import { proxyImage, formatDuration, cx } from "@/lib/format";

export function SongCard({ track, queue }) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const openTrackSheet = useUIStore((s) => s.openTrackSheet);

  const isCurrent = currentTrack?.videoId === track.videoId;

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playTrack(track, queue || [track]);
  };

  return (
    <div className="group relative flex-none w-[168px] sm:w-[190px] card-hover">
      <button onClick={handlePlay} className="relative block w-full aspect-square rounded-2xl overflow-hidden bg-base-card border border-white/5 shadow-lg shadow-black/20">
        {track.thumbnail ? (
          <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="220px" className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/0" />
        )}
        <div
          className={cx(
            "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity",
            isCurrent && "opacity-100 bg-black/50"
          )}
        >
          <span className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-glow">
            {isCurrent && isPlaying ? <Pause className="w-5 h-5" fill="black" /> : <Play className="w-5 h-5 ml-0.5" fill="black" />}
          </span>
        </div>
        {isCurrent && (
          <div className="absolute bottom-2.5 left-2.5 flex items-end gap-[2px] h-3.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cx("w-[3px] bg-accent-soft rounded-full", isPlaying && "animate-pulse-bar")}
                style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </button>
      <div className="mt-2.5 flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className={cx("text-[13.5px] font-semibold truncate", isCurrent ? "text-accent-soft" : "text-white")}>{track.title}</p>
          <p className="text-[12px] text-white/45 truncate mt-0.5">{track.artist || "Unknown"}</p>
        </div>
        <button onClick={() => openTrackSheet(track)} className="p-1 text-white/30 hover:text-white shrink-0 -mr-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function SongRow({ track, queue, index }) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const openTrackSheet = useUIStore((s) => s.openTrackSheet);
  const isCurrent = currentTrack?.videoId === track.videoId;

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playTrack(track, queue || [track]);
  };

  return (
    <div className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
      {typeof index === "number" && (
        <span className="w-4 text-center text-xs text-white/30 font-mono shrink-0">{index + 1}</span>
      )}
      <button onClick={handlePlay} className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
        {track.thumbnail ? (
          <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="48px" className="object-cover" unoptimized />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          {isCurrent && isPlaying ? <Pause className="w-4 h-4 text-white" fill="white" /> : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />}
        </div>
        {isCurrent && (
          <div className="absolute inset-0 bg-black/45 flex items-end justify-center gap-[2px] pb-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cx("w-[2.5px] bg-accent-soft rounded-full h-2", isPlaying && "animate-pulse-bar")}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </button>
      <button onClick={handlePlay} className="min-w-0 flex-1 text-left">
        <p className={cx("text-[14px] font-medium truncate", isCurrent ? "text-accent-soft" : "text-white")}>{track.title}</p>
        <p className="text-[12px] text-white/45 truncate mt-0.5">{track.artist || "Unknown"}</p>
      </button>
      {track.duration && <span className="text-[12px] text-white/35 font-mono shrink-0">{formatDuration(track.duration)}</span>}
      <button onClick={() => openTrackSheet(track)} className="p-1.5 text-white/30 hover:text-white shrink-0">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
}
