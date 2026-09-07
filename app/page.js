"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, User, Heart, Play, Pause, Bell } from "lucide-react";
import { api } from "@/lib/api";
import { proxyImage } from "@/lib/format";
import Section from "@/components/Section";
import { SongCard } from "@/components/cards/SongCard";
import { SongCardSkeleton } from "@/components/ui/Skeleton";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const MOODS = [
  { name: "Untuk Kamu", query: "top hits 2025" },
  { name: "Santai", query: "chill lofi songs" },
  { name: "Fokus", query: "focus instrumental music" },
  { name: "Nge-gym", query: "workout gym motivation songs" },
  { name: "Party", query: "party dance hits" },
  { name: "Galau", query: "sad indonesian songs" },
  { name: "Semangat", query: "energetic pop songs" },
  { name: "Nostalgia", query: "throwback 2010s hits" },
  { name: "Akustik", query: "acoustic cover songs" },
  { name: "Rock", query: "rock anthem songs" },
];

const GENRES = [
  { name: "Pop", query: "pop hits", color: "from-pink-500/70 to-rose-600/40" },
  { name: "Hip-Hop", query: "hip hop rap songs", color: "from-amber-500/70 to-orange-700/40" },
  { name: "R&B", query: "rnb soul songs", color: "from-purple-500/70 to-indigo-700/40" },
  { name: "Dangdut", query: "dangdut terbaru", color: "from-emerald-500/70 to-teal-700/40" },
  { name: "Rock", query: "rock songs", color: "from-red-500/70 to-red-800/40" },
  { name: "Jazz", query: "jazz songs", color: "from-sky-500/70 to-blue-800/40" },
  { name: "EDM", query: "edm electronic dance", color: "from-fuchsia-500/70 to-purple-800/40" },
  { name: "Klasik", query: "classical music", color: "from-slate-400/70 to-slate-700/40" },
];

function QuickTile({ track, queue }) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const isCurrent = currentTrack?.videoId === track.videoId;

  return (
    <button
      onClick={() => (isCurrent ? togglePlay() : playTrack(track, queue))}
      className="flex items-center gap-2.5 bg-white/5 hover:bg-white/9 rounded-xl overflow-hidden pr-3 transition-colors group"
    >
      <div className="relative w-12 h-12 shrink-0 bg-white/5">
        {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="48px" className="object-cover" unoptimized />}
      </div>
      <span className="text-[12.5px] font-medium text-white truncate flex-1 text-left">{track.title}</span>
      <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {isCurrent && isPlaying ? <Pause className="w-3 h-3 text-white" fill="white" /> : <Play className="w-3 h-3 text-white ml-0.5" fill="white" />}
      </span>
    </button>
  );
}

export default function HomePage() {
  const recent = useLibraryStore((s) => s.recent);
  const liked = useLibraryStore((s) => s.liked);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const addRecent = useLibraryStore((s) => s.addRecent);
  const showToast = useUIStore((s) => s.showToast);

  const [activeMood, setActiveMood] = useState(MOODS[0]);
  const [moodSongs, setMoodSongs] = useState([]);
  const [loadingMood, setLoadingMood] = useState(true);
  const [discover, setDiscover] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(true);

  useEffect(() => {
    let live = true;
    setLoadingMood(true);
    api
      .search(activeMood.query, "songs")
      .then((res) => {
        if (live) setMoodSongs(res?.result?.songs || []);
      })
      .catch(() => live && setMoodSongs([]))
      .finally(() => live && setLoadingMood(false));
    return () => {
      live = false;
    };
  }, [activeMood]);

  useEffect(() => {
    let live = true;
    api
      .search("trending songs indonesia", "songs")
      .then((res) => live && setDiscover(res?.result?.songs || []))
      .catch(() => {})
      .finally(() => live && setLoadingDiscover(false));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (currentTrack) addRecent(currentTrack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.videoId]);

  const quickItems = [...liked.slice(0, 2), ...recent.slice(0, 4)].slice(0, 6);

  return (
    <main>
      <div
        className="relative pt-8 pb-5 px-4 sticky top-0 z-30 border-b border-white/8 overflow-hidden"
        style={{ backdropFilter: "blur(14px)" }}
      >
        <div className="absolute inset-0 opacity-25">
          <Image src="/banner.png" alt="" fill className="object-cover" unoptimized priority />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(5,5,5,0.92) 88%), radial-gradient(circle at 15% -20%, rgba(236,72,153,0.3), transparent 55%)",
          }}
        />

        <div className="relative flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/40">Selamat datang di</p>
            <h1 className="font-display text-[28px] font-bold text-metallic leading-none mt-0.5">ucamusic</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("Tidak ada notifikasi baru")}
              className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-white/85 active:scale-95 transition-transform"
            >
              <Bell className="w-[18px] h-[18px]" />
            </button>
            <Link href="/search" className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-white/85 active:scale-95 transition-transform">
              <SearchIcon className="w-[18px] h-[18px]" />
            </Link>
            <Link href="/profile" className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-white/85 active:scale-95 transition-transform">
              <User className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </div>

        <div className="relative flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {MOODS.map((m) => {
            const active = m.name === activeMood.name;
            return (
              <button
                key={m.name}
                onClick={() => setActiveMood(m)}
                className={
                  active
                    ? "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-white text-black shadow-glow"
                    : "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 glass text-white/70 hover:text-white"
                }
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-5">
        <AnnouncementBanner />
        {liked.length > 0 && (
          <div className="px-4 mb-5">
            <Link
              href="/liked"
              className="flex items-center gap-3 rounded-2xl p-3.5 glass card-hover"
              style={{ background: "linear-gradient(120deg, rgba(139,92,246,0.18), rgba(236,72,153,0.14))" }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent-gradient flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Lagu Disukai</p>
                <p className="text-xs text-white/50">{liked.length} lagu tersimpan</p>
              </div>
            </Link>
          </div>
        )}

        {quickItems.length > 0 && (
          <div className="px-4 mb-8">
            <h2 className="font-display text-[20px] font-semibold text-white mb-3.5">Lanjutkan Mendengarkan</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {quickItems.map((t) => (
                <QuickTile key={t.videoId} track={t} queue={quickItems} />
              ))}
            </div>
          </div>
        )}

        <Section title={activeMood.name} subtitle="Dipilih untukmu" seeAllHref={`/mood/${encodeURIComponent(activeMood.name)}?q=${encodeURIComponent(activeMood.query)}`}>
          {loadingMood
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : moodSongs.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={moodSongs} />)}
        </Section>

        <Section
          title="Sedang Trending"
          subtitle="Paling banyak diputar minggu ini"
          seeAllHref={`/mood/${encodeURIComponent("Sedang Trending")}?q=${encodeURIComponent("trending songs indonesia")}`}
        >
          {loadingDiscover
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : discover.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={discover} />)}
        </Section>

        <div className="px-4 mb-9">
          <h2 className="font-display text-[20px] font-semibold text-white mb-3.5">Jelajahi Genre</h2>
          <div className="grid grid-cols-2 gap-3">
            {GENRES.map((g) => (
              <Link
                key={g.name}
                href={`/mood/${encodeURIComponent(g.name)}?q=${encodeURIComponent(g.query)}`}
                className={`relative h-20 rounded-2xl overflow-hidden bg-gradient-to-br ${g.color} border border-white/10 card-hover flex items-end p-3`}
              >
                <span className="font-display font-bold text-white text-[15px] drop-shadow">{g.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <p className="text-center text-[11px] text-white/25">ucamusic · dibuat untuk pecinta musik</p>
        </div>
      </div>
    </main>
  );
}
