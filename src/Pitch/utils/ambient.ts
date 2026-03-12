/**
 * PITCH — Ambient sound system: office hum + warm pad.
 * All procedurally generated via Web Audio API.
 */

let audioCtx: AudioContext | null = null;
let running = false;

// Nodes
let noiseSource: AudioBufferSourceNode | null = null;
let noiseGain: GainNode | null = null;
let noiseFilter: BiquadFilterNode | null = null;
let padOsc1: OscillatorNode | null = null;
let padOsc2: OscillatorNode | null = null;
let padGain: GainNode | null = null;
let masterGain: GainNode | null = null;

// Keyboard click interval
let clickTimer: ReturnType<typeof setInterval> | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
};

function createNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const size = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  // Pink-ish noise for office hum (gentler than white)
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
  }
  return buf;
}

let currentClickGain = 0.015;

function playKeyClick(): void {
  if (!running || !masterGain) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const freq = 2000 + Math.random() * 2000;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.015);
    g.gain.setValueAtTime(currentClickGain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.02);
  } catch { /* */ }
}

function startClicks(): void {
  stopClicks();
  // Random keyboard clicks every 80-300ms
  const tick = () => {
    playKeyClick();
    const next = 80 + Math.random() * 220;
    clickTimer = setTimeout(tick, next);
  };
  clickTimer = setTimeout(tick, 200 + Math.random() * 500);
}

function stopClicks(): void {
  if (clickTimer !== null) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
}

// Scene: noise volume, pad volume, filter cutoff, pad frequency, clicks on
const SCENE: Record<string, { noise: number; pad: number; freq: number; padHz: number; clicks: boolean; clickVol: number }> = {
  morning: { noise: 0.02, pad: 0.004, freq: 1200, padHz: 82, clicks: false, clickVol: 0 },
  build:   { noise: 0.035, pad: 0.005, freq: 900,  padHz: 78, clicks: true,  clickVol: 0.006 },
  pitch:   { noise: 0.015, pad: 0.007, freq: 600,  padHz: 73, clicks: false, clickVol: 0 },
  night:   { noise: 0.01,  pad: 0.006, freq: 500,  padHz: 70, clicks: false, clickVol: 0 },
  stream:  { noise: 0.015, pad: 0.007, freq: 600,  padHz: 73, clicks: false, clickVol: 0 },
  event:   { noise: 0.018, pad: 0.005, freq: 700,  padHz: 75, clicks: false, clickVol: 0 },
  dayEnd:  { noise: 0.015, pad: 0.005, freq: 800,  padHz: 77, clicks: false, clickVol: 0 },
};

const FADE = 1.5;

export function startAmbient(scene = 'morning'): void {
  if (running) return;
  running = true;

  const ctx = getCtx();
  const now = ctx.currentTime;

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(1, now + FADE);
  masterGain.connect(ctx.destination);

  // ── Office hum layer ──
  const noiseBuf = createNoiseBuffer(ctx, 3);
  noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuf;
  noiseSource.loop = true;

  noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.Q.value = 0.5;

  noiseGain = ctx.createGain();

  noiseSource.connect(noiseFilter).connect(noiseGain).connect(masterGain);
  noiseSource.start(now);

  // ── Warm pad (two detuned oscillators) ──
  padGain = ctx.createGain();

  padOsc1 = ctx.createOscillator();
  padOsc1.type = 'sine';

  padOsc2 = ctx.createOscillator();
  padOsc2.type = 'sine';

  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 250;
  padFilter.Q.value = 0.7;

  padOsc1.connect(padFilter);
  padOsc2.connect(padFilter);
  padFilter.connect(padGain).connect(masterGain);

  padOsc1.start(now);
  padOsc2.start(now);

  setAmbientScene(scene);
}

export function setAmbientScene(scene: string): void {
  if (!running || !noiseGain || !noiseFilter || !padGain || !padOsc1 || !padOsc2) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  const p = SCENE[scene] ?? SCENE.morning;

  noiseGain.gain.cancelScheduledValues(now);
  noiseGain.gain.setValueAtTime(noiseGain.gain.value, now);
  noiseGain.gain.linearRampToValueAtTime(p.noise, now + FADE);

  noiseFilter.frequency.cancelScheduledValues(now);
  noiseFilter.frequency.setValueAtTime(noiseFilter.frequency.value, now);
  noiseFilter.frequency.linearRampToValueAtTime(p.freq, now + FADE);

  padGain.gain.cancelScheduledValues(now);
  padGain.gain.setValueAtTime(padGain.gain.value, now);
  padGain.gain.linearRampToValueAtTime(p.pad, now + FADE);

  padOsc1.frequency.cancelScheduledValues(now);
  padOsc1.frequency.setValueAtTime(padOsc1.frequency.value, now);
  padOsc1.frequency.linearRampToValueAtTime(p.padHz, now + FADE);

  padOsc2.frequency.cancelScheduledValues(now);
  padOsc2.frequency.setValueAtTime(padOsc2.frequency.value, now);
  padOsc2.frequency.linearRampToValueAtTime(p.padHz * 1.005, now + FADE);

  currentClickGain = p.clickVol;
  if (p.clicks) startClicks();
  else stopClicks();
}

export function stopAmbient(): void {
  if (!running) return;
  running = false;
  stopClicks();

  const ctx = getCtx();
  const now = ctx.currentTime;

  if (masterGain) {
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + FADE);
  }

  setTimeout(() => {
    try { noiseSource?.stop(); } catch { /* */ }
    try { padOsc1?.stop(); } catch { /* */ }
    try { padOsc2?.stop(); } catch { /* */ }
    try { masterGain?.disconnect(); } catch { /* */ }
    noiseSource = null; noiseGain = null; noiseFilter = null;
    padOsc1 = null; padOsc2 = null; padGain = null;
    masterGain = null;
  }, FADE * 1000 + 200);
}
