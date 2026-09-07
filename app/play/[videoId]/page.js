"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function PlayRedirectPage() {
  const { videoId } = useParams();
  const router = useRouter();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const [error, setError] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await api.search(`https://music.youtube.com/watch?v=${videoId}`, "songs");
        const track = res?.result?.songs?.[0];
        if (!track) throw new Error("Lagu tidak ditemukan");
        if (live) {
          await playTrack(track, [track]);
          router.replace("/");
        }
      } catch (e) {
        if (live) setError(e.message || "Gagal memuat lagu");
      }
    })();
    return () => {
      live = false;
    };
  }, [videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] text-white/50 gap-3 px-6 text-center">
      {error ? (
        <>
          <p className="text-sm text-red-300">{error}</p>
          <button onClick={() => router.push("/")} className="text-xs text-accent-soft underline">
            Kembali ke Beranda
          </button>
        </>
      ) : (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm">Menyiapkan lagu...</p>
        </>
      )}
    </main>
  );
}
