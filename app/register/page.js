"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const error = useAuthStore((s) => s.error);
  const showToast = useUIStore((s) => s.showToast);
  const settings = useSettingsStore((s) => s.settings);
  const registerEnabled = settings ? settings.registerEnabled !== false : true;
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    const ok = await register(username.trim(), password, displayName.trim());
    setLoading(false);
    if (ok) {
      showToast("Akun berhasil dibuat", { type: "success" });
      router.push("/profile");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-glow mb-4">
          <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized />
        </div>
        <h1 className="font-display text-2xl font-bold text-metallic">Buat Akun ucamusic</h1>
        <p className="text-sm text-white/45 mt-1 text-center">Gratis, tanpa iklan, dan tersinkron di semua perangkatmu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 max-w-sm w-full mx-auto">
        {!registerEnabled && (
          <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            Pendaftaran akun baru sedang ditutup sementara.
          </p>
        )}
        <fieldset disabled={!registerEnabled} className="space-y-3.5 disabled:opacity-50">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Nama Tampilan</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="mis. Uca"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent-soft/50"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="huruf kecil, angka, underscore"
            autoCapitalize="none"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent-soft/50"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none focus:border-accent-soft/50"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        </fieldset>

        {error && <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={loading || !registerEnabled}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm py-3 rounded-full active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar"}
        </button>
      </form>

      <p className="text-center text-sm text-white/40 mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-accent-soft font-medium">
          Masuk
        </Link>
      </p>
    </main>
  );
}
