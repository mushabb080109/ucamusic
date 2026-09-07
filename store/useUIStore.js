"use client";
import { create } from "zustand";

let toastId = 0;

export const useUIStore = create((set, get) => ({
  toasts: [],
  sheetTrack: null,
  playlistPickerTrack: null,

  showToast(message, opts = {}) {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type: opts.type || "default" }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, opts.duration || 2200);
  },
  dismissToast(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  openTrackSheet(track) {
    set({ sheetTrack: track });
  },
  closeTrackSheet() {
    set({ sheetTrack: null });
  },

  openPlaylistPicker(track) {
    set({ playlistPickerTrack: track, sheetTrack: null });
  },
  closePlaylistPicker() {
    set({ playlistPickerTrack: null });
  },
}));
