"use client";
import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function AnnouncementBanner() {
  const settings = useSettingsStore((s) => s.settings);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!settings?.announcementEnabled) return;
    const seenVersion = typeof window !== "undefined" ? sessionStorage.getItem("uca_announcement_seen") : null;
    setDismissed(seenVersion === String(settings.announcementVersion));
  }, [settings]);

  if (!settings?.announcementEnabled || dismissed) return null;

  const close = () => {
    try {
      sessionStorage.setItem("uca_announcement_seen", String(settings.announcementVersion));
    } catch (e) {}
    setDismissed(true);
  };

  return (
    <div className="mx-4 mt-4 mb-1 rounded-2xl p-3.5 flex items-start gap-3 glass border-accent-soft/20">
      <Megaphone className="w-4 h-4 text-accent-soft shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        {settings.announcementTitle && <p className="text-[13px] font-semibold text-white">{settings.announcementTitle}</p>}
        {settings.announcementContent && <p className="text-[12px] text-white/55 mt-0.5">{settings.announcementContent}</p>}
      </div>
      <button onClick={close} className="text-white/40 hover:text-white shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
