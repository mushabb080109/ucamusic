"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Clapperboard, User } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { cx } from "@/lib/format";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/reels", label: "Reels", icon: Clapperboard },
  { href: "/search", label: "Cari", icon: Search },
  { href: "/library", label: "Koleksi", icon: Library },
  { href: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  if (pathname?.startsWith("/reels") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className={cx(
        "fixed left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md transition-all duration-300",
        currentTrack ? "bottom-[76px]" : "bottom-4"
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
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 transition-all duration-300 active:scale-95",
                active ? "text-white" : "text-white/45 hover:text-white/75"
              )}
            >
              {active && (
                <span className="absolute inset-0 rounded-2xl bg-white/10 border border-white/10" />
              )}
              <Icon className="relative w-[18px] h-[18px]" strokeWidth={active ? 2.4 : 2} />
              <span className="relative text-[9.5px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
