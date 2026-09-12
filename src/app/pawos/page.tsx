'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  Radio,
  Image as ImageIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  PAWSCRIPT_ALPHABET,
  translateToPawScript,
} from '@/lib/pawscript';
import { playSound, stopAllSounds } from '@/lib/sounds';
import { IPadFrame } from '@/components/ui/IPadFrame';
import Link from 'next/link';

type AppId =
  | 'terminal'
  | 'purrify'
  | 'notes'
  | 'pawscript'
  | 'pawsearch'
  | 'petgram'
  | 'pawchat'
  | 'pawmatch';

interface OpenWindow {
  id: AppId;
  title: string;
  icon: string;
  isMinimized: boolean;
  zIndex: number;
}

export interface TherapyTrack {
  id: string;
  name: string;
  species: 'cat' | 'dog' | 'ambient';
  icon: string;
  description: string;
  frequencyBadge: string;
  file: string;
}

export const THERAPY_TRACKS: TherapyTrack[] = [
  {
    id: 'purr_26hz',
    name: 'Feline 26Hz Bone-Healing Purr',
    species: 'cat',
    icon: '🐱',
    description: 'Calibrated 25–50Hz resonant vibration clinically documented to relieve cat stress, stimulate bone density healing, and lower human heart rates.',
    frequencyBadge: '26Hz Somatic Purr',
    file: '/sounds/animals/cat/cat_purr.mp3',
  },
  {
    id: 'canine_breath',
    name: 'Canine Anti-Anxiety Heartbeat & Breath',
    species: 'dog',
    icon: '🐕',
    description: 'Calm rhythmic resting breath and subtle canine heartbeat designed to alleviate separation anxiety during thunderstorms and fireworks.',
    frequencyBadge: 'Canine Calming Rhythm',
    file: '/sounds/animals/dog/dog_pant_breath.mp3',
  },
  {
    id: 'fireside_purr',
    name: 'Cozy Fireside Deep Slumber',
    species: 'cat',
    icon: '🛋️',
    description: 'Deep warm resonant purr rumble creating a safe acoustic environment for restless kittens, senior cats, and rescue pets.',
    frequencyBadge: 'Deep Somatic Bass',
    file: '/sounds/animals/cat/dragon-studio-purring-cat-401727.mp3',
  },
  {
    id: 'wolf_harmony',
    name: 'Alpine Timberwolf Pack Chorus',
    species: 'dog',
    icon: '🐺',
    description: 'Harmonic distant howl echoes rolling across alpine snowlines to satisfy canine pack bonding instinct and reduce isolation anxiety.',
    frequencyBadge: 'Pack Harmonic Echo',
    file: '/sounds/animals/dog/dog_howl_pack.mp3',
  },
  {
    id: 'morning_trills',
    name: 'Morning Sunbeam Kitten Trills',
    species: 'cat',
    icon: '☀️',
    description: 'Cheerful chirrups and greeting trills recorded in golden morning light to stimulate gentle alertness and playfulness.',
    frequencyBadge: 'Feline Serotonin Lift',
    file: '/sounds/animals/cat/cat_trill_sweet.wav',
  },
];

export interface CallerToy {
  id: string;
  name: string;
  icon: string;
  category: 'Feline' | 'Canine' | 'All Pets';
  type: 'can_opener' | 'squeaker' | 'doorbell' | 'whistle' | 'kitten' | 'bark';
  triggerEffect: string;
  description: string;
}

