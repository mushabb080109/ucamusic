"use client";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

function Toggle({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-3.5 border-b border-white/6 last:border-0 text-left"
    >
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        {hint && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
      </div>
      <span className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-accent-gradient" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

export default function AdminSettingsPage() {
  const showToast = useUIStore((s) => s.showToast);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) setSettings(res.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }).then((r) => r.json());
      if (res.success) {
        setSettings(res.settings);
        showToast("Pengaturan disimpan", { type: "success" });
      } else {
        showToast(res.message || "Gagal menyimpan", { type: "error" });
      }
    } catch (e) {
      showToast("Gagal menyimpan", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-white/40 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Memuat...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Pengaturan Situs</h1>

      <section className="glass rounded-2xl p-4 mb-4">
        <h2 className="text-xs uppercase tracking-wider text-white/40 mb-3">Branding</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Nama Situs</label>
            <input
              value={settings.siteName || ""}
              onChange={(e) => update("siteName", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent-soft/50"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Tagline</label>
            <input
              value={settings.tagline || ""}
              onChange={(e) => update("tagline", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent-soft/50"
            />
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-4 mb-4">
        <h2 className="text-xs uppercase tracking-wider text-white/40 mb-1">Akun</h2>
        <Toggle
          checked={!!settings.registerEnabled}
          onChange={(v) => update("registerEnabled", v)}
          label="Izinkan Pendaftaran Baru"
          hint="Matikan untuk menutup sementara pendaftaran akun baru"
        />
      </section>

      <section className="glass rounded-2xl p-4 mb-4">
        <h2 className="text-xs uppercase tracking-wider text-white/40 mb-1">Mode Pemeliharaan</h2>
        <Toggle
          checked={!!settings.maintenanceMode}
          onChange={(v) => update("maintenanceMode", v)}
          label="Aktifkan Mode Pemeliharaan"
          hint="Pengunjung biasa akan melihat halaman pemeliharaan. Admin tetap bisa akses."
        />
        <div className="mt-3">
          <label className="text-xs text-white/50 mb-1.5 block">Pesan Pemeliharaan</label>
          <textarea
            value={settings.maintenanceMessage || ""}
            onChange={(e) => update("maintenanceMessage", e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent-soft/50 resize-none"
          />
        </div>
      </section>

      <section className="glass rounded-2xl p-4 mb-6">
        <h2 className="text-xs uppercase tracking-wider text-white/40 mb-1">Pengumuman</h2>
        <Toggle checked={!!settings.announcementEnabled} onChange={(v) => update("announcementEnabled", v)} label="Tampilkan Banner Pengumuman" />
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Judul</label>
            <input
              value={settings.announcementTitle || ""}
              onChange={(e) => update("announcementTitle", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent-soft/50"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Isi</label>
            <textarea
              value={settings.announcementContent || ""}
              onChange={(e) => update("announcementContent", e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent-soft/50 resize-none"
            />
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm py-3 px-6 rounded-full active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
      </button>
    </div>
  );
}
