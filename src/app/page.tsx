'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Volume2,
  Play,
  Pause,
  SkipForward,
  Sparkles,
  Camera,
  MessageCircle,
  Heart,
  Languages,
  Monitor,
  Settings,
  FileText,
  Wifi,
  Battery,
  Bluetooth,
  Sun,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  Check,
  Compass,
  Zap,
  Palette,
  Upload,
  Trash2,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAWSCRIPT_ALPHABET, translateToPawScript } from '@/lib/pawscript';
import {
  playSound,
  playTapTone,
  playAppLaunchTone,
  BGM_PLAYLIST,
  toggleBgm,
  nextBgm,
  getBgmState,
  BgmTrack,
} from '@/lib/sounds';
import { IPadDock } from '@/components/ui/IPadDock';
import { isPadLocked, setPadLocked, subscribePadLock } from '@/lib/deviceLock';

export type WallpaperTheme =
  | 'cat_wallpaper'
  | 'benjamin_scholar'
  | 'husky_snow'
  | 'golden_meadow'
  | 'kalyani_acrobat'
  | 'lady_dimitrescu'
  | 'winter_cat'
  | 'gentle_golden'
  | 'rocket_frenchie'
  | 'naughty_water'
  | 'custom';

export interface WallpaperItem {
  id: WallpaperTheme;
  name: string;
  category: 'Cat' | 'Dog' | 'Custom';
  bgClass: string;
  bgImage?: string;
  accent: string;
  preview: string;
  darkStatusText?: boolean;
}

interface AppIconData {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  badge?: string | number;
  href?: string;
  modal?: 'settings' | 'pawstore' | 'soundboard' | 'pawcam' | 'notes';
}

export const WALLPAPERS: Record<WallpaperTheme, WallpaperItem> = {
  cat_wallpaper: {
    id: 'cat_wallpaper',
    name: '🐱 CatPad Sunbeam Tabby',
    category: 'Cat',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/cat/Wallpaper.webp')",
    accent: 'bg-amber-400',
    preview: "url('/pictures/cat/Wallpaper.webp')",
    darkStatusText: true,
  },
  benjamin_scholar: {
    id: 'benjamin_scholar',
    name: '🤓 Benjamin Professor Dog',
    category: 'Dog',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp')",
    accent: 'bg-amber-400',
    preview: "url('/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp')",
    darkStatusText: true,
  },
  husky_snow: {
    id: 'husky_snow',
    name: '❄️ Arctic Snow Wolf (Husky)',
    category: 'Dog',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/images/animals/husky_snow.jpg')",
    accent: 'bg-cyan-400',
    preview: "url('/images/animals/husky_snow.jpg')",
    darkStatusText: false,
  },
  golden_meadow: {
    id: 'golden_meadow',
    name: '🌾 Golden Meadow Gallop',
    category: 'Dog',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/dog/funny-dog-pics-6-10-24-2024.webp')",
    accent: 'bg-amber-400',
    preview: "url('/pictures/dog/funny-dog-pics-6-10-24-2024.webp')",
    darkStatusText: false,
  },
  kalyani_acrobat: {
    id: 'kalyani_acrobat',
    name: '🎪 Kalyani Calico Acrobat',
    category: 'Cat',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/cat/CWbUskSKeMT-png__700.webp')",
    accent: 'bg-pink-400',
    preview: "url('/pictures/cat/CWbUskSKeMT-png__700.webp')",
    darkStatusText: false,
  },
  lady_dimitrescu: {
    id: 'lady_dimitrescu',
    name: '👑 Empress Lady Dimitrescu',
    category: 'Cat',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/cat/CQRCz9RppTd-png__700.webp')",
    accent: 'bg-purple-400',
    preview: "url('/pictures/cat/CQRCz9RppTd-png__700.webp')",
    darkStatusText: false,
  },
  winter_cat: {
    id: 'winter_cat',
    name: '🧶 Fluffy Cozy Winter Cat',
    category: 'Cat',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/cat/COaEeSIpWQW-png__700.webp')",
    accent: 'bg-amber-300',
    preview: "url('/pictures/cat/COaEeSIpWQW-png__700.webp')",
    darkStatusText: false,
  },
  gentle_golden: {
    id: 'gentle_golden',
    name: '💛 Shantha Gentle Therapy',
    category: 'Dog',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/dog/funny-dog-pics-19-10-24-2024.webp')",
    accent: 'bg-yellow-400',
    preview: "url('/pictures/dog/funny-dog-pics-19-10-24-2024.webp')",
    darkStatusText: false,
  },
  rocket_frenchie: {
    id: 'rocket_frenchie',
    name: '🚀 Missile Bowtie Rocket',
    category: 'Dog',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp')",
    accent: 'bg-emerald-400',
    preview: "url('/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp')",
    darkStatusText: false,
  },
  naughty_water: {
    id: 'naughty_water',
    name: '🥛 Microwave 3AM Water Glass',
    category: 'Cat',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    bgImage: "url('/pictures/cat/naughty.webp')",
    accent: 'bg-blue-400',
    preview: "url('/pictures/cat/naughty.webp')",
    darkStatusText: false,
  },
  custom: {
    id: 'custom',
    name: '📸 My Custom Pet Photo',
    category: 'Custom',
    bgClass: 'bg-cover bg-center bg-no-repeat',
    accent: 'bg-pink-500',
    preview: '',
    darkStatusText: false,
  },
};

