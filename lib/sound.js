// Tiny synthesized "studio intro" sound — a soft low impact ("duar") followed
// by a bright shimmer ("sing"), generated with the Web Audio API so no audio
// file is needed. Autoplay is blocked by some browsers until the user has
// interacted with the page at least once — that's fine, we fail silently.
export function playIntroSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // --- "duar": a short low-frequency thump ---
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = "sine";
    boom.frequency.setValueAtTime(160, now);
    boom.frequency.exponentialRampToValueAtTime(42, now + 0.32);
    boomGain.gain.setValueAtTime(0.0001, now);
    boomGain.gain.exponentialRampToValueAtTime(0.9, now + 0.03);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    boom.connect(boomGain).connect(master);
    boom.start(now);
    boom.stop(now + 0.45);

    // --- "sing": bright shimmer sting shortly after the impact ---
    const shimmerStart = now + 0.22;
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "highpass";
    bandpass.frequency.value = 3200;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, shimmerStart);
    shimmerGain.gain.exponentialRampToValueAtTime(0.35, shimmerStart + 0.04);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, shimmerStart + 0.55);
    noise.connect(bandpass).connect(shimmerGain).connect(master);
    noise.start(shimmerStart);
    noise.stop(shimmerStart + 0.6);

    // a few bell-like harmonics under the shimmer for a "sparkle" feel
    [1760, 2637, 3520].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, shimmerStart);
      g.gain.exponentialRampToValueAtTime(0.16 / (i + 1), shimmerStart + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, shimmerStart + 0.5);
      osc.connect(g).connect(master);
      osc.start(shimmerStart);
      osc.stop(shimmerStart + 0.55);
    });

    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch (e) {
    // audio not available/allowed — silently ignore
  }
}
