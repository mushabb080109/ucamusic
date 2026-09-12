"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Mic2, Sparkles } from "lucide-react";
import { PROMO_SLIDES } from "@/lib/constants";

const ICONS = { Heart, Mic2, Sparkles };

export default function PromoCarousel() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(PROMO_SLIDES.length - 1, Math.max(0, idx)));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="mb-8 lg:mb-10">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 px-4 lg:px-8"
      >
        {PROMO_SLIDES.map((slide) => (
          <div key={slide.id} className="snap-center shrink-0 w-[88%] sm:w-[70%] lg:w-[46%]">
            {slide.kind === "brand" ? (
              <div className="relative h-[168px] lg:h-[210px] rounded-[26px] overflow-hidden border border-white/10 bg-[#0a0a0c] shadow-dock">
                <Image
                  src="/banner.png"
                  alt="ucamusic — Music For Every Mood"
                  fill
                  sizes="(max-width: 1024px) 88vw, 46vw"
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <div
                className="relative h-[168px] lg:h-[210px] rounded-[26px] overflow-hidden border border-white/10 p-5 lg:p-7 flex flex-col justify-between"
                style={{ background: slide.color }}
              >
                <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
                <div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-black/20 blur-2xl" />
                <span className="relative w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  {(() => {
                    const Icon = ICONS[slide.icon] || Sparkles;
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </span>
                <div className="relative">
                  <h3 className="font-display text-lg lg:text-xl font-bold text-white leading-tight mb-1">{slide.title}</h3>
                  <p className="text-[12.5px] text-white/85 leading-snug">{slide.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        {PROMO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: active === i ? 18 : 6,
              backgroundColor: active === i ? "#fff" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
