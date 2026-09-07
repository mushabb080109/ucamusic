"use client";
import { cx } from "@/lib/format";

export function Skeleton({ className }) {
  return <div className={cx("relative overflow-hidden bg-white/5 rounded-xl", className)}><Shimmer /></div>;
}

function Shimmer() {
  return (
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
    />
  );
}

export function SongCardSkeleton() {
  return (
    <div className="flex-none w-[168px] sm:w-[190px]">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-3 w-4/5 mt-2.5 rounded-md" />
      <Skeleton className="h-2.5 w-2/5 mt-1.5 rounded-md" />
    </div>
  );
}

export function SongRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-3 w-2/3 rounded-md" />
        <Skeleton className="h-2.5 w-1/3 rounded-md" />
      </div>
    </div>
  );
}
