"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      liked: [], // array of track objects
      recent: [], // recently played track objects
      playlists: [], // { id, name, cover, tracks: [] }

      isLiked: (videoId) => get().liked.some((t) => t.videoId === videoId),

      toggleLike: (track) =>
        set((state) => {
          const exists = state.liked.some((t) => t.videoId === track.videoId);
          return {
            liked: exists ? state.liked.filter((t) => t.videoId !== track.videoId) : [track, ...state.liked],
          };
        }),

      addRecent: (track) =>
        set((state) => {
          const filtered = state.recent.filter((t) => t.videoId !== track.videoId);
          return { recent: [track, ...filtered].slice(0, 40) };
        }),

      createPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            { id: `pl_${Date.now()}`, name: name || "Playlist baru", cover: "", tracks: [] },
          ],
        })),

      deletePlaylist: (id) => set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) })),

      addToPlaylist: (playlistId, track) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.some((t) => t.videoId === track.videoId) ? p.tracks : [...p.tracks, track] }
              : p
          ),
        })),

      removeFromPlaylist: (playlistId, videoId) =>
        set((state) => ({
          playlists: state.playlists.map((p) => (p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.videoId !== videoId) } : p)),
        })),

      hydrateFromServer: (serverLiked = [], serverPlaylists = []) =>
        set((state) => {
          const likedMap = new Map();
          [...serverLiked, ...state.liked].forEach((t) => t?.videoId && likedMap.set(t.videoId, t));
          const plMap = new Map();
          [...serverPlaylists, ...state.playlists].forEach((p) => p?.id && plMap.set(p.id, p));
          return { liked: Array.from(likedMap.values()), playlists: Array.from(plMap.values()) };
        }),
    }),
    { name: "ucamusic-library" }
  )
);
