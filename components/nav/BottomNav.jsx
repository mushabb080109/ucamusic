"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Library, Heart, User } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { cx } from "@/lib/format";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Cari", icon: Search },
  { href: "/library", label: "Koleksi", icon: Library },
  { href: "/liked", label: "Disukai", icon: Heart },
  { href: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  return (
    <nav
      className={cx(
        "fixed left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md transition-all duration-300",
        currentTrack ? "bottom-[calc(76px+env(safe-area-inset-bottom))]" : "bottom-[calc(16px+env(safe-area-inset-bottom))]"
      )}
    >
      <div className="glass-dock rounded-3xl px-1.5 py-1.5 flex items-center justify-between shadow-dock">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cx(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 transition-colors duration-300 active:scale-90"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-2xl bg-white/10 border border-white/10 shadow-[0_0_16px_-2px_rgba(139,92,246,0.5)]"
                />
              )}
              <Icon className={cx("relative w-[18px] h-[18px] transition-colors", active ? "text-white" : "text-white/45")} strokeWidth={active ? 2.4 : 2} />
              <span className={cx("relative text-[9.5px] font-medium tracking-wide transition-colors", active ? "text-white" : "text-white/45")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
