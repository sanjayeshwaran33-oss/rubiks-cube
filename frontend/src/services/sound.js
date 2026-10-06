// Netflix Web Audio Sound Synthesizer (Zero external dependencies)
let audioCtx = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

/**
 * Synthesizes the iconic Netflix "Ta-dum" intro chord & sub-bass swell
 */
export const playTaDum = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Sub-Bass Thud (The "Ta" part)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // 2. Cinematic Chord Strike (The "Dummm" part - 120ms delay)
    const chordTime = now + 0.14;
    const freqs = [73.42, 110.00, 146.83, 220.00, 293.66]; // D2, A2, D3, A3, D4

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, chordTime);

      // Low pass filter sweep for dramatic swell
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, chordTime);
      filter.frequency.exponentialRampToValueAtTime(2400, chordTime + 0.25);
      filter.frequency.exponentialRampToValueAtTime(300, chordTime + 1.8);

      gain.gain.setValueAtTime(0.01, chordTime);
      gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), chordTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(chordTime);
      osc.stop(chordTime + 2.3);
    });

    // 3. Metallic Shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(880, chordTime + 0.1);
    shimmerGain.gain.setValueAtTime(0.08, chordTime + 0.1);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, chordTime + 1.6);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(chordTime + 0.1);
    shimmerOsc.stop(chordTime + 1.7);
  } catch (err) {
    console.warn('Audio synthesis issue:', err);
  }
};

/**
 * Subtle UI click sound
 */
export const playClickSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch (err) {}
};

/**
 * Smooth pop sound for hover / modal open
 */
export const playHoverSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.05);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {}
};
