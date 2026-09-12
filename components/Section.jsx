"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Section({ title, subtitle, children, seeAllHref, icon: Icon }) {
  const isEmpty = !children || (Array.isArray(children) && children.filter(Boolean).length === 0);
  if (isEmpty) return null;
  return (
    <section className="mb-9 lg:mb-11">
      <div className="flex items-end justify-between mb-3.5 lg:mb-4 px-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-soft shrink-0">
              <Icon className="w-4 h-4" />
            </span>
          )}
          <div>
            <h2 className="font-display text-[19px] lg:text-[22px] font-semibold text-white leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="flex items-center gap-0.5 text-xs font-medium text-white/50 hover:text-white shrink-0">
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <div className="flex gap-3.5 lg:gap-4 overflow-x-auto no-scrollbar px-4 lg:px-8 pb-1">{children}</div>
    </section>
  );
}
