"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Section({ title, subtitle, children, seeAllHref }) {
  const isEmpty = !children || (Array.isArray(children) && children.filter(Boolean).length === 0);
  if (isEmpty) return null;
  return (
    <section className="mb-9">
      <div className="flex items-end justify-between mb-3.5 px-4">
        <div>
          <h2 className="font-display text-[20px] font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="flex items-center gap-0.5 text-xs font-medium text-white/50 hover:text-white shrink-0">
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-1">{children}</div>
    </section>
  );
}
