"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { api } from "@/lib/api";
import GenreGrid from "@/components/GenreGrid";
import { SongRow } from "@/components/cards/SongCard";
import { AlbumCard, ArtistCard, PlaylistCard } from "@/components/cards/AlbumArtistCard";
import { SongRowSkeleton } from "@/components/ui/Skeleton";

const TABS = [
  { key: "songs", label: "Lagu" },
  { key: "albums", label: "Album" },
  { key: "artists", label: "Artis" },
  { key: "playlists", label: "Playlist" },
];

const POPULAR = ["Tulus", "Bruno Mars", "Sheila On 7", "Taylor Swift", "Dewa 19", "The Weeknd", "Coldplay", "Raisa"];

function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem("uca_recent_searches") || "[]");
  } catch (e) {
    return [];
  }
}

function saveRecentSearch(term) {
  try {
    const list = loadRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase());
    list.unshift(term);
    localStorage.setItem("uca_recent_searches", JSON.stringify(list.slice(0, 8)));
  } catch (e) {}
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [focused, setFocused] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("songs");
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api
        .suggest(query)
        .then((res) => setSuggestions(Array.isArray(res) ? res.slice(0, 8) : []))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const runSearch = async (q) => {
    const term = (q ?? query).trim();
    if (!term) return;
    setQuery(term);
    setShowSuggest(false);
    setLoading(true);
    inputRef.current?.blur();
    saveRecentSearch(term);
    setRecentSearches(loadRecentSearches());
    try {
      const res = await api.search(term, "all");
      setResult(res?.result || null);
      const r = res?.result;
      if (r?.songs?.length) setTab("songs");
      else if (r?.albums?.length) setTab("albums");
      else if (r?.artists?.length) setTab("artists");
      else if (r?.playlists?.length) setTab("playlists");
    } catch (e) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    songs: result?.songs?.length || 0,
    albums: result?.albums?.length || 0,
    artists: result?.artists?.length || 0,
    playlists: result?.playlists?.length || 0,
  };

  return (
    <main className="px-4 pt-10">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-2xl font-bold text-white mb-4"
      >
        Cari
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative"
      >
        <div
          className={`flex items-center gap-2 glass rounded-2xl px-4 py-3 transition-all duration-300 ${
            focused ? "ring-2 ring-accent-soft/50 bg-white/[0.06]" : ""
          }`}
        >
          <SearchIcon className={`w-[18px] h-[18px] shrink-0 transition-colors ${focused ? "text-accent-soft" : "text-white/40"}`} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setShowSuggest(true);
              setFocused(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Judul lagu, artis, atau album..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/35"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResult(null);
                setSuggestions([]);
              }}
              className="text-white/40 hover:text-white shrink-0 active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSuggest && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 mt-2 glass-dock rounded-2xl overflow-hidden z-20 shadow-dock"
            >
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => runSearch(s)}
                  className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/8 hover:text-white flex items-center gap-3 border-b border-white/5 last:border-0"
                >
                  <SearchIcon className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {loading && (
        <div className="mt-5 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && result && (
        <div className="mt-5" onClick={() => setShowSuggest(false)}>
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {TABS.filter((t) => counts[t.key] > 0).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  tab === t.key
                    ? "px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-black shrink-0 transition-transform active:scale-90"
                    : "px-4 py-1.5 rounded-full text-xs font-medium text-white/60 glass shrink-0 transition-transform active:scale-90"
                }
              >
                {t.label} · {counts[t.key]}
              </button>
            ))}
          </div>

          {Object.values(counts).every((c) => c === 0) && (
            <p className="text-center text-white/40 text-sm py-10">Tidak ada hasil untuk &ldquo;{result.query}&rdquo;</p>
          )}

          {tab === "songs" && (
            <div className="space-y-0.5">
              {result.songs.map((t, i) => (
                <SongRow key={t.videoId} track={t} queue={result.songs} index={i} />
              ))}
            </div>
          )}

          {tab === "albums" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {result.albums.map((a) => (
                <AlbumCard key={a.id} album={a} />
              ))}
            </div>
          )}

          {tab === "artists" && (
            <div className="grid grid-cols-3 gap-4">
              {result.artists.map((a) => (
                <ArtistCard key={a.id} artist={a} />
              ))}
            </div>
          )}

          {tab === "playlists" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {result.playlists.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !result && (
        <div className="mt-8">
          {recentSearches.length > 0 && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Pencarian Terakhir</h2>
                <button
                  onClick={() => {
                    localStorage.setItem("uca_recent_searches", "[]");
                    setRecentSearches([]);
                  }}
                  className="text-[11px] text-white/40 hover:text-white transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s, i) => (
                  <button key={i} onClick={() => runSearch(s)} className="px-3.5 py-2 rounded-full glass text-xs text-white/70 hover:text-white transition-transform active:scale-90">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Sedang Populer</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((s) => (
                <button key={s} onClick={() => runSearch(s)} className="px-3.5 py-2 rounded-full glass text-xs text-white/70 hover:text-white transition-transform active:scale-90">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 -mx-4">
            <GenreGrid title="Jelajahi Genre" cols="grid-cols-2 sm:grid-cols-3" />
          </div>
        </div>
      )}
    </main>
  );
}
