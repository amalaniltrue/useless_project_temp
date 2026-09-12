// PawLingo Organic Audio Synthesis, Real Audio Engine & Ambient BGM System
// Generates biological animal vocal tract acoustics, seamlessly loads real animal audio tracks, and powers ambient BGM

import type { AudioParams, StressLevel, DurationLevel } from '@/types';

let audioContext: AudioContext | null = null;
const audioBufferCache: Map<string, AudioBuffer | null> = new Map();
const audioFetchAttempts: Set<string> = new Set();

interface ActiveAudioHandle {
  stop: () => void;
  disconnect: () => void;
}

const activeAudioHandles: Set<ActiveAudioHandle> = new Set();

/**
 * Immediately stop and silence all playing animal acoustic sources
 */
export function stopAllSounds(): void {
  try {
    activeAudioHandles.forEach((handle) => {
      try {
        handle.stop();
      } catch {}
      try {
        handle.disconnect();
      } catch {}
    });
    activeAudioHandles.clear();
  } catch {}
}

// Ensure audio context unlocks on first interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch {}
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

function getAudioContext(): AudioContext {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext is only available in browser');
  }
  if (!audioContext || audioContext.state === 'closed') {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Check if a real audio file exists and play it, or fall back to organic procedural synthesis
 */
export function playSound(
  params: AudioParams,
  stress: StressLevel = 'neutral',
  durationModifier: DurationLevel = 'medium'
): void {
  // If a real audio file is specified, attempt to play it first
  if (params.realAudioFile && typeof window !== 'undefined') {
    tryPlayRealAudioTrack(params.realAudioFile, stress, durationModifier)
      .then((played) => {
        if (!played) {
          synthesizeOrganicAnimalSound(params, stress, durationModifier);
        }
      })
      .catch(() => {
        synthesizeOrganicAnimalSound(params, stress, durationModifier);
      });
    return;
  }

  // Otherwise synthesize directly
  synthesizeOrganicAnimalSound(params, stress, durationModifier);
}

/**
 * Attempt to load and play real recorded audio track from public/sounds/animals/ or /audio/animals/
 */
async function tryPlayRealAudioTrack(
  filePath: string,
  stress: StressLevel,
  durationModifier: DurationLevel
): Promise<boolean> {
  try {
    const ctx = getAudioContext();

    // Normalize path if needed
    let resolvedPath = filePath;
    if (filePath.startsWith('/audio/animals/')) {
      resolvedPath = filePath.replace('/audio/animals/', '/sounds/animals/');
    }

    // Check memory cache
    let buffer = audioBufferCache.get(resolvedPath);

    if (buffer === undefined) {
      audioFetchAttempts.add(resolvedPath);
      const res = await fetch(resolvedPath);
      if (!res.ok) {
        audioBufferCache.set(resolvedPath, null);
        return false;
      }
      const arrayBuffer = await res.arrayBuffer();
      buffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferCache.set(resolvedPath, buffer);
    }

    if (!buffer) return false;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    let playbackRate = 1.0;
    if (durationModifier === 'short') playbackRate = 1.25;
    else if (durationModifier === 'long') playbackRate = 0.88;
    else if (durationModifier === 'very-long') playbackRate = 0.78;

    source.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);

    let gainVal = 0.75;
    if (stress === 'whisper') gainVal = 0.25;
    else if (stress === 'soft') gainVal = 0.45;
    else if (stress === 'neutral') gainVal = 0.75;
    else if (stress === 'emphasized') gainVal = 0.95;
    else if (stress === 'loud') gainVal = 1.2;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    const handle: ActiveAudioHandle = {
      stop: () => {
        try {
          source.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          source.disconnect();
          gainNode.disconnect();
        } catch {}
      },
    };
    activeAudioHandles.add(handle);

    source.onended = () => {
      activeAudioHandles.delete(handle);
    };

    source.start(0);

    // If a short bark/sound was requested, automatically stop after at most 2.2 seconds
    if (durationModifier === 'short' && buffer.duration > 2.2) {
      try {
        source.stop(ctx.currentTime + 2.2);
      } catch {}
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Biological Vocal-Tract & Formant Synthesis Engine
 * Models real animal glottal pulses, vocal tract resonances (F1/F2 formants), dynamic pitch contours, and breath turbulence
 */
function synthesizeOrganicAnimalSound(
  params: AudioParams,
  stress: StressLevel,
  durationModifier: DurationLevel
): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + 0.005;

    // 1. Calculate duration scaling
    let durationMultiplier = 1.0;
    if (durationModifier === 'short') durationMultiplier = 0.55;
    else if (durationModifier === 'medium') durationMultiplier = 1.0;
    else if (durationModifier === 'long') durationMultiplier = 1.7;
    else if (durationModifier === 'very-long') durationMultiplier = 2.6;

    const actualDuration = Math.max(0.12, params.duration * durationMultiplier);

    // 2. Calculate volume and pitch scaling by stress
    let gainMultiplier = 0.5;
    let pitchMultiplier = 1.0;
    if (stress === 'whisper') {
      gainMultiplier = 0.15;
      pitchMultiplier = 1.08;
    } else if (stress === 'soft') {
      gainMultiplier = 0.3;
      pitchMultiplier = 0.98;
    } else if (stress === 'neutral') {
      gainMultiplier = 0.5;
      pitchMultiplier = 1.0;
    } else if (stress === 'emphasized') {
      gainMultiplier = 0.75;
      pitchMultiplier = 1.12;
    } else if (stress === 'loud') {
      gainMultiplier = 0.95;
      pitchMultiplier = 1.22;
    }

    const baseFrequency = Math.max(30, params.frequency * pitchMultiplier);

    // 3. Master Gain Node with ADSR envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);

    const actualAttack = Math.min(params.attack, actualDuration * 0.25);
    const actualDecay = Math.min(params.decay, actualDuration * 0.25);
    const actualRelease = Math.min(params.release, actualDuration * 0.35);

    masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, gainMultiplier), now + actualAttack);
    masterGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, gainMultiplier * params.sustain),
      now + actualAttack + actualDecay
    );
    const sustainEnd = Math.max(now + actualAttack + actualDecay, now + actualDuration - actualRelease);
    masterGain.gain.setValueAtTime(Math.max(0.001, gainMultiplier * params.sustain), sustainEnd);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + actualDuration);

    // 4. Glottal Flutter / Tremolo
    let flutterGainNode: GainNode | null = null;
    if (params.glottalPuffRate && params.glottalPuffRate > 0) {
      flutterGainNode = ctx.createGain();
      const flutterOsc = ctx.createOscillator();
      const flutterDepth = ctx.createGain();

      flutterOsc.type = 'sine';
      flutterOsc.frequency.setValueAtTime(params.glottalPuffRate, now);

      flutterDepth.gain.setValueAtTime(0.6, now);
      flutterOsc.connect(flutterDepth);
      flutterDepth.connect(flutterGainNode.gain);

      flutterOsc.start(now);
      flutterOsc.stop(now + actualDuration);
    }

    // 5. Vocal Tract Formant Filters (F1 & F2)
    const formantFilter1 = ctx.createBiquadFilter();
    formantFilter1.type = 'bandpass';
    formantFilter1.Q.setValueAtTime(4.5, now);

    const formantFilter2 = ctx.createBiquadFilter();
    formantFilter2.type = 'bandpass';
    formantFilter2.Q.setValueAtTime(5.5, now);

    if (params.formantTrajectory && params.formantTrajectory.length > 0) {
      params.formantTrajectory.forEach((kf, idx) => {
        const kfTime = now + kf.timeOffset * actualDuration;
        if (idx === 0) {
          formantFilter1.frequency.setValueAtTime(kf.f1, kfTime);
          formantFilter2.frequency.setValueAtTime(kf.f2, kfTime);
        } else {
          formantFilter1.frequency.exponentialRampToValueAtTime(Math.max(50, kf.f1), kfTime);
          formantFilter2.frequency.exponentialRampToValueAtTime(Math.max(50, kf.f2), kfTime);
        }
      });
    } else {
      const defaultF1 = Math.max(120, Math.min(950, baseFrequency * 1.5));
      const defaultF2 = Math.max(300, Math.min(2800, baseFrequency * 3.2));
      formantFilter1.frequency.setValueAtTime(defaultF1, now);
      formantFilter2.frequency.setValueAtTime(defaultF2, now);
    }

    const formantMixer = ctx.createGain();
    formantMixer.gain.setValueAtTime(1.0, now);
    formantFilter1.connect(formantMixer);
    formantFilter2.connect(formantMixer);

    // 6. Glottal Vocal Excitation Source
    const primaryOsc = ctx.createOscillator();
    primaryOsc.type = params.waveform;

    if (params.pitchTrajectory && params.pitchTrajectory.length > 0) {
      params.pitchTrajectory.forEach((kf, idx) => {
        const kfTime = now + kf.timeOffset * actualDuration;
        const targetFreq = Math.max(20, baseFrequency * kf.pitchFactor);
        if (idx === 0) {
          primaryOsc.frequency.setValueAtTime(targetFreq, kfTime);
        } else {
          primaryOsc.frequency.exponentialRampToValueAtTime(targetFreq, kfTime);
        }
      });
    } else {
      primaryOsc.frequency.setValueAtTime(baseFrequency, now);
    }

    const harmonicOsc = ctx.createOscillator();
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(baseFrequency * 2.02, now);
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.25, now);
    harmonicOsc.connect(harmonicGain);

    if (params.modFrequency && params.modDepth) {
      const vibratoOsc = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibratoOsc.type = 'sine';
      vibratoOsc.frequency.setValueAtTime(params.modFrequency, now);
      vibratoGain.gain.setValueAtTime(params.modDepth * (stress === 'loud' ? 1.3 : 1.0), now);
      vibratoOsc.connect(vibratoGain);
      vibratoGain.connect(primaryOsc.frequency);
      vibratoGain.connect(harmonicOsc.frequency);
      vibratoOsc.start(now);
      vibratoOsc.stop(now + actualDuration);
    }

    primaryOsc.connect(formantFilter1);
    primaryOsc.connect(formantFilter2);
    harmonicGain.connect(formantFilter1);
    harmonicGain.connect(formantFilter2);

    primaryOsc.start(now);
    harmonicOsc.start(now);
    primaryOsc.stop(now + actualDuration);
    harmonicOsc.stop(now + actualDuration);

    // 7. Breath & Turbulent Noise Layer
    const effectiveNoiseLevel = (params.noiseLevel || 0) * (stress === 'whisper' ? 1.6 : 1.0);
    if (effectiveNoiseLevel > 0) {
      const bufferSize = Math.floor(ctx.sampleRate * actualDuration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        const pink = (b0 + b1 + b2 + white * 0.5362) * 0.3;
        output[i] = pink * effectiveNoiseLevel;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = params.noiseFilterType || params.filterType || 'bandpass';
      noiseFilter.frequency.setValueAtTime(
        params.noiseFilterFreq || params.filterFrequency || 2800,
        now
      );
      noiseFilter.Q.setValueAtTime(2.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, effectiveNoiseLevel * gainMultiplier * 0.8),
        now + actualAttack
      );
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + actualDuration);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noiseSource.start(now);
      noiseSource.stop(now + actualDuration);
    }

    // 8. Output
    if (flutterGainNode) {
      formantMixer.connect(flutterGainNode);
      flutterGainNode.connect(masterGain);
    } else {
      formantMixer.connect(masterGain);
    }

    masterGain.connect(ctx.destination);
  } catch (err) {
    console.warn('Animal vocal tract synthesis warning:', err);
  }
}