export const CALLER_TOYS: CallerToy[] = [
  {
    id: 'can_opener',
    name: 'Wet Food Can Opener',
    icon: '🥫',
    category: 'All Pets',
    type: 'can_opener',
    triggerEffect: 'Sprint to kitchen at supersonic speed',
    description: 'The sharp suction pop of a tin lid & metallic spoon tap that instantly summons cats and dogs from deep sleep.',
  },
  {
    id: 'squeaker',
    name: '900Hz Squeaker Toy',
    icon: '🎾',
    category: 'Canine',
    type: 'squeaker',
    triggerEffect: 'Immediate 45° head tilt & ear perk',
    description: 'Resonant high-pitch squeak that stimulates canine play curiosity.',
  },
  {
    id: 'doorbell',
    name: 'Ding-Dong Doorbell',
    icon: '🔔',
    category: 'Canine',
    type: 'doorbell',
    triggerEffect: 'Curious trot to the front door',
    description: 'Classic dual-tone chime (587Hz / 440Hz) for desensitization training or alert testing.',
  },
  {
    id: 'whistle',
    name: 'Canine Recall Whistle',
    icon: '🔊',
    category: 'Canine',
    type: 'whistle',
    triggerEffect: 'Instant attention & looking up',
    description: 'Piercing high-pitch acoustic sweep that penetrates through walls and outdoor distance.',
  },
  {
    id: 'kitten',
    name: 'Curious Kitten Mew',
    icon: '🐱',
    category: 'Feline',
    type: 'kitten',
    triggerEffect: 'Nurturing check-in & nose boop',
    description: 'High-frequency kitten vocalization that brings adult cats over to investigate.',
  },
  {
    id: 'bark',
    name: 'Friendly Play Bark',
    icon: '🐕',
    category: 'Canine',
    type: 'bark',
    triggerEffect: 'Tail wag & play bow stance',
    description: 'Upbeat greeting vocalization inviting dogs to socialize and interact.',
  },
];

export const PAWOS_WALLPAPER_PRESETS: Array<{ id: string; name: string; bgImage?: string; gradient?: string }> = [
  { id: 'cat_wallpaper', name: '🐱 Sunbeam Tabby', bgImage: "url('/pictures/cat/Wallpaper.webp')" },
  { id: 'benjamin_scholar', name: '🤓 Benjamin Dog', bgImage: "url('/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp')" },
  { id: 'husky_snow', name: '❄️ Arctic Husky', bgImage: "url('/images/animals/husky_snow.jpg')" },
  { id: 'golden_meadow', name: '🌾 Golden Meadow', bgImage: "url('/pictures/dog/funny-dog-pics-6-10-24-2024.webp')" },
  { id: 'kalyani_acrobat', name: '🎪 Kalyani Calico', bgImage: "url('/pictures/cat/CWbUskSKeMT-png__700.webp')" },
  { id: 'lady_dimitrescu', name: '👑 Lady Dimitrescu', bgImage: "url('/pictures/cat/CQRCz9RppTd-png__700.webp')" },
  { id: 'forest', name: '🌲 Deep Forest', gradient: 'linear-gradient(135deg, #064e3b, #134e4a, #052e16)' },
  { id: 'cyber', name: '🌌 Cyber Night', gradient: 'linear-gradient(135deg, #020617, #18181b, #172554)' },
];

function triggerPetToySound(type: 'can_opener' | 'squeaker' | 'doorbell' | 'whistle' | 'kitten' | 'bark') {
  if (typeof window === 'undefined') return;

  if (type === 'kitten') {
    const audio = new Audio('/sounds/animals/cat/cat_mew_kitten.wav');
    audio.play().catch(() => {});
    return;
  }
  if (type === 'bark') {
    const audio = new Audio('/sounds/animals/dog/dog_bark_play.mp3');
    audio.play().catch(() => {});
    return;
  }

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    if (type === 'can_opener') {
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(350, now);
      osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.05);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      g1.gain.setValueAtTime(0.8, now);
      g1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2600, now + 0.06);
      g2.gain.setValueAtTime(0.35, now + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.46);
    } else if (type === 'squeaker') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(860, now);
      osc.frequency.linearRampToValueAtTime(1180, now + 0.09);
      osc.frequency.linearRampToValueAtTime(890, now + 0.2);
      g.gain.setValueAtTime(0.7, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (type === 'doorbell') {
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      g1.gain.setValueAtTime(0.6, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.65);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.4);
      g2.gain.setValueAtTime(0.6, now + 0.4);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now + 0.4);
      osc2.stop(now + 1.25);
    } else if (type === 'whistle') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(11000, now);
      osc.frequency.linearRampToValueAtTime(13500, now + 0.15);
      osc.frequency.linearRampToValueAtTime(11000, now + 0.35);
      g.gain.setValueAtTime(0.45, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    }
  } catch {}
}

