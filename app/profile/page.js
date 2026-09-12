"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music2, Sparkles, Heart, ListMusic, Clock, Trash2, Github, BadgeCheck } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useUIStore } from "@/store/useUIStore";
import InstallAppButton from "@/components/InstallAppButton";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] } }),
};

export default function ProfilePage() {
  const liked = useLibraryStore((s) => s.liked);
  const playlists = useLibraryStore((s) => s.playlists);
  const recent = useLibraryStore((s) => s.recent);
  const showToast = useUIStore((s) => s.showToast);

  const clearHistory = () => {
    if (!window.confirm("Hapus semua riwayat putar lagu?")) return;
    useLibraryStore.setState({ recent: [] });
    showToast("Riwayat berhasil dihapus");
  };

  const stats = [
    { icon: Heart, value: liked.length, label: "Disukai", color: "text-accent-pink" },
    { icon: ListMusic, value: playlists.length, label: "Playlist", color: "text-accent-soft" },
    { icon: Music2, value: recent.length, label: "Riwayat", color: "text-accent-amber" },
  ];

  return (
    <main className="px-4 lg:px-8 pt-10 pb-6 max-w-2xl">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col items-center text-center mb-7">
        <div className="relative w-24 h-24 rounded-[28px] overflow-hidden mb-4 logo-glow">
          <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized />
        </div>
        <h1 className="font-display text-2xl font-bold text-metallic">ucamusic</h1>
        <p className="text-sm text-white/45 mt-1.5 max-w-xs leading-relaxed">
          Streaming musik gratis, tanpa iklan, dan tanpa perlu akun. Semua data lagu tersimpan langsung di perangkatmu.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((s, i) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center card-hover">
            <s.icon className={`w-5 h-5 mx-auto mb-1.5 ${s.color}`} />
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-white/40">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-4">
        <InstallAppButton />
        {recent.length > 0 && (
          <button
            onClick={clearHistory}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left active:scale-[0.99]"
          >
            <Trash2 className="w-[18px] h-[18px] text-red-400" />
            <span className="flex-1 text-sm text-red-400 font-medium">Hapus Riwayat Putar</span>
          </button>
        )}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-soft" />
          <h2 className="text-sm font-semibold text-white">Tentang ucamusic</h2>
        </div>
        <p className="text-[13px] text-white/50 leading-relaxed">
          ucamusic dibangun dengan Next.js, React, dan Tailwind CSS, dirancang untuk berjalan mulus di Vercel. Semua data
          lagu diambil secara real-time — tanpa iklan, tanpa akun, tanpa ribet. Lagu disukai, playlist, dan riwayat
          putarmu tersimpan lokal di perangkat ini.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
        className="relative rounded-2xl overflow-hidden mb-4 border border-white/10 h-28"
        style={{ background: "radial-gradient(circle at 20% 30%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(circle at 90% 80%, rgba(236,72,153,0.28), transparent 55%), #08080a" }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-90" style={{ mixBlendMode: "screen" }}>
          <motion.div
            className="relative w-full h-full"
            animate={{ x: [-10, 10, -10], scale: [1, 1.05, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/banner.png" alt="ucamusic" fill className="object-contain p-4" unoptimized />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={5}
        className="glass rounded-2xl p-5 mb-4 flex items-start gap-3"
      >
        <span className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
          <BadgeCheck className="w-[18px] h-[18px]" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-white mb-1">Gratis Untuk Semua Orang</h2>
          <p className="text-[13px] text-white/50 leading-relaxed">
            ucamusic dibuat oleh developer UCA dan disediakan gratis untuk siapa saja yang ingin memakainya — tanpa
            biaya langganan, tanpa iklan, dan tanpa syarat tersembunyi.
          </p>
        </div>
      </motion.div>

      <p className="text-center text-[11px] text-white/25 mt-6 flex items-center justify-center gap-1.5">
        <Github className="w-3 h-3" /> ucamusic v6 · dibuat dengan ♥ oleh developer UCA
      </p>
    </main>
  );
}