// ==========================================
// UI Tones & System Chimes
// ==========================================

export function playTapTone(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch {}
}

export function playAppLaunchTone(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch {}
}

export function playNotificationTone(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch {}
}

export function playPhoneRing(): () => void {
  try {
    const ctx = getAudioContext();
    let isPlaying = true;
    let timerId: NodeJS.Timeout | null = null;

    const playBursts = () => {
      if (!isPlaying) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(450, now);
      osc2.frequency.setValueAtTime(520, now);
      osc1.type = 'sine';
      osc2.type = 'sine';

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.setValueAtTime(0.15, now + 1.2);
      gain.gain.linearRampToValueAtTime(0, now + 1.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);

      timerId = setTimeout(playBursts, 3000);
    };

    playBursts();

    return () => {
      isPlaying = false;
      if (timerId) clearTimeout(timerId);
    };
  } catch {
    return () => {};
  }
}

export function playCallConnectedTone(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.12);
    osc.frequency.setValueAtTime(783.99, now + 0.24);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (err) {
    console.warn(err);
  }
}

export function playCallEndTone(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.setValueAtTime(300, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (err) {
    console.warn(err);
  }
}

export async function playSoundSequence(
  paramsList: AudioParams[],
  gapMs: number = 200
): Promise<void> {
  for (const params of paramsList) {
    playSound(params);
    await new Promise((resolve) => setTimeout(resolve, params.duration * 1000 + gapMs));
  }
}

// ==========================================
// Ambient BGM (Background Music) System
// ==========================================

export interface BgmTrack {
  id: string;
  title: string;
  artist: string;
  species: 'cat' | 'dog' | 'ambient';
  category: string;
  description: string;
  file: string;
}

export const BGM_PLAYLIST: BgmTrack[] = [
  {
    id: 'cat_purr_loop',
    title: 'Purr Therapy (26Hz Resonance)',
    artist: 'Kalyani & Ramesh',
    species: 'cat',
    category: 'Healing & Relaxation',
    description: 'Deep somatic purring frequencies for calm and contentment',
    file: '/sounds/animals/cat/cat_purr.mp3',
  },
  {
    id: 'cat_sweet_trills',
    title: 'Morning Sunbeam Trills',
    artist: 'Emotional Damage the Bengal',
    species: 'cat',
    category: 'Gentle Melodies',
    description: 'Chirrup and greeting trills recorded in golden morning light',
    file: '/sounds/animals/cat/cat_trill_sweet.wav',
  },
  {
    id: 'dog_timberwolf',
    title: 'Alpine Timberwolf Chorus',
    artist: 'Bombastic Lady the Siberian Husky',
    species: 'dog',
    category: 'Pack Resonance',
    description: 'Harmonic distance howl echoes rolling across the snowline',
    file: '/sounds/animals/dog/dog_howl_pack.mp3',
  },
  {
    id: 'cat_dragon_purr',
    title: 'Cozy Fireside Purr',
    artist: 'Asbestos & Friends',
    species: 'cat',
    category: 'Deep Rest',
    description: 'Warm, low-rumble sleep acoustics for deep relaxation',
    file: '/sounds/animals/cat/dragon-studio-purring-cat-401727.mp3',
  },
  {
    id: 'dog_park_zoomies',
    title: 'Meadow Zoomies & Breeze',
    artist: 'Benjamin & Shantha',
    species: 'dog',
    category: 'Upbeat Energy',
    description: 'Joyful rhythmic dog play acoustics and happy outdoor energy',
    file: '/sounds/animals/dog/dog_pant_active.mp3',
  },
  {
    id: 'cat_ambient_song',
    title: 'Feline Ambient Lullaby',
    artist: 'Bella the Tabby',
    species: 'cat',
    category: 'Continuous Melody',
    description: 'Gentle cat vocal glides blended with soft acoustic resonance',
    file: '/sounds/animals/cat/cat_meow_continuous.mp3',
  },
];

let currentBgmAudio: HTMLAudioElement | null = null;
let currentBgmTrackIdx: number = 0;
let bgmVolume: number = 0.65;
let isBgmPlaying: boolean = false;

export function getBgmState() {
  return {
    isPlaying: isBgmPlaying,
    trackIndex: currentBgmTrackIdx,
    currentTrack: BGM_PLAYLIST[currentBgmTrackIdx],
    volume: bgmVolume,
  };
}

function broadcastBgmChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('pawlingo_bgm_change', {
        detail: getBgmState(),
      })
    );
  }
}

