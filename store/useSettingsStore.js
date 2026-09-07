"use client";
import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  settings: null,
  loaded: false,

  async fetchSettings() {
    try {
      const res = await fetch("/api/settings").then((r) => r.json());
      set({ settings: res?.settings || null, loaded: true });
    } catch (e) {
      set({ loaded: true });
    }
  },
}));
