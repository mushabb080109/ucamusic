"use client";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  status: "loading", // loading | authed | guest
  error: null,

  async fetchMe() {
    try {
      const res = await fetch("/api/auth/me").then((r) => r.json());
      set({ user: res?.user || null, status: res?.user ? "authed" : "guest" });
      return res?.user || null;
    } catch (e) {
      set({ user: null, status: "guest" });
      return null;
    }
  },

  async login(username, password) {
    set({ error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).then((r) => r.json());
      if (!res.success) {
        set({ error: res.message || "Gagal login." });
        return false;
      }
      set({ user: res.user, status: "authed" });
      return true;
    } catch (e) {
      set({ error: "Tidak dapat terhubung ke server." });
      return false;
    }
  },

  async register(username, password, displayName) {
    set({ error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, displayName }),
      }).then((r) => r.json());
      if (!res.success) {
        set({ error: res.message || "Gagal mendaftar." });
        return false;
      }
      set({ user: res.user, status: "authed" });
      return true;
    } catch (e) {
      set({ error: "Tidak dapat terhubung ke server." });
      return false;
    }
  },

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    set({ user: null, status: "guest" });
  },
}));
