"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Home, ShieldAlert, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const authStatus = useAuthStore((s) => s.status);

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Memuat...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <ShieldAlert className="w-10 h-10 text-white/30 mb-3" />
        <p className="text-sm text-white/50">Halaman ini hanya untuk admin.</p>
        <Link href="/" className="mt-4 text-xs text-accent-soft underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 h-16 bg-base/90 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-white/60" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" /> Lihat Situs
            </Link>
          </div>
          <span className="text-xs font-bold text-white/50">@{user.username}</span>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