export default function IPadHomePage() {
  const router = useRouter();

  // iPad OS State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLocked, setIsLocked] = useState(() => isPadLocked());
  const [catCaseActive, setCatCaseActive] = useState(true);
  const [wallpaper, setWallpaper] = useState<WallpaperTheme>('cat_wallpaper');
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [wallpaperTab, setWallpaperTab] = useState<'all' | 'dogs' | 'cats' | 'custom'>('all');
  const fileWallpaperInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [activePage, setActivePage] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<'settings' | 'pawstore' | 'soundboard' | 'pawcam' | 'notes' | null>(null);

  const isDarkStatus = Boolean(WALLPAPERS[wallpaper]?.darkStatusText) || mode === 'light';

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedCustom = localStorage.getItem('pawpad_custom_wallpaper');
        if (savedCustom) setCustomWallpaper(savedCustom);
        const savedW = localStorage.getItem('pawpad_wallpaper') as WallpaperTheme;
        if (savedW && (WALLPAPERS[savedW] || savedW === 'custom')) setWallpaper(savedW);
        const savedM = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (savedM === 'dark' || savedM === 'light') setMode(savedM);
      } catch {}
    });

    const handleSync = () => {
      try {
        const savedCustom = localStorage.getItem('pawpad_custom_wallpaper');
        if (savedCustom) setCustomWallpaper(savedCustom);
        const savedW = localStorage.getItem('pawpad_wallpaper') as WallpaperTheme;
        if (savedW && (WALLPAPERS[savedW] || savedW === 'custom')) setWallpaper(savedW);
        const savedM = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (savedM === 'dark' || savedM === 'light') setMode(savedM);
      } catch {}
    };
    window.addEventListener('pawpad_wallpaper_change', handleSync);
    window.addEventListener('pawpad_mode_change', handleSync);
    return () => {
      window.removeEventListener('pawpad_wallpaper_change', handleSync);
      window.removeEventListener('pawpad_mode_change', handleSync);
    };
  }, []);

  const changeWallpaper = (theme: WallpaperTheme) => {
    playTapTone();
    setWallpaper(theme);
    try {
      localStorage.setItem('pawpad_wallpaper', theme);
      window.dispatchEvent(new Event('pawpad_wallpaper_change'));
    } catch {}
  };

  const handleUploadCustomWallpaper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === 'string') {
          const dataUrl = loadEvt.target.result;
          setCustomWallpaper(dataUrl);
          setWallpaper('custom');
          try {
            localStorage.setItem('pawpad_custom_wallpaper', dataUrl);
            localStorage.setItem('pawpad_wallpaper', 'custom');
            window.dispatchEvent(new Event('pawpad_wallpaper_change'));
          } catch {}
          playTapTone();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const url = customUrlInput.trim();
    setCustomWallpaper(url);
    setWallpaper('custom');
    try {
      localStorage.setItem('pawpad_custom_wallpaper', url);
      localStorage.setItem('pawpad_wallpaper', 'custom');
      window.dispatchEvent(new Event('pawpad_wallpaper_change'));
    } catch {}
    playTapTone();
    setCustomUrlInput('');
  };

  const handleRemoveCustomWallpaper = () => {
    setCustomWallpaper(null);
    changeWallpaper('cat_wallpaper');
    try {
      localStorage.removeItem('pawpad_custom_wallpaper');
    } catch {}
  };

  const changeMode = (newMode: 'dark' | 'light') => {
    playTapTone();
    setMode(newMode);
    try {
      localStorage.setItem('pawpad_mode', newMode);
      window.dispatchEvent(new Event('pawpad_mode_change'));
    } catch {}
  };

  // Time & Date
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize lock state from deviceLock manager
  useEffect(() => {
    const unsubLock = subscribePadLock((locked) => {
      setIsLocked(locked);
    });
    return () => unsubLock();
  }, []);

  // Keyboard shortcut to unlock on Space or Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked && (e.code === 'Space' || e.code === 'Enter')) {
        playAppLaunchTone();
        setIsLocked(false);
        setPadLocked(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked]);

  // Spotlight Search
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // PawNotes state
  const [quickNote, setQuickNote] = useState('Nap at 2 PM in sunbeam.\nCatch red dot.\nDemand second breakfast.');

  // Camera sticker preview
  const [camFacingUser, setCamFacingUser] = useState(true);

  // Laser game state
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });
  const [laserScore, setLaserScore] = useState(0);

  // Real Animal Ambient BGM State
  const [bgmState, setBgmState] = useState<{
    isPlaying: boolean;
    trackIndex: number;
    currentTrack: BgmTrack;
    volume: number;
  }>({ isPlaying: false, trackIndex: 0, currentTrack: BGM_PLAYLIST[0], volume: 0.65 });

  useEffect(() => {
    queueMicrotask(() => {
      setBgmState(getBgmState());
    });
    const handleBgmChange = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        setBgmState(customEvt.detail);
      }
    };
    window.addEventListener('pawlingo_bgm_change', handleBgmChange);
    return () => window.removeEventListener('pawlingo_bgm_change', handleBgmChange);
  }, []);

  const handleAppClick = (app: AppIconData) => {
    playTapTone();
    if (app.modal) {
      setActiveModal(app.modal);
      return;
    }
    if (app.href) {
      playAppLaunchTone();
      router.push(app.href);
    }
  };

  // The Header shortcuts transformed into primary iPad apps
  const PRIMARY_APPS: AppIconData[] = [
    {
      id: 'petgram',
      name: 'PetGram',
      category: 'Social',
      icon: Camera,
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badge: 3,
      href: '/petgram',
    },
    {
      id: 'pawchat',
      name: 'PawChat',
      category: 'Messages',
      icon: MessageCircle,
      gradient: 'from-emerald-400 to-green-600',
      badge: 5,
      href: '/pawchat',
    },
    {
      id: 'pawmatch',
      name: 'PawMatch',
      category: 'Dating',
      icon: Heart,
      gradient: 'from-fuchsia-500 to-purple-600',
      badge: 'New',
      href: '/pawmatch',
    },
    {
      id: 'pawscript',
      name: 'PawScript',
      category: 'Languages',
      icon: Languages,
      gradient: 'from-amber-400 to-orange-600',
      badge: 16,
      href: '/pawscript',
    },
    {
      id: 'pawos',
      name: 'PawOS',
      category: 'Desktop',
      icon: Monitor,
      gradient: 'from-zinc-800 to-stone-900',
      href: '/pawos',
    },
    {
      id: 'pawstore',
      name: 'PawStore',
      category: 'Store',
      icon: Sparkles,
      gradient: 'from-blue-500 to-indigo-600',
      badge: '●',
      modal: 'pawstore',
    },
    {
      id: 'settings',
      name: 'Settings',
      category: 'System',
      icon: Settings,
      gradient: 'from-gray-400 via-slate-500 to-zinc-600',
      modal: 'settings',
    },
    {
      id: 'notes',
      name: 'PawNotes',
      category: 'Productivity',
      icon: FileText,
      gradient: 'from-amber-300 via-yellow-400 to-orange-400',
      modal: 'notes',
    },
    {
      id: 'camera',
      name: 'PawCam',
      category: 'Media',
      icon: Camera,
      gradient: 'from-slate-700 via-zinc-800 to-black',
      modal: 'pawcam',
    },
    {
      id: 'soundboard',
      name: 'Sounds',
      category: 'Audio',
      icon: Volume2,
      gradient: 'from-red-400 via-orange-500 to-amber-500',
      modal: 'soundboard',
    },
    {
      id: 'pawsearch',
      name: 'PawSearch',
      category: 'Search',
      icon: Search,
      gradient: 'from-cyan-400 via-teal-500 to-blue-600',
      href: '/pawsearch',
    },
  ];

  // Secondary Page Apps (Utilities & Mini Games)
  const SECONDARY_APPS: AppIconData[] = [
    {
      id: 'laser',
      name: 'Catch Red Dot',
      category: 'Games',
      icon: Zap,
      gradient: 'from-red-500 to-rose-600',
      modal: 'soundboard',
    },
    {
      id: 'compass',
      name: 'Scent Finder',
      category: 'Utility',
      icon: Compass,
      gradient: 'from-blue-400 to-indigo-500',
      href: '/pawsearch',
    },
    {
      id: 'wallpapers',
      name: 'Wallpapers',
      category: 'Customize',
      icon: Palette,
      gradient: 'from-pink-500 via-rose-500 to-amber-400',
      modal: 'settings',
    },
    {
      id: 'terminal-shortcut',
      name: 'BarkShell CLI',
      category: 'Developer',
      icon: Monitor,
      gradient: 'from-stone-800 to-neutral-900',
      href: '/pawos',
    },
  ];

  // Spotlight Filtered Results
  const spotlightResults = PRIMARY_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  return (
    <div suppressHydrationWarning className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-0 md:p-6 select-none overflow-hidden relative font-sans">
      {/* Subtle Background Glow behind iPad on Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-amber-500/20 via-pink-500/10 to-purple-600/20 blur-3xl rounded-full" />
      </div>

      {/* Top Floating Control Bar */}
      <div className="fixed top-2.5 right-3 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-xs shadow-2xl text-white">
        <span className="text-amber-400 font-bold hidden sm:inline">CatPad Pro</span>
        <div className="w-px h-3 bg-white/20 hidden sm:inline" />
        <button
          onClick={() => {
            playTapTone();
            setCatCaseActive(!catCaseActive);
          }}
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
            catCaseActive
              ? 'bg-pink-500/30 text-pink-300 border border-pink-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Toggle Cat Ear Protective Bumper Case"
        >
          🐱 Case: {catCaseActive ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => {
            playTapTone();
            setIsFullScreen(!isFullScreen);
          }}
          className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-300 hover:text-white"
          title={isFullScreen ? 'Exit iPad Frame mode' : 'Enter Frameless Fullscreen'}
        >
          {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* Top Left Lock Toggle */}
      <div className="fixed top-2.5 left-3 z-50">
        <button
          onClick={() => {
            playTapTone();
            const nextLocked = !isLocked;
            setIsLocked(nextLocked);
            setPadLocked(nextLocked);
          }}
          className="flex items-center gap-1.5 bg-black/70 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-xs text-amber-300 font-semibold shadow-2xl hover:bg-black/90 transition-all"
        >
          {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
          <span>{isLocked ? 'Locked' : 'Lock iPad'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* THE IPAD CHASSIS & SCREEN */}
      {/* ========================================================================= */}
      <div
        suppressHydrationWarning
        className={`relative transition-all duration-300 flex flex-col justify-between shadow-[0_25px_80px_rgba(0,0,0,0.85)] ${
          isFullScreen
            ? 'w-full h-screen rounded-none p-0 border-0'
            : 'w-full max-w-[1100px] h-[96vh] max-h-[820px] rounded-[44px] sm:rounded-[48px] p-3 sm:p-3.5 bg-neutral-900 border-[7px] sm:border-[8px] border-neutral-800'
        }`}
      >
        {/* Cat Case Silicone Ears on Chassis */}
        {!isFullScreen && catCaseActive && (
          <>
            {/* Left Cat Ear */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 15 }}
              onClick={() => {
                const meow = PAWSCRIPT_ALPHABET[0];
                playSound(meow.audioParams, 'soft', 'short');
              }}
              className="absolute -top-[23px] left-12 w-14 h-10 bg-neutral-800 rounded-t-full border-t border-neutral-700 pointer-events-auto cursor-pointer z-30 shadow-md flex items-center justify-center group"
              title="Tap to tickle left cat ear!"
            >
              <div className="w-8 h-6 bg-pink-500/25 rounded-t-full mt-1 border-t border-pink-400/40" />
            </motion.div>
            {/* Right Cat Ear */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 15 }}
              onClick={() => {
                const purr = PAWSCRIPT_ALPHABET.find((r) => r.sound === 'purr') || PAWSCRIPT_ALPHABET[0];
                playSound(purr.audioParams, 'soft', 'short');
              }}
              className="absolute -top-[23px] right-12 w-14 h-10 bg-neutral-800 rounded-t-full border-t border-neutral-700 pointer-events-auto cursor-pointer z-30 shadow-md flex items-center justify-center group"
              title="Tap to tickle right cat ear!"
            >
              <div className="w-8 h-6 bg-pink-500/25 rounded-t-full mt-1 border-t border-pink-400/40" />
            </motion.div>
          </>
        )}

        {/* iPad Top Hardware Camera Hole (When in chassis mode) */}
        {!isFullScreen && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-700/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" title="Cat FaceID / Retina Scanner ready" />
          </div>
        )}

        {/* iPad Display Area */}
        <div
          className={`relative flex-1 flex flex-col justify-between overflow-hidden ${
            !isFullScreen ? 'rounded-[32px] sm:rounded-[36px]' : 'rounded-none'
          } ${
            isDarkStatus ? 'text-neutral-900' : 'text-white'
          } ${
            WALLPAPERS[wallpaper]?.bgClass || 'bg-cover bg-center bg-no-repeat'
          } transition-all duration-700`}
          style={
            wallpaper === 'custom' && customWallpaper
              ? { backgroundImage: `url("${customWallpaper}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : WALLPAPERS[wallpaper]?.bgImage
              ? { backgroundImage: WALLPAPERS[wallpaper]?.bgImage }
              : undefined
          }
        >
          {/* Wallpaper Subtle Ambient Overlays */}
          <div className="absolute inset-0 bg-radial-at-c from-white/10 via-transparent to-black/30 pointer-events-none" />

          {/* ==================== 1. IPAD STATUS BAR ==================== */}
          <div
            className={`h-8 px-6 pt-2 flex items-center justify-between text-xs z-30 font-medium select-none transition-colors duration-300 ${
              isDarkStatus ? 'text-neutral-900' : 'text-white/90'
            }`}
          >
            {/* Left: Time & Carrier */}
            <div className="flex items-center gap-2.5">
              <span
                className={`font-semibold tracking-tight text-sm ${
                  isDarkStatus ? 'text-neutral-950 font-bold drop-shadow-none' : 'text-white drop-shadow-sm'
                }`}
              >
                {currentTime || '9:41'}
              </span>
              <span className={isDarkStatus ? 'hidden sm:inline text-neutral-400' : 'hidden sm:inline text-white/60'}>•</span>
              <span
                className={`hidden sm:inline text-[11px] ${
                  isDarkStatus ? 'text-neutral-800 font-medium drop-shadow-none' : 'text-white/80 drop-shadow-sm'
                }`}
              >
                {currentDate}
              </span>
              <span
                className={`text-[10px] backdrop-blur-xs px-2 py-0.5 rounded-full border font-bold ${
                  isDarkStatus
                    ? 'bg-black/10 border-black/15 text-amber-800'
                    : 'bg-white/20 border-white/20 text-amber-300'
                }`}
              >
                Sniff-Fi 🐾
              </span>
            </div>

            {/* Right: Icons & Battery */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Bluetooth size={12} className={isDarkStatus ? 'text-neutral-800' : 'text-white/70'} />
                <Wifi size={14} className={isDarkStatus ? 'text-neutral-950' : 'text-white'} />
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] backdrop-blur-md px-2 py-0.5 rounded-full border ${
                  isDarkStatus
                    ? 'bg-black/10 border-black/15 text-neutral-900'
                    : 'bg-black/25 border-white/15 text-white'
                }`}
              >
                <span className={`font-bold ${isDarkStatus ? 'text-emerald-700' : 'text-emerald-400'}`}>98%</span>
                <Battery size={15} className={isDarkStatus ? 'text-emerald-700' : 'text-emerald-400'} />
              </div>
            </div>
          </div>

          {/* ==================== LOCK SCREEN OVERLAY ==================== */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="absolute inset-0 z-50 backdrop-blur-2xl bg-black/60 flex flex-col items-center justify-between p-10 select-none text-white"
              >
                <div className="text-center pt-8">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Lock size={18} className="text-amber-300" />
                  </div>
                  <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight drop-shadow-md">
                    {currentTime || '9:41'}
                  </h1>
                  <p className="text-lg text-white/80 font-medium mt-1 drop-shadow-sm">
                    {currentDate || 'Saturday, September 12'}
                  </p>
                </div>

                {/* Notifications Stack */}
                <div className="w-full max-w-md space-y-2.5 my-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playAppLaunchTone();
                      setIsLocked(false);
                      setPadLocked(false);
                      router.push('/pawchat');
                    }}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg cursor-pointer transition-all"
                  >
                    <div suppressHydrationWarning className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-xl shadow-md">
                      <span>🐱</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-300">PawChat • Ramesh</span>
                        <span className="text-[10px] text-white/50">2m ago</span>
                      </div>
                      <p className="text-xs text-white/90 truncate">meow meow! The sunbeam is perfect right now ☀️</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playAppLaunchTone();
                      setIsLocked(false);
                      setPadLocked(false);
                      router.push('/petgram');
                    }}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg cursor-pointer transition-all"
                  >
                    <div suppressHydrationWarning className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xl shadow-md">
                      <span>🐕</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-pink-300">PetGram • Benjamin</span>
                        <span className="text-[10px] text-white/50">15m ago</span>
                      </div>
                      <p className="text-xs text-white/90 truncate">Liked your fetch reel with 🐾 bone reactions!</p>
                    </div>
                  </motion.div>
                </div>

                {/* Unlock Button / Slide */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playAppLaunchTone();
                    setIsLocked(false);
                    setPadLocked(false);
                  }}
                  className="bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-xl border border-white/30 px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 text-white shadow-xl transition-all cursor-pointer group"
                >
                  <Unlock size={16} className="text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Click or Press Space to Unlock</span>
                  <ChevronRight size={16} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== 2. MAIN IPAD HOME SCREEN CONTENT ==================== */}
          {!isLocked && (
            <div className="flex-1 px-4 md:px-10 py-3 overflow-y-auto flex flex-col justify-between z-20 scrollbar-hide">
              {/* Top Row: Spotlight Search & Quick Stats */}
              <div className="flex items-center justify-between gap-4 mb-4">
                {/* Spotlight Search Pill */}
                <div className="relative flex-1 max-w-md">
                  <div
                    onClick={() => {
                      playTapTone();
                      setIsSpotlightOpen(true);
                    }}
                    className={`flex items-center gap-2.5 backdrop-blur-xl px-4 py-2 rounded-full cursor-pointer transition-all shadow-md group ${
                      isDarkStatus
                        ? 'bg-black/10 hover:bg-black/15 border border-black/15 text-neutral-900'
                        : 'bg-black/25 hover:bg-black/40 border border-white/20 text-white/80'
                    }`}
                  >
                    <Search size={15} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className={`text-xs font-medium ${isDarkStatus ? 'text-neutral-900' : 'text-white/80'}`}>
                      Search PawPad apps, sounds, or PawScript...
                    </span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isDarkStatus
                          ? 'bg-black/10 text-neutral-800 border border-black/10'
                          : 'bg-white/20 text-white/70'
                      }`}
                    >
                      ⌘K
                    </span>
                  </div>
                </div>

                {/* Quick Widget Status Pill */}
                <div
                  className={`hidden sm:flex items-center gap-2 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs shadow-sm ${
                    isDarkStatus
                      ? 'bg-black/10 border border-black/15 text-neutral-900 font-semibold'
                      : 'bg-black/25 border border-white/15 text-white/90'
                  }`}
                >
                  <Sparkles size={13} className={isDarkStatus ? 'text-amber-600' : 'text-amber-400'} />
                  <span>Cross-Species OS 2.4</span>
                </div>
              </div>

              {/* Spotlight Overlay Modal */}
              <AnimatePresence>
                {isSpotlightOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 px-4"
                    onClick={() => setIsSpotlightOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: -20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full max-w-lg bg-neutral-900/95 border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-4 text-white"
                    >
                      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <Search size={18} className="text-amber-400" />
                        <input
                          type="text"
                          value={spotlightQuery}
                          onChange={(e) => setSpotlightQuery(e.target.value)}
                          placeholder="Type app name, sound (meow, bark), or PawScript..."
                          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
                          autoFocus
                        />
                        <button
                          onClick={() => setIsSpotlightOpen(false)}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Spotlight Search Results */}
                      <div className="mt-3 max-h-60 overflow-y-auto space-y-1.5">
                        {spotlightResults.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => {
                              setIsSpotlightOpen(false);
                              handleAppClick(app);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white shadow-sm`}
                              >
                                <app.icon size={18} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{app.name}</h4>
                                <p className="text-[10px] text-gray-400">{app.category}</p>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-gray-500" />
                          </div>
                        ))}

                        {spotlightQuery.trim() && (
                          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 mt-2">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                              PawScript Live Translation:
                            </span>
                            <span className="pawscript-text text-sm font-bold text-amber-300">
                              {translateToPawScript(spotlightQuery)}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Grid: Widgets + App Shortcuts */}
              {activePage === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto">
                  {/* ================= LEFT: IPADOS WIDGETS (5 cols) ================= */}
                  <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Widget 1: Weather & Nap Radar */}
                    <div className="bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-0.5">
                            <Sun size={14} /> Catnip Gardens
                          </div>
                          <h3 className="text-3xl font-extrabold text-white">24°C</h3>
                          <p className="text-[11px] text-white/70">Optimal Sunbeam Nap Weather 🐱</p>
                        </div>
                        <div className="text-4xl float-animation">☀️</div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
                        <span>H: 27° L: 19°</span>
                        <span>UV Index: Warm</span>
                        <span className="text-amber-400 font-semibold">Nap Index: 10/10</span>
                      </div>
                    </div>

                    {/* Widget 2: Purrify Acoustics Audio Player */}
                    <div className="bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl transition-all flex flex-col justify-between hover:scale-[1.01] duration-300">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-xl shadow-lg transition-all ${
                              bgmState.isPlaying ? 'animate-spin [animation-duration:8s] ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : ''
                            }`}
                          >
                            🎵
                          </div>
                          {bgmState.isPlaying && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900 animate-ping" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                              Ambient BGM • {bgmState.currentTrack?.category || 'Animal Sound'}
                            </span>
                            {bgmState.isPlaying && (
                              <div className="flex items-end gap-1 h-3.5 px-1 bg-white/10 rounded-md py-0.5">
                                <span className="w-0.5 bg-amber-400 rounded-full animate-eq-1" />
                                <span className="w-0.5 bg-amber-400 rounded-full animate-eq-2" />
                                <span className="w-0.5 bg-amber-400 rounded-full animate-eq-3" />
                                <span className="w-0.5 bg-amber-400 rounded-full animate-eq-4" />
                              </div>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white truncate">
                            {bgmState.currentTrack?.title || 'Purr Therapy'}
                          </h4>
                          <p className="text-[11px] text-white/60 truncate">
                            {bgmState.currentTrack?.description || 'Deep feline contentment acoustics'}
                          </p>
                        </div>
                      </div>

                      {/* Player Controls */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              playTapTone();
                              toggleBgm();
                            }}
                            className="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md font-bold"
                            title={bgmState.isPlaying ? 'Pause BGM' : 'Play BGM'}
                          >
                            {bgmState.isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                          </button>

                          <button
                            onClick={() => {
                              playTapTone();
                              nextBgm();
                            }}
                            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 transition-colors"
                            title="Next Audio Track"
                          >
                            <SkipForward size={14} />
                          </button>
                        </div>

                        <div className="text-[10px] text-white/60 font-mono">
                          {bgmState.isPlaying ? 'Playing Real Audio 🐾' : 'Tap to play ambient'}
                        </div>
                      </div>
                    </div>

                    {/* Widget 3: Word of the Day (PawScript Glyph) */}
                    <div className="bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3.5 shadow-xl transition-all flex items-center justify-between hover:scale-[1.01] duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold pawscript-text text-xl shadow-inner">
                          ᛗᛖᐱ
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">Glyph of the Day: Meow</span>
                            <span className="text-[10px] text-amber-300 font-mono">[m͡ɛ.aʊ]</span>
                          </div>
                          <p className="text-[10px] text-white/70">Cat vocalization expressing request or greeting</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const char = PAWSCRIPT_ALPHABET[0];
                          playSound(char.audioParams, 'emphasized', 'medium');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-500/40 transition-all hover:scale-105 active:scale-95"
                      >
                        <Volume2 size={13} />
                        <span>Hear</span>
                      </button>
                    </div>
                  </div>

                  {/* ================= RIGHT: APP ICONS GRID (7 cols) ================= */}
                  <div className="lg:col-span-7 grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-4 items-start content-start">
                    {PRIMARY_APPS.map((app) => (
                      <div key={app.id} className="flex flex-col items-center group">
                        <motion.button
                          whileHover={{ scale: 1.12, y: -6 }}
                          whileTap={{ scale: 0.88 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                          onClick={() => handleAppClick(app)}
                          className={`relative w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-[22px] md:rounded-[24px] bg-gradient-to-br ${app.gradient} p-0.5 shadow-xl shadow-black/40 flex items-center justify-center cursor-pointer hover:shadow-2xl overflow-visible border border-white/25 transition-shadow`}
                        >
                          {/* App Top Gloss Sheen */}
                          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent rounded-[22px] md:rounded-[24px] pointer-events-none" />

                          {/* Shimmer light sweep container */}
                          <div className="absolute inset-0 overflow-hidden rounded-[22px] md:rounded-[24px] pointer-events-none">
                            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 pointer-events-none transform -rotate-45" />
                          </div>

                          {/* App Icon */}
                          <app.icon size={32} className="text-white drop-shadow-md relative z-10" />

                          {/* App Badge Counter */}
                          {app.badge !== undefined && (
                            <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-bold text-[11px] min-w-[22px] h-[22px] flex items-center justify-center px-1.5 rounded-full border-2 border-white shadow-xl z-30 pointer-events-none animate-pulse">
                              {app.badge}
                            </span>
                          )}
                        </motion.button>

                        {/* App Label */}
                        <span
                          className={`text-[12px] font-semibold mt-1.5 text-center truncate max-w-[80px] ${
                            isDarkStatus ? 'text-neutral-900 font-bold drop-shadow-none' : 'text-white drop-shadow-md'
                          }`}
                        >
                          {app.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ================= PAGE 2: SECONDARY APPS & LASER GAME ================= */
                <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full my-auto">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                      <span>🎮</span> PawPad Arcade &amp; Utilities
                    </h3>
                    <p className="text-xs text-white/70">Interactive animal games &amp; sensory tools</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {SECONDARY_APPS.map((app) => (
                      <div key={app.id} className="flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.15, y: -6 }}
                          whileTap={{ scale: 0.88 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                          onClick={() => handleAppClick(app)}
                          className={`relative w-18 h-18 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-xl border border-white/25 overflow-hidden group`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 pointer-events-none transform -rotate-45" />
                          <app.icon size={30} className="text-white drop-shadow-md" />
                        </motion.button>
                        <span className="text-xs font-semibold text-white mt-2 drop-shadow-sm">{app.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Catch the Laser Dot Game Box */}
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 text-center shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                        <Zap size={14} className="animate-bounce" /> Catch The Laser Dot (Cat Training)
                      </span>
                      <span className="text-xs text-white font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                        🐾 Paws Caught: {laserScore}
                      </span>
                    </div>

                    <div className="relative w-full h-44 bg-neutral-950/90 rounded-2xl border border-white/10 overflow-hidden cursor-crosshair">
                      <motion.button
                        animate={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        whileTap={{ scale: 1.3 }}
                        onClick={() => {
                          const char = PAWSCRIPT_ALPHABET[0]; // Meow
                          playSound(char.audioParams, 'loud', 'short');
                          setLaserScore((s) => s + 1);
                          setLaserPos({
                            x: Math.floor(Math.random() * 80) + 10,
                            y: Math.floor(Math.random() * 70) + 15,
                          });
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-600 shadow-[0_0_25px_#ef4444] border-2 border-white flex items-center justify-center animate-laser cursor-pointer"
                        title="Pounce the red dot!"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                      </motion.button>
                      <span className="absolute bottom-2 left-2 text-[10px] text-gray-500">
                        Tap the red dot to pounce!
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Dots Indicator */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    playTapTone();
                    setActivePage(0);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activePage === 0
                      ? isDarkStatus
                        ? 'w-6 bg-neutral-900 shadow-sm'
                        : 'w-6 bg-white shadow-sm'
                      : isDarkStatus
                      ? 'w-2 bg-neutral-900/40'
                      : 'w-2 bg-white/40'
                  }`}
                />
                <button
                  onClick={() => {
                    playTapTone();
                    setActivePage(1);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activePage === 1
                      ? isDarkStatus
                        ? 'w-6 bg-neutral-900 shadow-sm'
                        : 'w-6 bg-white shadow-sm'
                      : isDarkStatus
                      ? 'w-2 bg-neutral-900/40'
                      : 'w-2 bg-white/40'
                  }`}
                />
              </div>

              {/* ==================== 3. FLOATING IPADOS DOCK & HOME INDICATOR ==================== */}
              <IPadDock
                onOpenSettings={() => {
                  playTapTone();
                  setActiveModal('settings');
                }}
                onHomeClick={() => {
                  playTapTone();
                  setActivePage(0);
                  setActiveModal(null);
                }}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* INTERACTIVE APPS MODALS (Settings, Store, Sounds, Camera, Notes) */}
          {/* ========================================================================= */}

          {/* 1. SETTINGS MODAL */}
          <AnimatePresence>
            {activeModal === 'settings' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-4 md:inset-10 z-50 bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 flex flex-col shadow-2xl overflow-y-auto text-white"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-zinc-600 flex items-center justify-center text-white shadow-md">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">PawPad Settings</h3>
                      <p className="text-xs text-gray-400">Personalize display, sounds, and wallpapers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="py-6 space-y-6 flex-1">
                  {/* Wallpaper Picker */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <span>🎨</span> Choose Animal Wallpaper or Upload Yours
                      </h4>
                      {/* Tabs */}
                      <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs">
                        <button
                          type="button"
                          onClick={() => setWallpaperTab('all')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            wallpaperTab === 'all' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          All Animals
                        </button>
                        <button
                          type="button"
                          onClick={() => setWallpaperTab('dogs')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            wallpaperTab === 'dogs' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          Dogs 🐶
                        </button>
                        <button
                          type="button"
                          onClick={() => setWallpaperTab('cats')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            wallpaperTab === 'cats' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          Cats 🐱
                        </button>
                        <button
                          type="button"
                          onClick={() => setWallpaperTab('custom')}
                          className={`px-3 py-1 rounded-lg font-medium transition-all ${
                            wallpaperTab === 'custom' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          Custom 📸
                        </button>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileWallpaperInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadCustomWallpaper}
                    />

                    {/* Custom upload box - always visible on 'custom' tab */}
                    {wallpaperTab === 'custom' && (
                      <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                              📸 Use Any Wallpaper or Pet Photo of Your Choice
                            </span>
                            <span className="text-xs text-gray-300">
                              Upload a photo of your dog, cat, or any animal directly from your device or paste an image URL.
                            </span>
                          </div>
                          {customWallpaper && (
                            <button
                              type="button"
                              onClick={handleRemoveCustomWallpaper}
                              className="px-2.5 py-1 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center gap-1.5 transition-colors"
                            >
                              <Trash2 size={12} /> Reset to Default
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => fileWallpaperInputRef.current?.click()}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-amber-400/40 hover:border-amber-400 bg-black/20 hover:bg-black/40 text-amber-200 text-xs font-semibold transition-all group"
                          >
                            <Upload size={16} className="group-hover:scale-110 transition-transform" />
                            <span>Select Photo from Device</span>
                          </button>

                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={customUrlInput}
                              onChange={(e) => setCustomUrlInput(e.target.value)}
                              placeholder="Or paste image URL (https://...)"
                              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={handleApplyCustomUrl}
                              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1 transition-all"
                            >
                              <Link2 size={13} />
                              Apply
                            </button>
                          </div>
                        </div>

                        {customWallpaper && (
                          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                            <div
                              className="w-16 h-12 rounded-lg bg-cover bg-center border border-amber-400/50 shadow-md"
                              style={{ backgroundImage: `url('${customWallpaper}')` }}
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-white block">Current Custom Wallpaper Active</span>
                              <span className="text-[11px] text-amber-300">Saved to browser & synced across PawOS desktop and iPad.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {/* If custom wallpaper exists, show it as first tile */}
                      {customWallpaper && (wallpaperTab === 'all' || wallpaperTab === 'custom') && (
                        <button
                          key="custom-active-tile"
                          onClick={() => changeWallpaper('custom')}
                          className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                            wallpaper === 'custom'
                              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 bg-white/10'
                              : 'border-white/10 hover:border-white/30 bg-white/5'
                          }`}
                        >
                          <div
                            className="w-full h-16 rounded-xl mb-2 shadow-inner bg-cover bg-center"
                            style={{ backgroundImage: `url('${customWallpaper}')` }}
                          />
                          <span className="text-xs font-semibold block truncate">📸 My Custom Photo</span>
                          <span className="text-[10px] text-amber-300">Custom Upload</span>
                          {wallpaper === 'custom' && (
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                              <Check size={10} /> Active
                            </span>
                          )}
                        </button>
                      )}

                      {(Object.keys(WALLPAPERS) as WallpaperTheme[])
                        .filter((theme) => {
                          if (theme === 'custom') return false;
                          if (wallpaperTab === 'dogs') return WALLPAPERS[theme].category === 'Dog';
                          if (wallpaperTab === 'cats') return WALLPAPERS[theme].category === 'Cat';
                          return true;
                        })
                        .map((theme) => (
                          <button
                            key={theme}
                            onClick={() => changeWallpaper(theme)}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              wallpaper === theme
                                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 bg-white/10'
                                : 'border-white/10 hover:border-white/30 bg-white/5'
                            }`}
                          >
                            <div
                              className="w-full h-16 rounded-xl mb-2 shadow-inner bg-cover bg-center"
                              style={{
                                backgroundImage: WALLPAPERS[theme].preview.startsWith('url')
                                  ? WALLPAPERS[theme].preview
                                  : undefined,
                                background: !WALLPAPERS[theme].preview.startsWith('url')
                                  ? WALLPAPERS[theme].preview
                                  : undefined,
                              }}
                            />
                            <span className="text-xs font-semibold block truncate">{WALLPAPERS[theme].name}</span>
                            <span className="text-[10px] text-gray-400">{WALLPAPERS[theme].category} Theme</span>
                            {wallpaper === theme && (
                              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                                <Check size={10} /> Active
                              </span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* App Canvas Appearance (Solid Black or Solid White) */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>🌓</span>
                      <span>App Canvas Appearance (Black / White)</span>
                    </h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Sets the background color for all open apps. Apps run on clean solid black or white without homescreen wallpaper bleed.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => changeMode('dark')}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          mode === 'dark'
                            ? 'border-amber-400 bg-black/80 ring-2 ring-amber-400/50 text-white font-bold'
                            : 'border-white/10 bg-black/30 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-black border border-neutral-700 flex items-center justify-center text-amber-300 text-xs">
                          🌙
                        </div>
                        <div className="text-left">
                          <span className="text-xs block">Dark Mode</span>
                          <span className="text-[10px] text-gray-400">Pure Black</span>
                        </div>
                      </button>

                      <button
                        onClick={() => changeMode('light')}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          mode === 'light'
                            ? 'border-amber-400 bg-white/20 ring-2 ring-amber-400/50 text-white font-bold'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-white text-neutral-950 flex items-center justify-center text-amber-600 text-xs">
                          ☀️
                        </div>
                        <div className="text-left">
                          <span className="text-xs block">Light Mode</span>
                          <span className="text-[10px] text-gray-400">Pure White</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Device Specs */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      About PawPad Pro
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Model</span>
                        <span className="font-semibold">PawPad Pro (M4 Bionic)</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">OS Version</span>
                        <span className="font-semibold">PawOS 18.4 Animal Edition</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Audio Engine</span>
                        <span className="font-semibold">WebAudio ADSR Synthesizer</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Phonetic Glyphs</span>
                        <span className="font-semibold">16 PawScript Runes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. PAWSTORE MODAL */}
          <AnimatePresence>
            {activeModal === 'pawstore' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-4 md:inset-10 z-50 bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 flex flex-col shadow-2xl overflow-y-auto text-white"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">PawStore</h3>
                      <p className="text-xs text-gray-400">Featured Apps for Cats, Dogs, Birds &amp; Wildlife</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="py-6 grid sm:grid-cols-2 gap-4 flex-1">
                  {[
                    { title: 'Zoomies Tracker Pro', emoji: '💨', desc: 'GPS & accelerometer telemetry for high speed sprint bursts in living rooms.', rating: '4.9 ⭐' },
                    { title: 'Red Dot Hologram', emoji: '🔴', desc: 'Simulation testing optical laser agility for feline species.', rating: '4.8 ⭐' },
                    { title: 'Squirrel Radar Plus', emoji: '🐿️', desc: 'Real-time notifications when bushy tails are spotted burying acorns.', rating: '5.0 ⭐' },
                    { title: 'Warm Laptop Locator', emoji: '💻', desc: 'Thermal camera scanner identifying active open keyboards to sleep on.', rating: '4.9 ⭐' },
                  ].map((item) => (
                    <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                      <div className="text-3xl p-2 bg-white/10 rounded-xl">{item.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm">{item.title}</h4>
                          <span className="text-[10px] text-amber-400">{item.rating}</span>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">{item.desc}</p>
                        <button
                          onClick={() => {
                            playTapTone();
                            alert(`Installed ${item.title} into your PawPad! 🐾`);
                          }}
                          className="mt-3 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1 rounded-full shadow-sm"
                        >
                          GET (Free)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. SOUNDBOARD MODAL */}
          <AnimatePresence>
            {activeModal === 'soundboard' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-4 md:inset-10 z-50 bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 flex flex-col shadow-2xl overflow-y-auto text-white"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Animal Soundboard</h3>
                      <p className="text-xs text-gray-400">Click any sound to synthesize via Web Audio</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 overflow-y-auto">
                  {PAWSCRIPT_ALPHABET.map((char) => (
                    <button
                      key={char.symbol}
                      onClick={() => playSound(char.audioParams, 'emphasized', 'medium')}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all hover:scale-105 active:scale-95 group"
                    >
                      <div className="text-2xl pawscript-text text-amber-400 font-bold mb-1">
                        {char.symbol}
                      </div>
                      <div className="text-xs font-bold text-white">{char.name}</div>
                      <div className="text-[10px] text-gray-400">{char.animal} • [{char.ipa}]</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. PAWCAM MODAL */}
          <AnimatePresence>
            {activeModal === 'pawcam' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-4 md:inset-10 z-50 bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 flex flex-col shadow-2xl overflow-hidden text-white"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <Camera size={16} /> PawCam 4K Viewfinder
                  </span>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 relative my-4 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-stone-900 flex items-center justify-center border border-white/10">
                  {/* Fun Pet Viewfinder Grid */}
                  <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30" />

                  <div className="text-center z-10">
                    <div className="text-7xl mb-2 float-animation">
                      {camFacingUser ? '🐱' : '🐕'}
                    </div>
                    <span className="text-xs font-mono bg-black/60 px-3 py-1 rounded-full text-amber-300 border border-amber-500/30">
                      Target: Feline Detected (AI Focus Locked 🐾)
                    </span>
                  </div>

                  <button
                    onClick={() => setCamFacingUser(!camFacingUser)}
                    className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 hover:bg-black/80"
                  >
                    Flip Camera 🔄
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <button
                    onClick={() => {
                      playAppLaunchTone();
                      alert('📸 Snap! Saved to PetGram gallery!');
                    }}
                    className="w-14 h-14 rounded-full bg-white text-neutral-900 flex items-center justify-center border-4 border-white/50 shadow-xl hover:scale-110 active:scale-90 transition-all font-bold"
                  >
                    📸
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. PAWNOTES MODAL */}
          <AnimatePresence>
            {activeModal === 'notes' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-4 md:inset-10 z-50 bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 flex flex-col shadow-2xl overflow-hidden text-white"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-amber-400" />
                    <span className="font-bold text-sm">PawNotes</span>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 my-4 flex flex-col">
                  <textarea
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-amber-200 outline-none focus:border-amber-400 resize-none leading-relaxed"
                  />
                  <div className="mt-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
                      Auto-Translated to PawScript:
                    </span>
                    <span className="pawscript-text text-sm font-semibold text-amber-300">
                      {translateToPawScript(quickNote)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
