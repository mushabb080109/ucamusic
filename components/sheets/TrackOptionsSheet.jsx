"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ListPlus, ListMusic, User, X, PlayCircle } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { proxyImage, cx } from "@/lib/format";

export default function TrackOptionsSheet() {
  const track = useUIStore((s) => s.sheetTrack);
  const closeTrackSheet = useUIStore((s) => s.closeTrackSheet);
  const openPlaylistPicker = useUIStore((s) => s.openPlaylistPicker);
  const showToast = useUIStore((s) => s.showToast);
  const isLiked = useLibraryStore((s) => s.isLiked);
  const toggleLike = useLibraryStore((s) => s.toggleLike);
  const playNext = usePlayerStore((s) => s.playNext);
  const enqueue = usePlayerStore((s) => s.enqueue);
  const queue = usePlayerStore((s) => s.queue);
  const playTrack = usePlayerStore((s) => s.playTrack);

  if (!track) return null;
  const liked = isLiked(track.videoId);

  const actions = [
    {
      icon: Heart,
      label: liked ? "Hapus dari Disukai" : "Tambah ke Disukai",
      active: liked,
      onClick: () => {
        toggleLike(track);
        showToast(liked ? "Dihapus dari lagu disukai" : "Ditambahkan ke lagu disukai", { type: "success" });
        closeTrackSheet();
      },
    },
    {
      icon: PlayCircle,
      label: "Putar Berikutnya",
      onClick: () => {
        playNext(track);
        showToast("Diputar setelah lagu ini", { type: "success" });
        closeTrackSheet();
      },
    },
    {
      icon: ListPlus,
      label: "Tambah ke Antrian",
      onClick: () => {
        if (queue.length === 0) playTrack(track, [track]);
        else enqueue(track);
        showToast("Ditambahkan ke antrian", { type: "success" });
        closeTrackSheet();
      },
    },
    {
      icon: ListMusic,
      label: "Tambah ke Playlist",
      onClick: () => openPlaylistPicker(track),
    },
  ];

  return (
    <AnimatePresence>
      {track && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTrackSheet}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[71] glass-dock rounded-t-3xl px-4 pt-3 pb-8 max-w-lg mx-auto"
            style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5">
                {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="48px" className="object-cover" unoptimized />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                <p className="text-xs text-white/45 truncate">{track.artist || "Unknown"}</p>
              </div>
              <button onClick={closeTrackSheet} className="p-1.5 text-white/40 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-0.5">
              {actions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-white/6 transition-colors text-left"
                >
                  <a.icon className={cx("w-[19px] h-[19px]", a.active ? "text-accent-pink fill-accent-pink" : "text-white/70")} />
                  <span className="text-[14px] text-white font-medium">{a.label}</span>
                </button>
              ))}

              {track.artistId && (
                <Link
                  href={`/artist/${track.artistId}`}
                  onClick={closeTrackSheet}
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-white/6 transition-colors text-left"
                >
                  <User className="w-[19px] h-[19px] text-white/70" />
                  <span className="text-[14px] text-white font-medium">Lihat Artis</span>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
