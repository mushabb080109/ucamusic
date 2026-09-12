"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, Play, Shuffle } from "lucide-react";
import { api } from "@/lib/api";
import { proxyImage } from "@/lib/format";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SongRow } from "@/components/cards/SongCard";
import Section from "@/components/Section";
import { AlbumCard } from "@/components/cards/AlbumArtistCard";
import { SongRowSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ArtistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const playTrack = usePlayerStore((s) => s.playTrack);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .artist(id)
      .then((res) => live && setData(res?.result || null))
      .catch(() => live && setData(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="pb-4">
        <Skeleton className="h-72 w-full rounded-none" />
        <div className="px-4 mt-5 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="px-4 pt-10 text-center text-white/40">
        <p className="text-sm">Artis tidak ditemukan.</p>
      </main>
    );
  }

  const cover = data.thumbnails?.[data.thumbnails.length - 1]?.url;
  const topSongs = (data.topSongs || []).map((s) => ({
    videoId: s.videoId,
    title: s.title,
    artist: s.artist || data.name,
    thumbnail: s.thumbnails?.[s.thumbnails.length - 1]?.url,
  }));

  return (
    <main className="pb-4">
      <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative h-80 w-full">
        {cover && <Image src={proxyImage(cover)} alt={data.name} fill sizes="100vw" className="object-cover" unoptimized priority />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-base/50 to-base" />
        <button onClick={() => router.back()} className="absolute top-6 left-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-5 left-4 right-4">
          <p className="text-[11px] uppercase tracking-widest text-white/60 mb-1">Artis</p>
          <h1 className="font-display text-[34px] leading-none font-bold text-white drop-shadow-lg">{data.name}</h1>
        </div>
      </motion.div>

      <div className="px-4 mt-5">
        {topSongs.length > 0 && (
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => playTrack(topSongs[0], topSongs)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold active:scale-90 transition-transform shadow-glow"
            >
              <Play className="w-4 h-4" fill="black" /> Putar
            </button>
            <button
              onClick={() => playTrack(topSongs[Math.floor(Math.random() * topSongs.length)], topSongs)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass text-white text-sm font-medium active:scale-90 transition-transform"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        )}

        {topSongs.length > 0 && (
          <div className="mb-2">
            <h2 className="font-display text-lg font-semibold text-white mb-2">Lagu Populer</h2>
            <div className="space-y-0.5">
              {topSongs.slice(0, 8).map((t, i) => (
                <SongRow key={t.videoId} track={t} queue={topSongs} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Section title="Album">
        {data.topAlbums?.map((a) => (
          <AlbumCard key={a.browseId} album={{ id: a.browseId, title: a.name, artist: data.name, cover: a.thumbnails?.[a.thumbnails.length - 1]?.url, albumType: "Album" }} />
        ))}
      </Section>

      <Section title="Single & EP">
        {data.topSingles?.map((a) => (
          <AlbumCard key={a.browseId} album={{ id: a.browseId, title: a.name, artist: data.name, cover: a.thumbnails?.[a.thumbnails.length - 1]?.url, albumType: "Single" }} />
        ))}
      </Section>

      {data.similarArtists?.length > 0 && (
        <div className="mb-9">
          <h2 className="font-display text-[20px] font-semibold text-white mb-3.5 px-4">Artis Serupa</h2>
          <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-1">
            {data.similarArtists.map((a) => (
              <a key={a.browseId} href={`/artist/${a.browseId}`} className="group flex-none w-[128px] text-center card-hover">
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-base-card border border-white/5">
                  {a.thumbnails?.length > 0 && (
                    <Image src={proxyImage(a.thumbnails[a.thumbnails.length - 1].url)} alt={a.name} fill sizes="130px" className="object-cover img-zoom" unoptimized />
                  )}
                </div>
                <p className="mt-2 text-[13px] font-medium text-white truncate">{a.name}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
