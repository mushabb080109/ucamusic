"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const showToast = useUIStore((s) => s.showToast);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);
    if (ok) {
      showToast("Berhasil masuk", { type: "success" });
      router.push("/profile");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-glow mb-4">
          <Image src="/logo.png" alt="ucamusic" fill className="object-cover" unoptimized />
        </div>
        <h1 className="font-display text-2xl font-bold text-metallic">Masuk ke ucamusic</h1>
        <p className="text-sm text-white/45 mt-1 text-center">Simpan lagu disukai & playlist di mana pun kamu login</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 max-w-sm w-full mx-auto">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
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
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none focus:border-accent-soft/50"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm py-3 rounded-full active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Masuk"}
        </button>
      </form>

      <p className="text-center text-sm text-white/40 mt-6">
        Belum punya akun?{" "}
        <Link href="/register" className="text-accent-soft font-medium">
          Daftar
        </Link>
      </p>
    </main>
  );
}
