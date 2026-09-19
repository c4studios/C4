/* Sound for the C4Site hero, synthesised from the engine's own event list.
   Everything is chalk and board: taps where letters land, a scrape where a
   ring or a strike is drawn, fine ticks while an entry is written, air moving
   when the camera travels, a low room tone, a small struck-bar note for each
   word found (climbing a D major pentatonic), and a D chord when the mark
   locks. No samples, no licensed audio: noise, sines and filters only. */
import fs from 'node:fs';

const SR = 48000;
function rngFrom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function synth({ cues, duration, end, file }) {
  const N = Math.ceil(duration * SR);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const rng = rngFrom(5150);
  const put = (i, v, pan) => {
    if (i < 0 || i >= N) return;
    const a = (pan + 1) * Math.PI / 4;
    L[i] += v * Math.cos(a);
    R[i] += v * Math.sin(a);
  };
  /* RBJ band-pass, constant peak gain */
  const bandpass = (fc, q) => {
    const w0 = 2 * Math.PI * fc / SR;
    const al = Math.sin(w0) / (2 * q);
    const a0 = 1 + al;
    const b0 = al / a0;
    const b2 = -al / a0;
    const a1 = (-2 * Math.cos(w0)) / a0;
    const a2 = (1 - al) / a0;
    let x1 = 0; let x2 = 0; let y1 = 0; let y2 = 0;
    return (x) => {
      const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      return y;
    };
  };
  const white = () => rng() * 2 - 1;

  const tap = (t, amp, pan, fc = 3200, knock = 160) => {
    const s = Math.round(t * SR);
    const len = Math.round(0.12 * SR);
    const f = bandpass(fc * (0.85 + rng() * 0.3), 1.4);
    const kf = knock * (0.9 + rng() * 0.2);
    for (let n = 0; n < len; n++) {
      const e1 = Math.exp(-n / (0.007 * SR));
      const e2 = Math.exp(-n / (0.038 * SR));
      put(s + n, f(white()) * e1 * amp * 2.2 + Math.sin(2 * Math.PI * kf * n / SR) * e2 * amp * 0.8, pan);
    }
  };
  const scrape = (t, d, amp, pan = 0, fc = 2600) => {
    const s = Math.round(t * SR);
    const len = Math.round(d * SR);
    const f = bandpass(fc, 0.9);
    const ph = rng() * 6;
    let g = 0.6;
    for (let n = 0; n < len; n++) {
      if (n % 240 === 0) g = Math.max(0.25, Math.min(1, g + (rng() - 0.5) * 0.5));
      const env = Math.min(1, n / (0.015 * SR)) * Math.min(1, (len - n) / (0.04 * SR));
      const am = 0.55 + 0.45 * Math.sin(2 * Math.PI * 31 * n / SR + ph);
      put(s + n, f(white()) * env * am * g * amp * 2.4, pan + (n / len - 0.5) * 0.5);
    }
  };
  const whoosh = (t, d, v) => {
    const s = Math.round(t * SR);
    const len = Math.round(d * SR);
    let low = 0; let band = 0;
    for (let n = 0; n < len; n++) {
      const u = n / len;
      const fc = 240 + 1150 * Math.sin(Math.PI * u) ** 1.5;
      const fcoef = 2 * Math.sin(Math.PI * fc / SR);
      const x = white();
      low += fcoef * band;
      const high = x - low - 1.1 * band;
      band += fcoef * high;
      const env = Math.sin(Math.PI * u) ** 2 * 0.2 * (0.2 + 0.8 * v);
      put(s + n, band * env, -0.55 + 1.1 * u);
    }
  };
  const bar = (t, hz, amp, tau = 0.35, pan = 0) => {
    const s = Math.round(t * SR);
    const len = Math.round(tau * 5 * SR);
    for (let n = 0; n < len; n++) {
      const env = Math.min(1, n / (0.004 * SR)) * Math.exp(-n / (tau * SR));
      const v = Math.sin(2 * Math.PI * hz * n / SR) + 0.22 * Math.sin(2 * Math.PI * hz * 2.76 * n / SR) * Math.exp(-n / (tau * 0.3 * SR));
      put(s + n, v * env * amp, pan);
    }
  };
  const tone = (t, hz, amp, attack, tau, pan = 0) => {
    const s = Math.round(t * SR);
    const len = Math.min(N - s, Math.round((attack + tau * 4.5) * SR));
    for (let n = 0; n < len; n++) {
      const env = Math.min(1, n / (attack * SR)) * Math.exp(-Math.max(0, n - attack * SR) / (tau * SR));
      put(s + n, (Math.sin(2 * Math.PI * hz * n / SR) + Math.sin(2 * Math.PI * hz * 1.003 * n / SR)) * 0.5 * env * amp, pan);
    }
  };

  const scale = [587.33, 659.25, 739.99, 880, 987.77, 1174.66, 1318.51, 1479.98];
  let foundIdx = 0;
  let lockAt = end - 8;
  for (const c of cues) {
    const pan = (rng() - 0.5) * 0.9;
    if (c.k === 'land') tap(c.t, 0.2 * (0.7 + rng() * 0.3), pan);
    else if (c.k === 'leave') scrape(c.t, 0.07, 0.03, pan, 1900);
    else if (c.k === 'scrape') scrape(c.t, c.d, 0.085, pan * 0.5);
    else if (c.k === 'whoosh') whoosh(c.t, c.d, c.v);
    else if (c.k === 'found') { bar(c.t + 0.05, scale[Math.min(scale.length - 1, foundIdx)], 0.05, 0.38, pan * 0.6); foundIdx++; } else if (c.k === 'fold') {
      const s = Math.round(c.t * SR);
      const len = Math.round(0.16 * SR);
      let ph = 0;
      for (let n = 0; n < len; n++) { const u = n / len; ph += 2 * Math.PI * (180 + 300 * u) / SR; put(s + n - Math.round(0.12 * SR), Math.sin(ph) * Math.sin(Math.PI * u) * 0.09, 0); }
      tap(c.t, 0.22, 0, 2600, 120);
    } else if (c.k === 'drop') { tap(c.t, 0.2, pan, 2400, 105); tap(c.t + 0.24, 0.1, pan, 2400, 105); tap(c.t + 0.41, 0.05, pan, 2400, 105); } else if (c.k === 'lock') {
      lockAt = c.t;
      tap(c.t, 0.3, 0, 2200, 62);
      tone(c.t, 62, 0.38, 0.004, 0.2);
      [293.66, 369.99, 440, 587.33, 659.25].forEach((hz, i) => tone(c.t + 0.02 + i * 0.012, hz, 0.036, 0.03, 1.8, (i - 2) * 0.22));
    } else if (c.k === 'type') {
      for (let k = 0; k < c.n; k++) {
        if (rng() < 0.12) continue;
        tap(c.t + (k / c.n) * c.d + (rng() - 0.5) * 0.008, 0.028 * (0.6 + rng() * 0.6), (k / c.n - 0.5) * 0.7, 4200, 320);
      }
    }
  }
  /* the settle on the name and its entry */
  [587.33, 880].forEach((hz, i) => tone(end - 1.3 + i * 0.05, hz, 0.024, 0.25, 2.2, i ? 0.3 : -0.3));

  /* room tone and a low drone, swelling under the pull-back */
  let brown = 0;
  let brown2 = 0;
  for (let n = 0; n < N; n++) {
    const t = n / SR;
    brown = (brown + 0.02 * white()) / 1.02;
    brown2 += 0.016 * (brown - brown2); /* a second pole: air, not hiss */
    const swell = 1 + 0.9 * Math.exp(-(((t - (lockAt + 3.6)) / 1.9) ** 2));
    const fade = Math.min(1, t / 2) * Math.min(1, Math.max(0, (duration - t) / 1.8));
    const lfo = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.11 * t);
    const drone = 0.006 * Math.sin(2 * Math.PI * 73.42 * t) * lfo + 0.004 * Math.sin(2 * Math.PI * 110 * t + 1) * (1.6 - lfo) + 0.002 * Math.sin(2 * Math.PI * 146.83 * t + 2);
    const v = (brown2 * 0.075 + drone * 0.8) * swell * fade;
    L[n] += v;
    R[n] += v * 0.96;
  }

  /* master: soft clip, then peak to -3 dBFS */
  let peak = 0;
  for (let n = 0; n < N; n++) { L[n] = Math.tanh(1.4 * L[n]) / Math.tanh(1.4); R[n] = Math.tanh(1.4 * R[n]) / Math.tanh(1.4); peak = Math.max(peak, Math.abs(L[n]), Math.abs(R[n])); }
  const gain = 0.708 / (peak || 1);
  let sq = 0;
  const pcm = Buffer.alloc(44 + N * 4);
  pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 4, 40);
  for (let n = 0; n < N; n++) {
    const l = L[n] * gain;
    const r = R[n] * gain;
    sq += l * l + r * r;
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, l)) * 32767), 44 + n * 4);
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, r)) * 32767), 46 + n * 4);
  }
  fs.writeFileSync(file, pcm);
  return { seconds: +(N / SR).toFixed(2), preGainPeak: +peak.toFixed(3), gainDb: +(20 * Math.log10(gain)).toFixed(1), rmsDb: +(10 * Math.log10(sq / (2 * N))).toFixed(1) };
}
