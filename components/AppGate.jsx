"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function AppGate({ children }) {
  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const user = useAuthStore((s) => s.user);
  const authStatus = useAuthStore((s) => s.status);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const isAdmin = user?.role === "admin";
  const blocked = settings?.maintenanceMode && authStatus !== "loading" && !isAdmin;

  if (blocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-base">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden mb-5 opacity-80">
          <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized />
        </div>
        <Wrench className="w-8 h-8 text-accent-soft mb-4" />
        <h1 className="font-display text-xl font-bold text-white mb-2">Sedang Pemeliharaan</h1>
        <p className="text-sm text-white/50 max-w-xs">{settings.maintenanceMessage}</p>
      </div>
    );
  }

  return children;
}