export function playBgm(trackIdx?: number) {
  if (typeof window === 'undefined') return;

  if (typeof trackIdx === 'number') {
    currentBgmTrackIdx = (trackIdx + BGM_PLAYLIST.length) % BGM_PLAYLIST.length;
  }

  const track = BGM_PLAYLIST[currentBgmTrackIdx];

  if (!currentBgmAudio) {
    currentBgmAudio = new Audio();
    currentBgmAudio.loop = true;
    currentBgmAudio.addEventListener('ended', () => {
      nextBgm();
    });
  }

  const src = track.file;
  if (currentBgmAudio.src !== window.location.origin + src && !currentBgmAudio.src.endsWith(src)) {
    currentBgmAudio.src = src;
  }

  currentBgmAudio.volume = bgmVolume;
  currentBgmAudio
    .play()
    .then(() => {
      isBgmPlaying = true;
      broadcastBgmChange();
    })
    .catch(() => {
      // Autoplay restriction or decode error
      isBgmPlaying = false;
      broadcastBgmChange();
    });
}

export function pauseBgm() {
  if (currentBgmAudio) {
    currentBgmAudio.pause();
  }
  isBgmPlaying = false;
  broadcastBgmChange();
}

export function toggleBgm() {
  if (isBgmPlaying) {
    pauseBgm();
  } else {
    playBgm();
  }
}

export function nextBgm() {
  currentBgmTrackIdx = (currentBgmTrackIdx + 1) % BGM_PLAYLIST.length;
  playBgm(currentBgmTrackIdx);
}

export function prevBgm() {
  currentBgmTrackIdx = (currentBgmTrackIdx - 1 + BGM_PLAYLIST.length) % BGM_PLAYLIST.length;
  playBgm(currentBgmTrackIdx);
}

export function setBgmVolume(val: number) {
  bgmVolume = Math.max(0, Math.min(1, val));
  if (currentBgmAudio) {
    currentBgmAudio.volume = bgmVolume;
  }
  broadcastBgmChange();
}
