"use client";
import { useEffect } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { useInstallStore } from "@/store/useInstallStore";
import { useUIStore } from "@/store/useUIStore";

export default function InstallAppButton() {
  const init = useInstallStore((s) => s.init);
  const supported = useInstallStore((s) => s.supported);
  const installed = useInstallStore((s) => s.installed);
  const promptInstall = useInstallStore((s) => s.promptInstall);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    init();
  }, [init]);

  if (installed) {
    return (
      <div className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl">
        <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400" />
        <span className="text-sm text-white/50 font-medium">ucamusic sudah terpasang</span>
      </div>
    );
  }

  if (!supported) return null;

  const handleClick = async () => {
    const accepted = await promptInstall();
    if (accepted) showToast("Menginstal ucamusic...", { type: "success" });
  };

  return (
    <button onClick={handleClick} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left">
      <Download className="w-[18px] h-[18px] text-accent-soft" />
      <span className="text-sm text-white font-medium">Install Aplikasi ucamusic</span>
    </button>
  );
}
