"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { playIntroSound } from "@/lib/sound";

const EASE = [0.16, 1, 0.3, 1];
const TAGLINE = ["Stream", "musik", "tanpa", "batas,", "tanpa", "akun."];

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState(0); // 0 icon in, 1 impact, 2 title, 3 tagline words, 4 subtitle+bar

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("uca_splash_seen")) {
      setVisible(false);
      return;
    }
    const timers = [
      setTimeout(() => setStage(1), 700), // impact flash + sound
      setTimeout(() => setStage(2), 850), // title wipe-reveal
      setTimeout(() => setStage(3), 1550), // tagline words, one by one
      setTimeout(() => setStage(4), 2550), // subtitle + progress bar
      setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem("uca_splash_seen", "1");
        } catch (e) {}
      }, 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === 1) playIntroSound();
  }, [stage]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(circle at 50% 42%, #1a1b24 0%, #050505 72%)" }}
        >
          {/* ambient glow blobs */}
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-accent/25 blur-[90px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ top: "18%" }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-accent-pink/20 blur-[90px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1.1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
            style={{ bottom: "22%" }}
          />

          {/* one-shot full-screen impact flash — the visual "duar" beat */}
          <AnimatePresence>
            {stage === 1 && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0] }}
                transition={{ duration: 0.45, times: [0, 0.15, 1], ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
          {/* shockwave ring on impact */}
          {stage >= 1 && (
            <motion.div
              className="absolute w-[124px] h-[124px] rounded-[32px] border-2 border-white/70"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}

          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{
              scale: stage >= 1 ? [1, 1.12, 1] : 1,
              opacity: 1,
            }}
            transition={
              stage >= 1
                ? { duration: 0.35, ease: "easeOut" }
                : { duration: 0.55, ease: EASE }
            }
            className="relative w-[124px] h-[124px] rounded-[32px] border-2 border-white/20 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized priority />
            {/* one-shot shine sweep */}
            <motion.span
              className="absolute inset-0 rounded-[32px] pointer-events-none"
              style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.65) 50%, transparent 60%)" }}
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
            />
          </motion.div>

          {/* Cinematic title reveal — a clip-path wipe + glow flicker */}
          <div className="relative mt-6 h-9 flex items-center justify-center overflow-hidden">
            {stage >= 2 && (
              <motion.h1
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                transition={{ duration: 0.65, ease: EASE }}
                className="font-display text-2xl font-bold text-metallic tracking-wide whitespace-nowrap"
              >
                ucamusic
              </motion.h1>
            )}
            {stage === 2 && (
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)" }}
                initial={{ x: "-140%" }}
                animate={{ x: "140%" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              />
            )}
          </div>

          {/* tagline — words appear one at a time, like a big native app's loading sting */}
          <div className="mt-3 h-5 flex items-center justify-center px-8">
            {stage >= 3 && (
              <motion.div
                className="flex flex-wrap items-center justify-center gap-x-1.5"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.16 } } }}
              >
                {TAGLINE.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="text-[12.5px] font-medium text-white/65"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>

          {stage >= 4 && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10.5px] uppercase tracking-[0.2em] text-white/30 mt-5"
            >
              Menyiapkan musikmu
            </motion.p>
          )}

          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-4 w-32 h-[3px] rounded-full bg-white/10 overflow-hidden relative"
            >
              <motion.span
                className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ x: ["-100%", "250%"] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