export default function PawOSPage() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([
    { id: 'terminal', title: 'BarkShell v2.4 (tty1)', icon: '💻', isMinimized: false, zIndex: 10 },
  ]);
  const [activeWindow, setActiveWindow] = useState<AppId | null>('terminal');
  const [currentTime, setCurrentTime] = useState('');
  const [wallpaper, setWallpaper] = useState<string>('cat_wallpaper');
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);
  const [maxZ, setMaxZ] = useState(11);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'paw-init --kernel=cross-species',
      output: 'PawOS Kernel 6.14-paw initialized.\nAll scents, acoustics, and tail-wag protocols active.\nType "help" for animal commands.',
    },
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  // Purrify Acoustics State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedTherapyId, setSelectedTherapyId] = useState('purr_26hz');
  const [purrifyVolume, setPurrifyVolume] = useState(0.7);
  const [purrifyTab, setPurrifyTab] = useState<'therapy' | 'toys' | 'about'>('therapy');
  const [lastTriggeredToy, setLastTriggeredToy] = useState<CallerToy | null>(null);
  const purrifyAudioRef = useRef<HTMLAudioElement | null>(null);

  // Notes state
  const [notesText, setNotesText] = useState(
    'PawNotes:\n- Remind human to refill crunchies bowl at 4 PM\n- High squirrel activity near tree #3\n- Nap under the living room sunbeam at 11:30 AM'
  );

  // Quick Translator in OS
  const [osTranslateInput, setOsTranslateInput] = useState('meow purr bark');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Wallpapers from localStorage
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedCustom = localStorage.getItem('pawpad_custom_wallpaper');
        if (savedCustom) setCustomWallpaper(savedCustom);
        const savedW = localStorage.getItem('pawpad_wallpaper');
        if (savedW) setWallpaper(savedW);
      } catch {}
    });

    const handleSync = () => {
      try {
        const savedCustom = localStorage.getItem('pawpad_custom_wallpaper');
        if (savedCustom) setCustomWallpaper(savedCustom);
        const savedW = localStorage.getItem('pawpad_wallpaper');
        if (savedW) setWallpaper(savedW);
      } catch {}
    };
    window.addEventListener('pawpad_wallpaper_change', handleSync);
    return () => {
      window.removeEventListener('pawpad_wallpaper_change', handleSync);
    };
  }, []);

  const changeDesktopWallpaper = (id: string) => {
    setWallpaper(id);
    try {
      localStorage.setItem('pawpad_wallpaper', id);
      window.dispatchEvent(new Event('pawpad_wallpaper_change'));
    } catch {}
  };

  // Continuous Sound Therapy loop handler for Purrify
  useEffect(() => {
    if (!isPlayingMusic) {
      if (purrifyAudioRef.current) {
        purrifyAudioRef.current.pause();
      }
      return;
    }

    const track = THERAPY_TRACKS.find((t) => t.id === selectedTherapyId) || THERAPY_TRACKS[0];
    if (!purrifyAudioRef.current) {
      purrifyAudioRef.current = new Audio();
      purrifyAudioRef.current.loop = true;
    }

    const audio = purrifyAudioRef.current;
    if (!audio.src.endsWith(track.file)) {
      audio.src = track.file;
    }
    audio.volume = purrifyVolume;
    audio.play().catch(() => {
      // Fallback: browser may require user gesture
    });
  }, [isPlayingMusic, selectedTherapyId, purrifyVolume]);

  useEffect(() => {
    return () => {
      stopAllSounds();
      if (purrifyAudioRef.current) {
        purrifyAudioRef.current.pause();
        purrifyAudioRef.current = null;
      }
    };
  }, []);

  const openApp = (id: AppId, title: string, icon: string) => {
    const nextZ = maxZ + 1;
    setMaxZ(nextZ);
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w
        );
      }
      return [...prev, { id, title, icon, isMinimized: false, zIndex: nextZ }];
    });
    setActiveWindow(id);
  };

  const closeWindow = (id: AppId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
    if (id === 'terminal') {
      stopAllSounds();
    }
    if (id === 'purrify') {
      setIsPlayingMusic(false);
      if (purrifyAudioRef.current) {
        purrifyAudioRef.current.pause();
      }
    }
  };

  const focusWindow = (id: AppId) => {
    const nextZ = maxZ + 1;
    setMaxZ(nextZ);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
    );
    setActiveWindow(id);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let output = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      output = `Available PawOS Shell Commands:
  bark         Quick alert dog bark (1.2s)
  meow         Gentle cat vocalization
  purr         Deep continuous purr rumble
  howl         Pack calling wolf acoustic
  chirp        Avian melodic chirp
  sniff        Scan local area for active food & animal scents
  cat [file]   Display file contents (try: cat treats.txt)
  fetch [item] Retrieve specified play item
  whoami       Print animal kernel credentials
  stop         Immediately silence any playing audio
  clear        Clear the screen
  exit         Exit Bash terminal and stop all audio`;
    } else if (lower === 'exit' || lower === 'quit') {
      stopAllSounds();
      closeWindow('terminal');
      return;
    } else if (lower === 'stop' || lower === 'silence' || lower === 'mute') {
      stopAllSounds();
      if (isPlayingMusic) setIsPlayingMusic(false);
      output = '🔇 Audio silenced. All active barking and acoustic playback stopped.';
    } else if (lower === 'bark') {
      stopAllSounds();
      const char = PAWSCRIPT_ALPHABET.find((c) => c.sound === 'bark');
      if (char) playSound(char.audioParams, 'loud', 'short');
      output = '🐕 BARK! [Alert canine vocalization | 1.2s burst | 88dB]\n(Type "stop" to silence immediately or "exit" to close Bash)';
    } else if (lower === 'meow') {
      stopAllSounds();
      const char = PAWSCRIPT_ALPHABET.find((c) => c.sound === 'meow');
      if (char) playSound(char.audioParams, 'neutral', 'medium');
      output = 'ᛗᛖᐱ (Meow) — Human attention successfully commandeered.';
    } else if (lower === 'purr') {
      stopAllSounds();
      const char = PAWSCRIPT_ALPHABET.find((c) => c.sound === 'purr');
      if (char) playSound(char.audioParams, 'soft', 'long');
      output = 'ᚱᚱᚱ (Purrrr) — 26Hz vibration activating soothing state. (Type "stop" to silence)';
    } else if (lower === 'howl') {
      stopAllSounds();
      const char = PAWSCRIPT_ALPHABET.find((c) => c.sound === 'howl');
      if (char) playSound(char.audioParams, 'loud', 'very-long');
      output = 'ᚺᐱᚢᛚ (Awoooo) — Pack notification dispatched across territory. (Type "stop" to silence)';
    } else if (lower === 'chirp') {
      stopAllSounds();
      const char = PAWSCRIPT_ALPHABET.find((c) => c.sound === 'chirp');
      if (char) playSound(char.audioParams, 'emphasized', 'short');
      output = 'ᛏᛊᛁᚱ (Chirp) — Avian morning chorus initialized.';
    } else if (lower === 'sniff') {
      output = `Scents identified in 50m radius:
  - 🥓 Crispy Bacon (bearing: 120° East, Kitchen Counter)
  - 🐿️ Gray Squirrel (bearing: 45° North, Maple Tree)
  - 🐱 Neighbor Cat "Whiskers" (boundary fence)
  - 🦹 Mail Carrier approaching front porch!`;
    } else if (lower === 'cat treats.txt') {
      output = `=== TOP SECRET STASH ===
1. Dried Anchovies (under sofa cushion)
2. Squeaky rubber bone (buried in backyard hole #4)
3. Premium Chicken Jerky bits (cabinet top)`;
    } else if (lower.startsWith('fetch')) {
      const item = cmd.substring(5).trim() || 'stick';
      output = `🐶 Woof! Dashed at top speed and retrieved "${item}". Dropped it at human feet. Waiting for praise! 🦴`;
    } else if (lower === 'whoami') {
      output = 'User: chief-animal-commander | Species: Cross-Species Sovereign | OS: PawOS v1.0';
    } else if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      output = `pawsh: command not found: ${cmd}. Type "help" for valid animal commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd, output }]);
    setTerminalInput('');
  };

  const desktopIcons = [
    { id: 'terminal' as AppId, title: 'BarkShell', icon: '💻', subtitle: 'Animal CLI' },
    { id: 'purrify' as AppId, title: 'Purrify', icon: '🎵', subtitle: 'Acoustics' },
    { id: 'notes' as AppId, title: 'PawNotes', icon: '📝', subtitle: 'Quick Notes' },
    { id: 'pawscript' as AppId, title: 'PawScript', icon: '🔤', subtitle: 'Phonetics' },
    { id: 'pawsearch' as AppId, title: 'PawSearch', icon: '🔍', subtitle: 'Animal Web' },
    { id: 'petgram' as AppId, title: 'PetGram', icon: '📸', subtitle: 'Photos' },
    { id: 'pawchat' as AppId, title: 'PawChat', icon: '💬', subtitle: 'Messaging' },
    { id: 'pawmatch' as AppId, title: 'PawMatch', icon: '💕', subtitle: 'Matrimony' },
  ];

  const activePreset = PAWOS_WALLPAPER_PRESETS.find((p) => p.id === wallpaper);
  const desktopBgStyle: React.CSSProperties =
    wallpaper === 'custom' && customWallpaper
      ? { backgroundImage: `url('${customWallpaper}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : activePreset?.bgImage
      ? { backgroundImage: activePreset.bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }
      : activePreset?.gradient
      ? { background: activePreset.gradient }
      : { backgroundImage: "url('/pictures/cat/Wallpaper.webp')", backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <IPadFrame
      appName="PawOS Desktop"
      appEmoji="🖥️"
      appColor="from-zinc-700 to-stone-900"
    >
      <div
        className="flex-1 flex flex-col select-none overflow-hidden relative min-h-full transition-all duration-300"
        style={desktopBgStyle}
      >
        {/* Subtle dark tint to make desktop icons & windows stand out cleanly */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] pointer-events-none" />

        {/* Top Menu Bar */}
        <header className="h-7 bg-black/75 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between text-xs text-gray-200 z-50">
          <div className="flex items-center gap-3">
            <span className="font-bold flex items-center gap-1 text-amber-400">
              <span>🐾</span>
              <span>PawOS</span>
            </span>
            <button
              onClick={() => openApp('terminal', 'BarkShell v2.4', '💻')}
              className="hidden sm:inline text-gray-400 hover:text-white transition-colors"
            >
              Terminal
            </button>
            <button
              onClick={() => openApp('purrify', 'Purrify Acoustic Studio', '🎵')}
              className="hidden sm:inline text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Acoustics</span>
              {isPlayingMusic && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              )}
            </button>
            <button
              onClick={() => openApp('notes', 'PawNotes', '📝')}
              className="hidden sm:inline text-gray-400 hover:text-white transition-colors"
            >
              Notes
            </button>

            {/* Animal Wallpaper Theme Selector */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[10px]">
              <ImageIcon size={11} className="text-amber-400" />
              <span className="text-gray-300 font-medium">Theme:</span>
              <select
                value={wallpaper}
                onChange={(e) => changeDesktopWallpaper(e.target.value)}
                className="bg-black/70 text-amber-300 text-[10px] rounded px-1.5 py-0.5 border border-white/20 outline-none cursor-pointer"
              >
                {customWallpaper && (
                  <option value="custom">📸 My Custom Pet Photo</option>
                )}
                {PAWOS_WALLPAPER_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-400" title="Sniff-Fi: 5 bars signal">
            <Wifi size={13} />
            <span className="hidden sm:inline text-[10px]">Sniff-Fi</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400" title="Belly Capacity: 96% Full">
            <Battery size={13} />
            <span className="text-[10px]">96%</span>
          </div>

          <button
            onClick={() => {
              const char = PAWSCRIPT_ALPHABET[0];
              playSound(char.audioParams, 'soft', 'short');
            }}
            className="flex items-center gap-1 text-gray-300 hover:text-white"
            title="Audio Engine Ready"
          >
            <Volume2 size={13} />
          </button>

          <span className="font-mono text-[11px] text-white/90">{currentTime}</span>
        </div>
      </header>

      {/* Open Windows Taskbar in PawOS */}
      {openWindows.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border-b border-white/10 overflow-x-auto z-40">
          <span className="text-[10px] text-gray-400 mr-1 flex items-center gap-1 flex-shrink-0">
            <span>🪟</span> Active:
          </span>
          {openWindows.map((win) => (
            <button
              key={win.id}
              onClick={() => {
                setOpenWindows((prev) =>
                  prev.map((w) => (w.id === win.id ? { ...w, isMinimized: false } : w))
                );
                focusWindow(win.id);
              }}
              className={`px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1.5 transition-all flex-shrink-0 ${
                activeWindow === win.id && !win.isMinimized
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span>{win.icon}</span>
              <span>{win.title}</span>
              {win.isMinimized && <span className="text-[9px] text-amber-400">(min)</span>}
            </button>
          ))}
        </div>
      )}

      {/* Desktop Workspace */}
      <div className="flex-1 relative p-6 overflow-hidden">
        {/* Desktop Grid of Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl">
          {desktopIcons.map((app) => (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openApp(app.id, app.title, app.icon)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/15 backdrop-blur-xs border border-white/5 hover:border-white/20 transition-all text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl shadow-md border border-white/10 group-hover:shadow-amber-500/20">
                {app.icon}
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md">
                {app.title}
              </span>
              <span className="text-[9px] text-gray-300 opacity-80">{app.subtitle}</span>
            </motion.button>
          ))}
        </div>

        {/* Floating Active Windows */}
        {openWindows.map((win) => {
          if (win.isMinimized) return null;

          return (
            <motion.div
              key={win.id}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={() => focusWindow(win.id)}
              style={{ zIndex: win.zIndex }}
              className={`absolute top-12 left-4 right-4 md:left-24 md:right-auto md:w-[620px] rounded-2xl overflow-hidden shadow-2xl border transition-all ${
                activeWindow === win.id
                  ? 'border-amber-400/50 shadow-amber-500/10'
                  : 'border-white/15 opacity-95'
              }`}
            >
              {/* Window Titlebar */}
              <div className="bg-gray-900/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-white/10 cursor-move">
                <div className="flex items-center gap-2">
                  {/* Traffic Light Window Controls */}
                  <button
                    onClick={() => closeWindow(win.id)}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-[8px] text-red-950 font-bold"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() =>
                      setOpenWindows((prev) =>
                        prev.map((w) =>
                          w.id === win.id ? { ...w, isMinimized: true } : w
                        )
                      )
                    }
                    className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-[8px] text-yellow-950 font-bold"
                  >
                    –
                  </button>
                  <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-[8px] text-green-950 font-bold">
                    +
                  </button>
                  <span className="ml-2 text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                    <span>{win.icon}</span>
                    <span>{win.title}</span>
                  </span>
                </div>

                <div className="text-[10px] text-gray-400">PawOS Process #{win.zIndex}</div>
              </div>

              {/* Window Content Based on App ID */}
              <div className="bg-gray-950/95 backdrop-blur-xl text-gray-100 max-h-[460px] overflow-y-auto">
                {/* 1. Terminal App */}
                {win.id === 'terminal' && (
                  <div className="p-4 font-mono text-xs">
                    <div className="space-y-3 mb-4">
                      {terminalHistory.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span className="text-amber-400">🐾 paw@animal-os:~$</span>
                            <span>{item.cmd}</span>
                          </div>
                          <div className="text-gray-300 whitespace-pre-wrap pl-4 border-l-2 border-emerald-500/30">
                            {item.output}
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                      <span className="text-amber-400 flex-shrink-0">🐾 paw@animal-os:~$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Type 'help', 'bark', 'meow', 'sniff'..."
                        className="flex-1 bg-transparent text-emerald-300 outline-none text-xs"
                        autoFocus
                      />
                    </form>
                  </div>
                )}

                {/* 2. Purrify Acoustics App */}
                {win.id === 'purrify' && (
                  <div className="p-4 sm:p-5 text-gray-100">
                    {/* Top Header & Mode Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎵</span>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            Purrify Studio
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Pet Acoustic Engine v2.0
                            </span>
                          </h3>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Clinically calibrated acoustic relaxation loops & high-attention animal summoners
                        </p>
                      </div>

                      {/* Mode Navigation Tabs */}
                      <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setPurrifyTab('therapy')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            purrifyTab === 'therapy'
                              ? 'bg-amber-500 text-black shadow font-semibold'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          🌿 Sound Therapy
                        </button>
                        <button
                          type="button"
                          onClick={() => setPurrifyTab('toys')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            purrifyTab === 'toys'
                              ? 'bg-amber-500 text-black shadow font-semibold'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          🔔 Pet Callers & Toys
                        </button>
                        <button
                          type="button"
                          onClick={() => setPurrifyTab('about')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            purrifyTab === 'about'
                              ? 'bg-amber-500 text-black shadow font-semibold'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          ℹ️ Why Purrify?
                        </button>
                      </div>
                    </div>

                    {/* TAB 1: Sound Therapy */}
                    {purrifyTab === 'therapy' && (
                      <div className="space-y-4">
                        {/* Now Playing Bar & Visualizer */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-black/50 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl flex-shrink-0">
                              {THERAPY_TRACKS.find((t) => t.id === selectedTherapyId)?.icon || '🎵'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">
                                  {THERAPY_TRACKS.find((t) => t.id === selectedTherapyId)?.name}
                                </span>
                                {isPlayingMusic ? (
                                  <span className="text-[10px] px-2 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1 font-semibold animate-pulse">
                                    <Radio size={10} /> Playing Loop
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.2 bg-white/10 text-gray-400 rounded-full">
                                    Ready
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-amber-300 block">
                                {THERAPY_TRACKS.find((t) => t.id === selectedTherapyId)?.frequencyBadge}
                              </span>
                            </div>
                          </div>

                          {/* Controls: Play/Pause & Equalizer */}
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {/* Animated Equalizer Waveform */}
                            <div className="flex items-end gap-1 h-6 px-2">
                              {[35, 65, 95, 45, 80, 50, 75, 40].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-1 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-300 ${
                                    isPlayingMusic ? 'animate-pulse' : 'opacity-30'
                                  }`}
                                  style={{
                                    height: isPlayingMusic ? `${h}%` : '20%',
                                    animationDelay: `${i * 120}ms`,
                                  }}
                                />
                              ))}
                            </div>

                            <button
                              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                                isPlayingMusic
                                  ? 'bg-amber-500 hover:bg-amber-400 text-black scale-102 ring-2 ring-amber-400/50'
                                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                              }`}
                            >
                              {isPlayingMusic ? <Pause size={14} /> : <Play size={14} />}
                              <span>{isPlayingMusic ? 'Pause' : 'Play Soundscape'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Volume Slider */}
                        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs">
                          <button
                            type="button"
                            onClick={() => setPurrifyVolume(purrifyVolume > 0 ? 0 : 0.7)}
                            className="text-gray-400 hover:text-white"
                          >
                            {purrifyVolume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} className="text-amber-400" />}
                          </button>
                          <span className="text-[11px] text-gray-300 min-w-[70px]">
                            Volume: {Math.round(purrifyVolume * 100)}%
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={purrifyVolume}
                            onChange={(e) => setPurrifyVolume(parseFloat(e.target.value))}
                            className="flex-1 accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Track List */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                            Select Therapeutic Track
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {THERAPY_TRACKS.map((track) => {
                              const isSelected = selectedTherapyId === track.id;
                              return (
                                <button
                                  key={track.id}
                                  onClick={() => {
                                    setSelectedTherapyId(track.id);
                                    if (!isPlayingMusic) setIsPlayingMusic(true);
                                  }}
                                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/40 text-white'
                                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl flex-shrink-0">{track.icon}</span>
                                    <div>
                                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                                        <span>{track.name}</span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">
                                          {track.frequencyBadge}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                                        {track.description}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex-shrink-0">
                                    {isSelected && isPlayingMusic ? (
                                      <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                                        <Radio size={12} className="animate-pulse" /> Playing
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-gray-500 hover:text-gray-300">
                                        Select
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: Pet Callers & Toys */}
                    {purrifyTab === 'toys' && (
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                          <strong>🐾 Real-Time Pet Callers:</strong> Tap any trigger button below. These high-frequency sound cues exploit natural canine and feline auditory instincts to grab immediate attention, test curiosity, or call them to you!
                        </div>

                        {lastTriggeredToy && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs"
                          >
                            <span className="text-2xl">{lastTriggeredToy.icon}</span>
                            <div>
                              <span className="font-bold text-white block">
                                Triggered: {lastTriggeredToy.name}
                              </span>
                              <span className="text-emerald-300 text-[11px]">
                                Expected reaction: {lastTriggeredToy.triggerEffect}
                              </span>
                            </div>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {CALLER_TOYS.map((toy) => (
                            <button
                              key={toy.id}
                              onClick={() => {
                                triggerPetToySound(toy.type);
                                setLastTriggeredToy(toy);
                              }}
                              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 border border-white/10 hover:border-amber-400/50 text-left transition-all flex items-start gap-3 group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                {toy.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-semibold text-white truncate">
                                    {toy.name}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 flex-shrink-0">
                                    {toy.category}
                                  </span>
                                </div>
                                <span className="text-[10px] text-amber-300 block font-medium mt-0.5">
                                  ⚡ {toy.triggerEffect}
                                </span>
                                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                                  {toy.description}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: Why Purrify / Science */}
                    {purrifyTab === 'about' && (
                      <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                          <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                            <span>🩺</span> Why was Purrify built?
                          </h4>
                          <p>
                            Unlike generic human music apps like Spotify or Apple Music, pets process audio in vastly different acoustic spectrums. Cats hear frequencies up to <strong>64,000 Hz</strong>, and dogs up to <strong>45,000 Hz</strong> (compared to humans at only 20,000 Hz).
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <h5 className="font-bold text-purple-200 mb-1 flex items-center gap-1">
                              <span>🐱</span> 26Hz Feline Purr Therapy
                            </h5>
                            <p className="text-[11px] text-gray-400">
                              Studies confirm that domestic cats purr at a steady frequency between 25 and 140 Hz. Specifically, <strong>25 Hz and 50 Hz frequencies are proven to promote bone density, ease muscle pain, and repair tendons</strong>. That is why cats purr when recovering from stress or injuries.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <h5 className="font-bold text-amber-200 mb-1 flex items-center gap-1">
                              <span>🐕</span> Canine Separation Anxiety Relief
                            </h5>
                            <p className="text-[11px] text-gray-400">
                              Canines react instinctively to rhythmic resting pack breathing. By listening to continuous low-frequency breathing loops, lonely dogs relax their parasympathetic nervous system, stopping excessive barking when home alone.
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <h5 className="font-bold text-emerald-200 mb-1 flex items-center gap-1">
                            <span>🥫</span> The Food Can Opener Trigger
                          </h5>
                          <p className="text-[11px] text-gray-400">
                            The sharp suction &apos;pop&apos; of a wet food tin creates a unique mechanical frequency burst that pets associate with high-reward sustenance. Testing this sound from another room will almost always summon your pet to inspect the kitchen!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PawNotes App */}
                {win.id === 'notes' && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                      <span>Autosaved locally in PawOS</span>
                      <span className="text-amber-400">
                        {translateToPawScript(notesText).slice(0, 30)}...
                      </span>
                    </div>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      className="w-full h-48 bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-amber-100 font-mono outline-none focus:border-amber-400 resize-none leading-relaxed"
                    />
                  </div>
                )}

                {/* 4. PawScript Mini Lab */}
                {win.id === 'pawscript' && (
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-amber-400">
                        Instant PawScript Converter
                      </span>
                      <Link
                        href="/pawscript"
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Open Full Language Lab <ExternalLink size={12} />
                      </Link>
                    </div>
                    <input
                      type="text"
                      value={osTranslateInput}
                      onChange={(e) => setOsTranslateInput(e.target.value)}
                      placeholder="Type animal text..."
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-400 mb-3"
                    />
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 mb-3">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
                        Phonetic Notation
                      </div>
                      <div className="pawscript-text text-lg text-amber-300">
                        {translateToPawScript(osTranslateInput)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const char = PAWSCRIPT_ALPHABET[0];
                          playSound(char.audioParams, 'emphasized', 'medium');
                        }}
                        className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                      >
                        <Volume2 size={13} /> Speak in PawScript
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Shortcuts to Full Apps */}
                {['pawsearch', 'petgram', 'pawchat', 'pawmatch'].includes(win.id) && (
                  <div className="p-8 text-center">
                    <div className="text-5xl mb-3">{win.icon}</div>
                    <h4 className="text-base font-bold text-white mb-2">{win.title}</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                      Launch the dedicated full-screen module for this PawLingo ecosystem service.
                    </p>
                    <Link
                      href={`/${win.id}`}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-semibold text-xs transition-all shadow-md"
                    >
                      <span>Open {win.title} Experience</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      </div>
    </IPadFrame>
  );
}
