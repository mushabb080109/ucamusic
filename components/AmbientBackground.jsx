"use client";

// Persistent, subtle animated backdrop rendered once behind the entire app.
// Pure CSS animation (no JS ticking) so it stays smooth and battery-friendly
// on iPhone. Sits fixed behind everything, never intercepts touches.
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="orb-a absolute w-[70vw] h-[70vw] max-w-[560px] max-h-[560px] rounded-full blur-[110px] opacity-[0.22]"
        style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)", top: "-18%", left: "-18%" }}
      />
      <div
        className="orb-b absolute w-[65vw] h-[65vw] max-w-[520px] max-h-[520px] rounded-full blur-[110px] opacity-[0.18]"
        style={{ background: "radial-gradient(circle, #EC4899 0%, transparent 70%)", top: "18%", right: "-22%" }}
      />
      <div
        className="orb-c absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] opacity-[0.14]"
        style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)", left: "50%", bottom: "-30%" }}
      />
      <div className="absolute inset-0 bg-noise mix-blend-overlay" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 0%, #050505 78%)" }} />
    </div>
  );
}
