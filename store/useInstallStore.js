"use client";
import { create } from "zustand";

export const useInstallStore = create((set, get) => ({
  deferredPrompt: null,
  installed: false,
  supported: false,

  init() {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      set({ installed: true });
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      set({ deferredPrompt: e, supported: true });
    });

    window.addEventListener("appinstalled", () => {
      set({ installed: true, deferredPrompt: null, supported: false });
    });
  },

  async promptInstall() {
    const { deferredPrompt } = get();
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    set({ deferredPrompt: null, supported: false });
    return choice.outcome === "accepted";
  },
}));
