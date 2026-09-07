"use client";
import { create } from "zustand";
import { api } from "@/lib/api";
import { proxyAudio } from "@/lib/format";

let audioEl = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "auto";
    audioEl.crossOrigin = "anonymous";
  }
  return audioEl;
}

export const REPEAT_OFF = "off";
export const REPEAT_ALL = "all";
export const REPEAT_ONE = "one";

export const usePlayerStore = create((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  error: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  shuffle: false,
  repeat: REPEAT_OFF,
  lyrics: null,
  lyricsLoading: false,
  showFullPlayer: false,

  _bindEngine() {
    const audio = getAudio();
    if (!audio || audio.__bound) return;
    audio.__bound = true;
    audio.addEventListener("timeupdate", () => set({ currentTime: audio.currentTime }));
    audio.addEventListener("durationchange", () => set({ duration: audio.duration || 0 }));
    audio.addEventListener("play", () => set({ isPlaying: true }));
    audio.addEventListener("pause", () => set({ isPlaying: false }));
    audio.addEventListener("waiting", () => set({ isLoading: true }));
    audio.addEventListener("canplay", () => set({ isLoading: false }));
    audio.addEventListener("ended", () => get().next());
    audio.addEventListener("error", () => set({ isLoading: false, error: "Gagal memutar lagu ini" }));
  },

  async playTrack(track, queue = null) {
    const state = get();
    state._bindEngine();
    const audio = getAudio();
    if (!audio) return;

    const newQueue = queue || state.queue;
    const idx = newQueue.findIndex((t) => t.videoId === track.videoId);

    set({
      currentTrack: track,
      queue: newQueue,
      currentIndex: idx >= 0 ? idx : state.currentIndex,
      isLoading: true,
      error: null,
      currentTime: 0,
      lyrics: null,
      showFullPlayer: true,
    });

    try {
      const res = await api.resolveStream(track.videoId);
      if (!res?.status || !res?.result?.download?.audio) throw new Error(res?.error || "Sumber audio tidak ditemukan");
      const streamUrl = proxyAudio(res.result.download.audio);
      audio.src = streamUrl;
      audio.volume = state.muted ? 0 : state.volume;
      await audio.play().catch(() => {});
      set({ isLoading: false });
      get().loadLyrics(track);
    } catch (e) {
      set({ isLoading: false, error: e.message || "Gagal memuat audio" });
    }
  },

  async loadLyrics(track) {
    set({ lyricsLoading: true });
    try {
      const res = await api.lyrics(track.videoId, track.title, track.artist);
      set({ lyrics: res?.result?.lyrics || null, lyricsLoading: false });
    } catch (e) {
      set({ lyrics: null, lyricsLoading: false });
    }
  },

  togglePlay() {
    const audio = getAudio();
    if (!audio || !audio.src) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  },

  seek(time) {
    const audio = getAudio();
    if (!audio) return;
    audio.currentTime = time;
    set({ currentTime: time });
  },

  setVolume(v) {
    const audio = getAudio();
    if (audio) audio.volume = v;
    set({ volume: v, muted: v === 0 });
  },

  toggleMute() {
    const state = get();
    const audio = getAudio();
    const next = !state.muted;
    if (audio) audio.volume = next ? 0 : state.volume || 1;
    set({ muted: next });
  },

  toggleShuffle() {
    set((s) => ({ shuffle: !s.shuffle }));
  },

  cycleRepeat() {
    set((s) => ({
      repeat: s.repeat === REPEAT_OFF ? REPEAT_ALL : s.repeat === REPEAT_ALL ? REPEAT_ONE : REPEAT_OFF,
    }));
  },

  next() {
    const state = get();
    if (state.repeat === REPEAT_ONE) {
      const audio = getAudio();
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      return;
    }
    if (!state.queue.length) return;
    let nextIdx;
    if (state.shuffle) {
      nextIdx = Math.floor(Math.random() * state.queue.length);
    } else {
      nextIdx = state.currentIndex + 1;
      if (nextIdx >= state.queue.length) {
        if (state.repeat === REPEAT_ALL) nextIdx = 0;
        else return;
      }
    }
    const track = state.queue[nextIdx];
    if (track) get().playTrack(track, state.queue);
  },

  prev() {
    const state = get();
    const audio = getAudio();
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (!state.queue.length) return;
    let prevIdx = state.currentIndex - 1;
    if (prevIdx < 0) prevIdx = state.repeat === REPEAT_ALL ? state.queue.length - 1 : 0;
    const track = state.queue[prevIdx];
    if (track) get().playTrack(track, state.queue);
  },

  enqueue(track) {
    set((s) => ({ queue: [...s.queue, track] }));
  },

  playNext(track) {
    set((s) => {
      const q = [...s.queue];
      q.splice(s.currentIndex + 1, 0, track);
      return { queue: q };
    });
  },

  removeFromQueue(videoId) {
    set((s) => ({ queue: s.queue.filter((t) => t.videoId !== videoId) }));
  },

  openFullPlayer() {
    set({ showFullPlayer: true });
  },
  closeFullPlayer() {
    set({ showFullPlayer: false });
  },
}));
