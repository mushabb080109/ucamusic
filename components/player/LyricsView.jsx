"use client";
import { useEffect, useMemo, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { cx } from "@/lib/format";

export default function LyricsView() {
  const lyrics = usePlayerStore((s) => s.lyrics);
  const lyricsLoading = usePlayerStore((s) => s.lyricsLoading);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const seek = usePlayerStore((s) => s.seek);
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  const activeIndex = useMemo(() => {
    if (!lyrics?.lines?.length || lyrics.type !== "synced") return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.lines.length; i++) {
      if (lyrics.lines[i].time <= currentTime) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, currentTime]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  if (lyricsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
        <span className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        <p className="text-sm">Mencari lirik...</p>
      </div>
    );
  }

  if (!lyrics || !lyrics.lines?.length || lyrics.type === "none") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-white/35 px-8 text-center">
        <p className="text-sm">Lirik tidak tersedia untuk lagu ini.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto no-scrollbar px-6 py-10 space-y-5">
      {lyrics.lines.map((line, i) => {
        const active = i === activeIndex;
        const clickable = lyrics.type === "synced" && line.time >= 0;
        return (
          <div
            key={i}
            ref={active ? activeRef : null}
            onClick={() => clickable && seek(line.time)}
            className={cx(
              "transition-all duration-300 leading-snug",
              clickable && "cursor-pointer",
              active ? "text-white text-[22px] font-semibold scale-100" : "text-white/30 text-[19px] font-medium hover:text-white/55"
            )}
          >
            {line.text}
            {line.translation ? (
              <div className={cx("text-[13px] mt-1 font-normal", active ? "text-accent-soft" : "text-white/20")}>{line.translation}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
