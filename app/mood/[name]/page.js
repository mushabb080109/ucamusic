"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { SongRow } from "@/components/cards/SongCard";
import { SongRowSkeleton } from "@/components/ui/Skeleton";

export default function MoodPage() {
  return (
    <Suspense fallback={null}>
      <MoodPageInner />
    </Suspense>
  );
}

function MoodPageInner() {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || decodeURIComponent(name);
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

  return (
    <main className="px-4 pt-10">
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-4 active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali
      </motion.button>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">{decodeURIComponent(name)}</h1>
        <p className="text-xs text-white/40 mb-5">{loading ? "Memuat..." : `${songs.length} lagu`}</p>
      </motion.div>

      {loading ? (
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <p className="text-center text-white/35 text-sm py-10">Tidak ada lagu ditemukan.</p>
      ) : (
        <div className="space-y-0.5 pb-4">
          {songs.map((t, i) => (
            <SongRow key={t.videoId} track={t} queue={songs} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
