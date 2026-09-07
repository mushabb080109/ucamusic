"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Play, Loader2, Shuffle } from "lucide-react";
import { api } from "@/lib/api";
import { proxyImage } from "@/lib/format";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SongRow } from "@/components/cards/SongCard";

export default function AlbumPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const playTrack = usePlayerStore((s) => s.playTrack);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .album(id)
      .then((res) => live && setData(res?.result || null))
      .catch(() => live && setData(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] text-white/40 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Memuat...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="px-4 pt-8 text-center text-white/40">
        <p className="text-sm">Tidak ditemukan.</p>
      </main>
    );
  }

  const cover = data.thumbnails?.[data.thumbnails.length - 1]?.url;
  const songs = (data.songs || []).map((s) => ({
    videoId: s.videoId,
    title: s.title,
    artist: s.artist,
    duration: s.duration,
    thumbnail: s.thumbnails?.[s.thumbnails.length - 1]?.url || cover,
  }));

  return (
    <main className="pb-4">
      <div className="px-4 pt-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-5">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-4">
            {cover && <Image src={proxyImage(cover)} alt={data.title} fill className="object-cover" unoptimized />}
          </div>
          <h1 className="font-display text-xl font-bold text-white">{data.title}</h1>
          {data.description && <p className="text-xs text-white/40 mt-1 max-w-xs line-clamp-2">{data.description}</p>}
          <p className="text-xs text-white/45 mt-1">{songs.length} lagu</p>

          {songs.length > 0 && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => playTrack(songs[0], songs)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4" fill="black" /> Putar
              </button>
              <button
                onClick={() => playTrack(songs[Math.floor(Math.random() * songs.length)], songs)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full glass text-white text-sm font-medium active:scale-95 transition-transform"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {songs.length === 0 ? (
          <p className="text-center text-white/35 text-sm py-10">Tidak ada lagu ditemukan.</p>
        ) : (
          <div className="space-y-0.5">
            {songs.map((t) => (
              <SongRow key={t.videoId} track={t} queue={songs} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
