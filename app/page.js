"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search as SearchIcon,
  Heart,
  Play,
  Pause,
  Bell,
  Flame,
  Globe2,
  Mic2,
  History,
  Music2,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { proxyImage } from "@/lib/format";
import Section from "@/components/Section";
import { SongCard } from "@/components/cards/SongCard";
import { ArtistCard } from "@/components/cards/AlbumArtistCard";
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

const GENRE_ROWS = [
  { name: "Pop", query: "pop hits terbaru" },
  { name: "Hip-Hop & Rap", query: "hip hop rap songs terbaru" },
  { name: "Dangdut", query: "dangdut terbaru 2025" },
  { name: "R&B & Soul", query: "rnb soul songs" },
];

const GENRE_GRID = [
  { name: "Pop", query: "pop hits", color: "from-pink-500/70 to-rose-600/40" },
  { name: "Hip-Hop", query: "hip hop rap songs", color: "from-amber-500/70 to-orange-700/40" },
  { name: "R&B", query: "rnb soul songs", color: "from-purple-500/70 to-indigo-700/40" },
  { name: "Dangdut", query: "dangdut terbaru", color: "from-emerald-500/70 to-teal-700/40" },
  { name: "Rock", query: "rock songs", color: "from-red-500/70 to-red-800/40" },
  { name: "Jazz", query: "jazz songs", color: "from-sky-500/70 to-blue-800/40" },
  { name: "EDM", query: "edm electronic dance", color: "from-fuchsia-500/70 to-purple-800/40" },
  { name: "Klasik", query: "classical music", color: "from-slate-400/70 to-slate-700/40" },
  { name: "K-Pop", query: "kpop hits terbaru", color: "from-violet-500/70 to-pink-700/40" },
  { name: "Reggae", query: "reggae songs", color: "from-lime-500/70 to-green-800/40" },
  { name: "Metal", query: "metal songs", color: "from-zinc-400/70 to-zinc-800/40" },
  { name: "Akustik", query: "acoustic cover songs", color: "from-orange-400/70 to-amber-800/40" },
];

function useGreeting() {
  return useMemo(() => {
    const h = new Date().getHours();
    if (h < 4) return "Selamat malam";
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 19) return "Selamat sore";
    return "Selamat malam";
  }, []);
}

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

