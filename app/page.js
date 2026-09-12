"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Disc3,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import { proxyImage } from "@/lib/format";
import { MOODS, GENRE_ROWS } from "@/lib/constants";
import Section from "@/components/Section";
import GenreGrid from "@/components/GenreGrid";
import PromoCarousel from "@/components/PromoCarousel";
import { SongCard } from "@/components/cards/SongCard";
import { ArtistCard } from "@/components/cards/AlbumArtistCard";
import { SongCardSkeleton } from "@/components/ui/Skeleton";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useUIStore } from "@/store/useUIStore";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] } }),
};

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
    return <div className="mx-4 lg:mx-8 h-[220px] lg:h-[300px] rounded-[28px] bg-white/5 animate-pulse mb-8 lg:mb-10" />;
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="mx-4 lg:mx-8 mb-8 lg:mb-10 relative rounded-[28px] overflow-hidden border border-white/10 shadow-dock group"
    >
      <div className="absolute inset-0">
        {track.thumbnail && (
          <Image src={proxyImage(track.thumbnail)} alt="" fill className="object-cover scale-110 blur-2xl opacity-40 transition-transform duration-700 group-hover:scale-125" unoptimized />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(115deg, rgba(5,5,5,0.55) 20%, rgba(5,5,5,0.94) 75%), linear-gradient(0deg, rgba(5,5,5,0.9), transparent 60%)" }}
        />
        {/* subtle one-shot shine sweep across the card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent shine-sweep" />
        </div>
      </div>
      <div className="relative flex items-center gap-5 lg:gap-8 p-5 lg:p-9">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-24 h-24 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shrink-0 shadow-2xl ring-1 ring-white/10"
        >
          {track.thumbnail && <Image src={proxyImage(track.thumbnail)} alt={track.title} fill sizes="180px" className="object-cover" unoptimized />}
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-end justify-center gap-[3px] pb-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-[3px] bg-white rounded-full animate-pulse-bar" style={{ height: "40%", animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-soft mb-2">
            <Flame className="w-3.5 h-3.5 float-y" /> Nomor 1 Trending
          </p>
          <h2 className="font-display text-xl lg:text-4xl font-bold text-white truncate mb-1.5">{track.title}</h2>
          <p className="text-sm lg:text-base text-white/50 truncate mb-5">{track.artist || "Unknown"}</p>
          <button
            onClick={() => (isCurrent ? togglePlay() : playTrack(track, [track]))}
            className="flex items-center gap-2 px-5 lg:px-7 py-2.5 lg:py-3.5 rounded-full bg-white text-black text-sm lg:text-base font-semibold active:scale-90 transition-transform w-fit shadow-glow hover:shadow-[0_0_50px_-8px_rgba(139,92,246,0.65)]"
          >
            {isCurrent && isPlaying ? <Pause className="w-4 h-4 lg:w-5 lg:h-5" fill="black" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5 ml-0.5" fill="black" />}
            {isCurrent && isPlaying ? "Jeda" : "Putar Sekarang"}
          </button>
        </div>
      </div>
    </motion.div>
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
  const genreRow4 = useSongRow(GENRE_ROWS[4].query);
  const genreRow5 = useSongRow(GENRE_ROWS[5].query);
  const genreData = [genreRow0, genreRow1, genreRow2, genreRow3, genreRow4, genreRow5];

  const newReleases = useSongRow("lagu baru rilis minggu ini 2025");
  const viral = useSongRow("lagu viral tiktok indonesia 2025");

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

  const { scrollY } = useScroll();
  const parallaxBgY = useTransform(scrollY, [0, 320], [0, 50]);
  const parallaxBgScale = useTransform(scrollY, [0, 320], [1, 1.25]);
  const headerContentY = useTransform(scrollY, [0, 180], [0, -10]);
  const headerContentOpacity = useTransform(scrollY, [0, 180], [1, 0.72]);

  return (
    <main>
      <div
        className="relative pt-7 lg:pt-10 pb-7 lg:pb-9 px-5 lg:px-8 sticky top-0 z-30 overflow-hidden"
        style={{ backdropFilter: "blur(20px) saturate(140%)" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 10% -15%, rgba(236,72,153,0.22), transparent 60%), radial-gradient(ellipse 60% 55% at 100% -20%, rgba(139,92,246,0.22), transparent 60%), #050505",
            y: parallaxBgY,
            scale: parallaxBgScale,
          }}
        />
        <div className="absolute inset-0 border-b border-white/8" />
        <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(0deg, rgba(5,5,5,0.95), transparent)" }} />

        <motion.div className="relative" style={{ y: headerContentY, opacity: headerContentOpacity }}>
          <div className="relative flex items-center justify-between mb-6 lg:mb-8">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl overflow-hidden shrink-0 logo-glow">
                <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized priority />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/45">{greeting}</p>
                <h1 className="font-display text-[26px] lg:text-[32px] font-bold text-metallic leading-none mt-1">ucamusic</h1>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="flex items-center gap-2">
              <button
                onClick={() => showToast("Tidak ada notifikasi baru")}
                className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-white/85 active:scale-90 transition-transform hover:bg-white/10"
              >
                <Bell className="w-[18px] h-[18px]" />
              </button>
              <Link href="/search" className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-white/85 active:scale-90 transition-transform hover:bg-white/10">
                <SearchIcon className="w-[18px] h-[18px]" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="relative flex gap-2 overflow-x-auto no-scrollbar -mx-5 lg:-mx-8 px-5 lg:px-8"
          >
            {MOODS.map((m) => {
              const active = m.name === activeMood.name;
              return (
                <button
                  key={m.name}
                  onClick={() => setActiveMood(m)}
                  className={
                    active
                      ? "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-white text-black shadow-glow transition-transform active:scale-90"
                      : "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 glass text-white/70 hover:text-white transition-all active:scale-90"
                  }
                >
                  {m.name}
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <div className="pt-6 lg:pt-8">
        <AnnouncementBanner />

        <PromoCarousel />

        <HeroFeature track={heroTrack} loading={loadingDiscover && loadingMood} />

        <div className="px-4 lg:px-8 mb-8 lg:mb-10 grid grid-cols-3 gap-2.5">
          {[
            { icon: Sparkles, label: "10 Mood", sub: "Pilihan suasana" },
            { icon: Music2, label: "12 Genre", sub: "Beragam pilihan" },
            { icon: Heart, label: "100% Gratis", sub: "Tanpa akun" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-3.5 text-center card-hover">
              <s.icon className="w-4 h-4 mx-auto mb-1.5 text-accent-soft" />
              <p className="text-[13px] font-semibold text-white leading-tight">{s.label}</p>
              <p className="text-[10.5px] text-white/40 mt-0.5 leading-tight">{s.sub}</p>
            </div>
          ))}
        </div>

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
            : moodSongs.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={moodSongs} />)}
        </Section>

        <Section title="Artis Populer" subtitle="Yang lagi ramai didengarkan" icon={Mic2}>
          {loadingArtists
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : artists.slice(0, 18).map((a) => <ArtistCard key={a.id} artist={a} />)}
        </Section>

        <Section
          title="Sedang Trending"
          subtitle="Paling banyak diputar minggu ini di Indonesia"
          icon={Flame}
          seeAllHref={`/mood/${encodeURIComponent("Sedang Trending")}?q=${encodeURIComponent("trending songs indonesia")}`}
        >
          {loadingDiscover
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : discover.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={discover} />)}
        </Section>

        <Section
          title="Chart Global"
          subtitle="Yang lagi diputar di seluruh dunia"
          icon={Globe2}
          seeAllHref={`/mood/${encodeURIComponent("Chart Global")}?q=${encodeURIComponent("global top hits 2025")}`}
        >
          {loadingGlobal
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : global.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={global} />)}
        </Section>

        <Section
          title="Rilisan Terbaru"
          subtitle="Baru dirilis minggu ini"
          icon={Disc3}
          seeAllHref={`/mood/${encodeURIComponent("Rilisan Terbaru")}?q=${encodeURIComponent("lagu baru rilis minggu ini 2025")}`}
        >
          {newReleases.loading
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : newReleases.songs.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={newReleases.songs} />)}
        </Section>

        <Section
          title="Lagi Viral"
          subtitle="Ramai diputar & dibahas di media sosial"
          icon={Zap}
          seeAllHref={`/mood/${encodeURIComponent("Lagi Viral")}?q=${encodeURIComponent("lagu viral tiktok indonesia 2025")}`}
        >
          {viral.loading
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : viral.songs.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={viral.songs} />)}
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
              : genreData[i].songs.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={genreData[i].songs} />)}
          </Section>
        ))}

        <Section
          title="Nostalgia 2000-an"
          subtitle="Lagu jadul yang bikin kangen"
          icon={History}
          seeAllHref={`/mood/${encodeURIComponent("Nostalgia 2000-an")}?q=${encodeURIComponent("throwback 2000an hits")}`}
        >
          {loadingThrowback
            ? Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)
            : throwback.slice(0, 20).map((t) => <SongCard key={t.videoId} track={t} queue={throwback} />)}
        </Section>

        <GenreGrid />

        <div className="px-4 pb-4">
          <p className="text-center text-[11px] text-white/25">ucamusic · dibuat untuk pecinta musik</p>
        </div>
      </div>
    </main>
  );
}
