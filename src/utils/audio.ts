// Web Audio API Synthesizer for laboratory sounds used in the Milk experiment.
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play mechanical click sound for buttons and dials
export const playClickSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(450, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.06);
};

// Play liquid pour/slosh sound
export const playPourSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 1.2;
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  // Fill buffer with white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(12, ctx.currentTime);
  filter.frequency.setValueAtTime(500, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
  
  for (let t = 0; t < duration; t += 0.15) {
    gain.gain.setValueAtTime(0.12, ctx.currentTime + t);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + t + 0.08);
  }
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  noise.stop(ctx.currentTime + duration);
};