function HeroFeature({ track, loading }) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const isCurrent = track && currentTrack?.videoId === track.videoId;

  if (loading || !track) {
    return <div className="mx-4 lg:mx-8 h-[220px] lg:h-[300px] rounded-3xl bg-white/5 animate-pulse mb-8 lg:mb-10" />;
  }

  return (
    <div className="mx-4 lg:mx-8 mb-8 lg:mb-10 relative rounded-3xl overflow-hidden border border-white/10 shadow-dock">
      <div className="absolute inset-0">
        {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt="" fill className="object-cover scale-110 blur-2xl opacity-40" unoptimized />}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(115deg, rgba(5,5,5,0.55) 20%, rgba(5,5,5,0.94) 75%), linear-gradient(0deg, rgba(5,5,5,0.9), transparent 60%)" }}
        />
      </div>
      <div className="relative flex items-center gap-5 lg:gap-8 p-5 lg:p-9">
        <div className="relative w-24 h-24 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
          {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="180px" className="object-cover" unoptimized />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-soft mb-2">
            <Flame className="w-3.5 h-3.5" /> Nomor 1 Trending
          </p>
          <h2 className="font-display text-xl lg:text-4xl font-bold text-white truncate mb-1.5">{track.title}</h2>
          <p className="text-sm lg:text-base text-white/50 truncate mb-5">{track.artist || "Unknown"}</p>
          <button
            onClick={() => (isCurrent ? togglePlay() : playTrack(track, [track]))}
            className="flex items-center gap-2 px-5 lg:px-7 py-2.5 lg:py-3.5 rounded-full bg-white text-black text-sm lg:text-base font-semibold active:scale-95 transition-transform w-fit"
          >
            {isCurrent && isPlaying ? <Pause className="w-4 h-4 lg:w-5 lg:h-5" fill="black" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5 ml-0.5" fill="black" />}
            {isCurrent && isPlaying ? "Jeda" : "Putar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}

function useSongRow(query) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .search(query, "songs")
      .then((res) => live && setSongs(res?.result?.songs || []))
      .catch(() => live && setSongs([]))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [query]);
  return { songs, loading };
}

export default function HomePage() {
  const greeting = useGreeting();
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
  const [global, setGlobal] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [throwback, setThrowback] = useState([]);
  const [loadingThrowback, setLoadingThrowback] = useState(true);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const genreRow0 = useSongRow(GENRE_ROWS[0].query);
  const genreRow1 = useSongRow(GENRE_ROWS[1].query);
  const genreRow2 = useSongRow(GENRE_ROWS[2].query);
  const genreRow3 = useSongRow(GENRE_ROWS[3].query);
  const genreData = [genreRow0, genreRow1, genreRow2, genreRow3];

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

    api
      .search("global top hits 2025", "songs")
      .then((res) => live && setGlobal(res?.result?.songs || []))
      .catch(() => {})
      .finally(() => live && setLoadingGlobal(false));

    api
      .search("throwback 2000an hits", "songs")
      .then((res) => live && setThrowback(res?.result?.songs || []))
      .catch(() => {})
      .finally(() => live && setLoadingThrowback(false));

    api
      .search("artis populer indonesia", "artists")
      .then((res) => live && setArtists(res?.result?.artists || []))
      .catch(() => {})
      .finally(() => live && setLoadingArtists(false));

    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (currentTrack) addRecent(currentTrack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.videoId]);

  const quickItems = [...liked.slice(0, 2), ...recent.slice(0, 4)].slice(0, 6);
  const heroTrack = discover?.[0] || moodSongs?.[0] || null;

  return (
    <main>
      <div
        className="relative pt-8 lg:pt-10 pb-5 lg:pb-6 px-4 lg:px-8 sticky top-0 z-30 border-b border-white/8 overflow-hidden"
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

        <div className="relative flex items-center justify-between mb-4 lg:mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/40">{greeting}</p>
            <h1 className="font-display text-[28px] lg:text-[34px] font-bold text-metallic leading-none mt-0.5">ucamusic</h1>
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
          </div>
        </div>

        <div className="relative flex gap-2 overflow-x-auto no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8">
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

      <div className="pt-6 lg:pt-8">
        <AnnouncementBanner />

        <HeroFeature track={heroTrack} loading={loadingDiscover && loadingMood} />

        {liked.length > 0 && (
          <div className="px-4 lg:px-8 mb-5">
            <Link
              href="/liked"
              className="flex items-center gap-3 rounded-2xl p-3.5 glass card-hover max-w-md"
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
          <div className="px-4 lg:px-8 mb-8 lg:mb-10">
            <h2 className="font-display text-[19px] lg:text-[22px] font-semibold text-white mb-3.5">Lanjutkan Mendengarkan</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {quickItems.map((t) => (
                <QuickTile key={t.videoId} track={t} queue={quickItems} />
              ))}
            </div>
          </div>
        )}

        <Section title={activeMood.name} subtitle="Dipilih untukmu" icon={Sparkles} seeAllHref={`/mood/${encodeURIComponent(activeMood.name)}?q=${encodeURIComponent(activeMood.query)}`}>
          {loadingMood
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : moodSongs.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={moodSongs} />)}
        </Section>

        <Section
          title="Sedang Trending"
          subtitle="Paling banyak diputar minggu ini di Indonesia"
          icon={Flame}
          seeAllHref={`/mood/${encodeURIComponent("Sedang Trending")}?q=${encodeURIComponent("trending songs indonesia")}`}
        >
          {loadingDiscover
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : discover.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={discover} />)}
        </Section>

        <Section
          title="Chart Global"
          subtitle="Yang lagi diputar di seluruh dunia"
          icon={Globe2}
          seeAllHref={`/mood/${encodeURIComponent("Chart Global")}?q=${encodeURIComponent("global top hits 2025")}`}
        >
          {loadingGlobal
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : global.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={global} />)}
        </Section>

        {GENRE_ROWS.map((g, i) => (
          <Section
            key={g.name}
            title={g.name}
            subtitle={`Terbaik dari genre ${g.name}`}
            icon={Music2}
            seeAllHref={`/mood/${encodeURIComponent(g.name)}?q=${encodeURIComponent(g.query)}`}
          >
            {genreData[i].loading
              ? Array.from({ length: 6 }).map((_, j) => <SongCardSkeleton key={j} />)
              : genreData[i].songs.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={genreData[i].songs} />)}
          </Section>
        ))}

        <Section title="Artis Populer" subtitle="Yang lagi ramai didengarkan" icon={Mic2}>
          {loadingArtists
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : artists.slice(0, 12).map((a) => <ArtistCard key={a.id} artist={a} />)}
        </Section>

        <Section
          title="Nostalgia 2000-an"
          subtitle="Lagu jadul yang bikin kangen"
          icon={History}
          seeAllHref={`/mood/${encodeURIComponent("Nostalgia 2000-an")}?q=${encodeURIComponent("throwback 2000an hits")}`}
        >
          {loadingThrowback
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : throwback.slice(0, 14).map((t) => <SongCard key={t.videoId} track={t} queue={throwback} />)}
        </Section>

        <div className="px-4 lg:px-8 mb-9">
          <h2 className="font-display text-[19px] lg:text-[22px] font-semibold text-white mb-3.5">Jelajahi Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {GENRE_GRID.map((g) => (
              <Link
                key={g.name}
                href={`/mood/${encodeURIComponent(g.name)}?q=${encodeURIComponent(g.query)}`}
                className={`relative h-20 lg:h-24 rounded-2xl overflow-hidden bg-gradient-to-br ${g.color} border border-white/10 card-hover flex items-end p-3`}
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
