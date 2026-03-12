/**
 * PITCH — synthesized sound effects via Web Audio API.
 * All sounds are procedurally generated (no audio files needed).
 */

let audioCtx: AudioContext | null = null;

const ctx = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
};

export const resumeAudio = (): void => {
  const c = ctx();
  if (c.state === 'suspended') c.resume();
};

type OscType = OscillatorType;

function tone(
  freq: number, duration: number,
  { type = 'sine' as OscType, gain = 0.12, freqEnd = freq, gainEnd = 0.001,
    delay = 0 } = {}
): void {
  try {
    const c = ctx();
    const now = c.currentTime + delay;
    const osc = c.createOscillator();
    const g   = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== freq) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(gainEnd, now + duration);
    osc.connect(g).connect(c.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch { /* ignore */ }
}

/** Soft click */
export const playClick = (): void => {
  tone(280, 0.04, { type: 'sine', gain: 0.06, freqEnd: 240 });
};

/** Confirm */
export const playConfirm = (): void => {
  tone(500, 0.06, { type: 'sine', gain: 0.08, freqEnd: 600 });
  tone(600, 0.07, { type: 'sine', gain: 0.06, freqEnd: 720, delay: 0.06 });
};

/** Panel open */
export const playPanelOpen = (): void => {
  tone(600, 0.06, { type: 'sine', gain: 0.06, freqEnd: 750 });
};

/** Game start — startup chime */
export const playGameStart = (): void => {
  [0, 0.1, 0.2, 0.32].forEach((delay, i) => {
    const freqs = [330, 440, 550, 880];
    tone(freqs[i], 0.12, { type: 'sine', gain: 0.08, freqEnd: freqs[i] * 1.03, delay });
  });
};

/** Pitch session start — meeting room ambiance */
export const playStreamStart = (): void => {
  tone(200, 0.15, { type: 'sine', gain: 0.08, freqEnd: 300 });
  tone(500, 0.15, { type: 'sine', gain: 0.07, freqEnd: 700, delay: 0.12 });
  tone(700, 0.18, { type: 'sine', gain: 0.06, freqEnd: 900, delay: 0.25 });
};

/** Story event — soft ping */
export const playEvent = (): void => {
  tone(880, 0.08, { type: 'sine', gain: 0.09, freqEnd: 1100 });
  tone(660, 0.12, { type: 'sine', gain: 0.06, freqEnd: 600, delay: 0.08 });
};

/** Stat up */
export const playStatUp = (): void => {
  tone(500, 0.06, { type: 'sine', gain: 0.07 });
  tone(700, 0.08, { type: 'sine', gain: 0.06, delay: 0.06 });
};

/** Stat down */
export const playStatDown = (): void => {
  tone(350, 0.1, { type: 'sine', gain: 0.08, freqEnd: 200 });
};

/** Slot-machine counting tick — plays per digit change during stat animation */
export const playCountTick = (up: boolean): void => {
  const freq = up ? 800 + Math.random() * 200 : 400 + Math.random() * 100;
  tone(freq, 0.025, { type: 'sine', gain: 0.04, freqEnd: freq * (up ? 1.1 : 0.9) });
};

/** Day end */
export const playDayEnd = (): void => {
  [[440, 0], [550, 0.1], [660, 0.2], [880, 0.32]].forEach(([freq, delay]) => {
    tone(freq, 0.12, { type: 'sine', gain: 0.07, delay });
  });
};

/** Game over */
export const playGameOver = (): void => {
  tone(440, 0.25, { type: 'sine', gain: 0.1, freqEnd: 330 });
  tone(330, 0.3,  { type: 'sine', gain: 0.09, freqEnd: 220, delay: 0.2 });
  tone(220, 0.5,  { type: 'sine', gain: 0.08, freqEnd: 110, delay: 0.45 });
};

/** Victory ending */
export const playVictory = (): void => {
  [[440, 0], [550, 0.1], [660, 0.2], [880, 0.32], [1100, 0.46]].forEach(([freq, delay]) => {
    tone(freq, 0.15, { type: 'sine', gain: 0.09, freqEnd: freq * 1.02, delay });
  });
};
