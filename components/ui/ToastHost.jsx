"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { cx } from "@/lib/format";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
};

export default function ToastHost() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full px-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || ICONS.default;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={cx(
                "glass-dock rounded-full px-4 py-2.5 flex items-center gap-2 shadow-dock max-w-[92%]",
                t.type === "success" && "border-emerald-400/30",
                t.type === "error" && "border-red-400/30"
              )}
            >
              <Icon
                className={cx(
                  "w-4 h-4 shrink-0",
                  t.type === "success" ? "text-emerald-400" : t.type === "error" ? "text-red-400" : "text-accent-soft"
                )}
              />
              <span className="text-[13px] font-medium text-white truncate">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
