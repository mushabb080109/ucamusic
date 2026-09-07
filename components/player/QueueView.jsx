"use client";
import Image from "next/image";
import { Play, Pause, X, ListMusic } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { proxyImage, cx } from "@/lib/format";

export default function QueueView() {
  const queue = usePlayerStore((s) => s.queue);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);

  if (!queue.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-white/35">
        <ListMusic className="w-8 h-8" />
        <p className="text-sm">Antrian kosong</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-4 py-6 space-y-1.5">
      <p className="text-xs uppercase tracking-wider text-white/35 px-2 mb-2">Antrian Putar · {queue.length} lagu</p>
      {queue.map((t) => {
        const isCurrent = t.videoId === currentTrack?.videoId;
        return (
          <div key={t.videoId} className={cx("flex items-center gap-3 px-2 py-2 rounded-xl group", isCurrent ? "bg-white/8" : "hover:bg-white/5")}>
            <button onClick={() => (isCurrent ? togglePlay() : playTrack(t, queue))} className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5">
              {t.thumbnail && <Image src={proxyImage(t.thumbnail)} alt={t.title} fill sizes="40px" className="object-cover" unoptimized />}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5 text-white" fill="white" /> : <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />}
              </div>
            </button>
            <div className="min-w-0 flex-1">
              <p className={cx("text-[13px] font-medium truncate", isCurrent ? "text-accent-soft" : "text-white")}>{t.title}</p>
              <p className="text-[11px] text-white/40 truncate">{t.artist || "Unknown"}</p>
            </div>
            <button onClick={() => removeFromQueue(t.videoId)} className="p-1.5 text-white/25 hover:text-white shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
