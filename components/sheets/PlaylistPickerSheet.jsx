"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, ListMusic, Check } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function PlaylistPickerSheet() {
  const track = useUIStore((s) => s.playlistPickerTrack);
  const close = useUIStore((s) => s.closePlaylistPicker);
  const showToast = useUIStore((s) => s.showToast);
  const playlists = useLibraryStore((s) => s.playlists);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const addToPlaylist = useLibraryStore((s) => s.addToPlaylist);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  if (!track) return null;

  const handleAdd = (playlistId, playlistName) => {
    addToPlaylist(playlistId, track);
    showToast(`Ditambahkan ke "${playlistName}"`, { type: "success" });
    close();
  };

  const handleCreate = () => {
    const finalName = name.trim() || "Playlist baru";
    createPlaylist(finalName);
    setTimeout(() => {
      const latest = useLibraryStore.getState().playlists.slice(-1)[0];
      if (latest) handleAdd(latest.id, latest.name);
    }, 0);
    setName("");
    setCreating(false);
  };

  return (
    <AnimatePresence>
      {track && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[81] glass-dock rounded-t-3xl px-4 pt-3 pb-8 max-w-lg mx-auto max-h-[75vh] flex flex-col"
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 shrink-0" />
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="font-display text-lg font-semibold text-white">Tambah ke Playlist</h3>
              <button onClick={close} className="p-1.5 text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {creating ? (
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Nama playlist..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent-soft/50"
                />
                <button onClick={handleCreate} className="px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold shrink-0">
                  Buat
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-white/6 transition-colors text-left mb-1 shrink-0"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span className="text-[14px] text-white font-medium">Buat Playlist Baru</span>
              </button>
            )}

            <div className="overflow-y-auto no-scrollbar flex-1">
              {playlists.length === 0 ? (
                <p className="text-center text-white/35 text-sm py-8">Belum ada playlist.</p>
              ) : (
                playlists.map((p) => {
                  const already = p.tracks.some((t) => t.videoId === track.videoId);
                  return (
                    <button
                      key={p.id}
                      onClick={() => !already && handleAdd(p.id, p.name)}
                      className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-white/6 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent/25 to-white/5 flex items-center justify-center shrink-0">
                        <ListMusic className="w-4 h-4 text-white/60" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] text-white font-medium truncate">{p.name}</p>
                        <p className="text-[11px] text-white/40">{p.tracks.length} lagu</p>
                      </div>
                      {already && <Check className="w-4 h-4 text-accent-soft shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
