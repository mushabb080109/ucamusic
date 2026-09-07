"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("uca_splash_seen")) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("uca_splash_seen", "1");
      } catch (e) {}
    }, 1900);
    return () => clearTimeout(t);
  }, []);

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

          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[124px] h-[124px] rounded-full border-2 border-white/20 bg-black/70 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden">
              <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized priority />
            </div>
            {/* one-shot shine sweep */}
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.65) 50%, transparent 60%)" }}
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-display text-2xl font-bold text-metallic mt-6 tracking-wide"
          >
            ucamusic
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.2em] text-white/35 mt-1.5"
          >
            Menyiapkan musikmu
          </motion.p>

          <div className="mt-7 w-32 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
            <motion.span
              className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{ x: ["-100%", "250%"] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
