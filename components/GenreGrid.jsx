"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Music2,
  Mic2,
  Radio,
  Drum,
  Guitar,
  Music,
  Zap,
  Sparkles,
  Heart,
  Waves,
  Flame,
  Headphones,
} from "lucide-react";
import { GENRE_GRID } from "@/lib/constants";

const ICONS = { Music2, Mic2, Radio, Drum, Guitar, Music, Zap, Sparkles, Heart, Waves, Flame, Headphones };

export default function GenreGrid({ title = "Jelajahi Genre", cols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) {
  return (
    <div className="px-4 lg:px-8 mb-9">
      {title && <h2 className="font-display text-[19px] lg:text-[22px] font-semibold text-white mb-3.5">{title}</h2>}
      <div className={`grid ${cols} gap-3`}>
        {GENRE_GRID.map((g, i) => {
          const Icon = ICONS[g.icon] || Music2;
          return (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03 }}
            >
              <Link
                href={`/mood/${encodeURIComponent(g.name)}?q=${encodeURIComponent(g.query)}`}
                className="group relative block aspect-[4/3] sm:aspect-[16/11] rounded-[22px] overflow-hidden border border-white/10 card-hover active:scale-95 transition-transform"
                style={{ background: `linear-gradient(150deg, ${g.color}55 0%, #0a0a0c 78%)` }}
              >
                <div className="absolute inset-0 bg-noise opacity-[0.5] mix-blend-overlay" />
                <div
                  className="absolute -right-10 -top-10 w-28 h-28 rounded-full blur-3xl opacity-60 group-hover:opacity-90 group-hover:scale-125 transition-all duration-500"
                  style={{ background: g.color }}
                />
                <Music2
                  className="absolute -right-3 -bottom-4 w-20 h-20 opacity-[0.08] rotate-[-12deg] group-hover:opacity-[0.14] transition-opacity"
                  style={{ color: g.color }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent shine-sweep" />
                </div>
                <div className="relative h-full flex flex-col justify-between p-4">
                  <span
                    className="w-10 h-10 rounded-2xl flex items-center justify-center ring-1 ring-white/15 shrink-0"
                    style={{ backgroundColor: `${g.color}30`, color: g.color, boxShadow: `0 0 22px -6px ${g.color}` }}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="font-display font-bold text-white text-[16px] leading-tight drop-shadow-sm">{g.name}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
