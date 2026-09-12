'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Camera,
  Heart,
  Search,
  Languages,
  Monitor,
  Settings,
  X,
  Check,
  Volume2,
  Sparkles,
  Upload,
  Trash2,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTapTone, playAppLaunchTone, playSound } from '@/lib/sounds';
import { PAWSCRIPT_ALPHABET } from '@/lib/pawscript';

export interface DockAppItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  badge?: string | number;
}

export const DOCK_APPS: DockAppItem[] = [
  {
    id: 'home',
    name: 'PawPad',
    href: '/',
    icon: Home,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
  },
  {
    id: 'pawchat',
    name: 'PawChat',
    href: '/pawchat',
    icon: MessageCircle,
    gradient: 'from-emerald-400 to-green-600',
    badge: 5,
  },
  {
    id: 'petgram',
    name: 'PetGram',
    href: '/petgram',
    icon: Camera,
    gradient: 'from-pink-500 via-rose-500 to-amber-500',
    badge: 3,
  },
  {
    id: 'pawmatch',
    name: 'PawMatch',
    href: '/pawmatch',
    icon: Heart,
    gradient: 'from-fuchsia-500 to-purple-600',
    badge: 'New',
  },
  {
    id: 'pawsearch',
    name: 'PawSearch',
    href: '/pawsearch',
    icon: Search,
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'pawscript',
    name: 'PawScript',
    href: '/pawscript',
    icon: Languages,
    gradient: 'from-amber-400 to-orange-600',
    badge: 16,
  },
  {
    id: 'pawos',
    name: 'PawOS',
    href: '/pawos',
    icon: Monitor,
    gradient: 'from-zinc-800 to-stone-900',
  },
];

export const WALLPAPER_LIST = [
  { id: 'cat_wallpaper', name: '🐱 CatPad Sunbeam', category: 'Cat', preview: "url('/pictures/cat/Wallpaper.webp')" },
  { id: 'benjamin_scholar', name: '🤓 Benjamin Scholar Dog', category: 'Dog', preview: "url('/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp')" },
  { id: 'husky_snow', name: '❄️ Arctic Husky Wolf', category: 'Dog', preview: "url('/images/animals/husky_snow.jpg')" },
  { id: 'golden_meadow', name: '🌾 Golden Meadow Gallop', category: 'Dog', preview: "url('/pictures/dog/funny-dog-pics-6-10-24-2024.webp')" },
  { id: 'kalyani_acrobat', name: '🎪 Kalyani Calico Acrobat', category: 'Cat', preview: "url('/pictures/cat/CWbUskSKeMT-png__700.webp')" },
  { id: 'lady_dimitrescu', name: '👑 Empress Lady Dimitrescu', category: 'Cat', preview: "url('/pictures/cat/CQRCz9RppTd-png__700.webp')" },
  { id: 'winter_cat', name: '🧶 Cozy Winter Cat', category: 'Cat', preview: "url('/pictures/cat/COaEeSIpWQW-png__700.webp')" },
  { id: 'gentle_golden', name: '💛 Shantha Gentle Golden', category: 'Dog', preview: "url('/pictures/dog/funny-dog-pics-19-10-24-2024.webp')" },
  { id: 'rocket_frenchie', name: '🚀 Missile Bowtie Rocket', category: 'Dog', preview: "url('/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp')" },
  { id: 'naughty_water', name: '🥛 Microwave 3AM Water Cat', category: 'Cat', preview: "url('/pictures/cat/naughty.webp')" },
];

interface IPadDockProps {
  onOpenSettings?: () => void;
  onHomeClick?: () => void;
  className?: string;
}

export function IPadDock({ onOpenSettings, onHomeClick, className = '' }: IPadDockProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [selectedWallpaper, setSelectedWallpaper] = useState('cat_wallpaper');
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [dockWallpaperTab, setDockWallpaperTab] = useState<'all' | 'dogs' | 'cats' | 'custom'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedCustom = localStorage.getItem('pawpad_custom_wallpaper');
        if (savedCustom) setCustomWallpaper(savedCustom);
        const saved = localStorage.getItem('pawpad_wallpaper');
        if (saved) setSelectedWallpaper(saved);
        const savedM = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (savedM === 'dark' || savedM === 'light') setMode(savedM);
      } catch {}
    });

    const handleWallpaperChange = () => {
      try {
        const savedCustom = localStorage.getItem('pawpad_custom_wallpaper');
        if (savedCustom) setCustomWallpaper(savedCustom);
        const saved = localStorage.getItem('pawpad_wallpaper');
        if (saved) setSelectedWallpaper(saved);
      } catch {}
    };
    const handleModeChange = () => {
      try {
        const saved = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (saved === 'dark' || saved === 'light') setMode(saved);
      } catch {}
    };
    window.addEventListener('pawpad_wallpaper_change', handleWallpaperChange);
    window.addEventListener('pawpad_mode_change', handleModeChange);
    return () => {
      window.removeEventListener('pawpad_wallpaper_change', handleWallpaperChange);
      window.removeEventListener('pawpad_mode_change', handleModeChange);
    };
  }, []);

  const handleUploadCustomWallpaper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === 'string') {
          const dataUrl = loadEvt.target.result;
          setCustomWallpaper(dataUrl);
          setSelectedWallpaper('custom');
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
    setSelectedWallpaper('custom');
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
      localStorage.setItem('pawpad_wallpaper', 'cat_wallpaper');
      window.dispatchEvent(new Event('pawpad_wallpaper_change'));
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

  const getItemTransform = (index: number) => {
    if (hoveredIdx === null) return { scale: 1, y: 0 };
    const distance = Math.abs(index - hoveredIdx);
    if (distance === 0) return { scale: 1.28, y: -10 };
    if (distance === 1) return { scale: 1.15, y: -5 };
    if (distance === 2) return { scale: 1.05, y: -2 };
    return { scale: 1, y: 0 };
  };

  const handleAppClick = (app: DockAppItem) => {
    const isCurrent =
      app.href === '/'
        ? pathname === '/'
        : pathname === app.href || pathname.startsWith(app.href + '/');

    if (isCurrent) {
      playTapTone();
      if (app.href === '/' && onHomeClick) {
        onHomeClick();
      }
      return;
    }

    playAppLaunchTone();
    router.push(app.href);
  };

  const handleSettingsClick = () => {
    playTapTone();
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      setIsSettingsOpen(true);
    }
  };

  const handleHomeBarClick = () => {
    playTapTone();
    if (onHomeClick) {
      onHomeClick();
    }
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const changeWallpaper = (id: string) => {
    playTapTone();
    setSelectedWallpaper(id);
    try {
      localStorage.setItem('pawpad_wallpaper', id);
      window.dispatchEvent(new Event('pawpad_wallpaper_change'));
    } catch {
      // Ignore localStorage errors
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center z-30 select-none ${className}`}>
      {/* ==================== 1. FLOATING IPADOS DOCK ==================== */}
      <div className="pt-1.5 pb-1 flex justify-center">
        <div
          onMouseLeave={() => setHoveredIdx(null)}
          className="bg-white/20 hover:bg-white/25 backdrop-blur-2xl border border-white/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[28px] sm:rounded-[32px] flex items-center gap-2 sm:gap-3 md:gap-4 shadow-[0_15px_35px_rgba(0,0,0,0.3)] transition-all"
        >
          {DOCK_APPS.map((app, idx) => {
            const isAppActive =
              app.href === '/'
                ? pathname === '/'
                : pathname === app.href || pathname.startsWith(app.href + '/');

            return (
              <motion.button
                key={`dock-${app.id}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                animate={getItemTransform(idx)}
                whileTap={{ scale: 0.88, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.5 }}
                onClick={() => handleAppClick(app)}
                className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[14px] sm:rounded-[16px] md:rounded-[18px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg border border-white/30 cursor-pointer group flex-shrink-0`}
                title={app.name}
              >
                {/* Gloss sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[14px] sm:rounded-[16px] md:rounded-[18px] pointer-events-none" />

                {/* Shimmer light sweep */}
                <div className="absolute inset-0 overflow-hidden rounded-[14px] sm:rounded-[16px] md:rounded-[18px] pointer-events-none">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 pointer-events-none transform -rotate-45" />
                </div>

                {/* Active App Glow Ring */}
                {isAppActive && (
                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute -inset-0.5 rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border-2 border-white/95 shadow-[0_0_14px_rgba(255,255,255,0.75)] pointer-events-none"
                  />
                )}

                {/* App Icon */}
                <app.icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white drop-shadow-md" />

                {/* Notification Badge */}
                {app.badge && (
                  <motion.span
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full border-2 border-white shadow-lg pointer-events-none z-30"
                  >
                    {app.badge}
                  </motion.span>
                )}

                {/* Breathing Active Dot Indicator Underneath */}
                {isAppActive && (
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.75, 1, 0.75] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                    className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] ring-1 ring-black/30 pointer-events-none"
                  />
                )}

                {/* Hover Tooltip */}
                <span className="absolute -top-9 bg-black/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 whitespace-nowrap z-50">
                  {app.name}
                </span>
              </motion.button>
            );
          })}

          {/* Vertical Dock Divider */}
          <div className="w-px h-6 sm:h-7 md:h-8 bg-white/30 mx-0.5 sm:mx-1 flex-shrink-0" />

          {/* Settings Shortcut Button */}
          <motion.button
            onMouseEnter={() => setHoveredIdx(DOCK_APPS.length)}
            animate={getItemTransform(DOCK_APPS.length)}
            whileTap={{ scale: 0.88, y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.5 }}
            onClick={handleSettingsClick}
            className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[14px] sm:rounded-[16px] md:rounded-[18px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/30 cursor-pointer group flex-shrink-0"
            title="PawPad Settings"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[14px] sm:rounded-[16px] md:rounded-[18px] pointer-events-none" />
            <div className="absolute inset-0 overflow-hidden rounded-[14px] sm:rounded-[16px] md:rounded-[18px] pointer-events-none">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 pointer-events-none transform -rotate-45" />
            </div>
            <Settings className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white drop-shadow-md group-hover:rotate-45 transition-transform duration-300" />
            <span className="absolute -top-9 bg-black/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 whitespace-nowrap z-50">
              Settings
            </span>
          </motion.button>
        </div>
      </div>

      {/* ==================== 2. IPAD HOME BAR PILL ==================== */}
      <div className="pb-1 pt-1.5 flex justify-center w-full">
        <motion.div
          whileHover={{ scaleX: 1.28, scaleY: 1.8, y: -2, backgroundColor: 'rgba(255,255,255,1)' }}
          whileTap={{ scaleX: 0.82, scaleY: 0.7 }}
          transition={{ type: 'spring', stiffness: 550, damping: 22 }}
          onClick={handleHomeBarClick}
          className="w-32 sm:w-36 h-1 bg-white/70 rounded-full cursor-pointer shadow-sm hover:shadow-[0_0_14px_rgba(255,255,255,0.9)] block transition-colors"
          title="iPad Home Indicator (Tap to return Home)"
        />
      </div>

      {/* ==================== 3. EMBEDDED SETTINGS MODAL ==================== */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            className="fixed inset-4 sm:inset-10 md:inset-16 z-50 bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 p-5 sm:p-7 flex flex-col shadow-2xl overflow-y-auto text-white"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">PawPad Settings</h3>
                  <p className="text-xs text-gray-400">Personalize display, sounds, and wallpapers</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors"
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
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setDockWallpaperTab('all')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        dockWallpaperTab === 'all' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      All Animals
                    </button>
                    <button
                      type="button"
                      onClick={() => setDockWallpaperTab('dogs')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        dockWallpaperTab === 'dogs' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Dogs 🐶
                    </button>
                    <button
                      type="button"
                      onClick={() => setDockWallpaperTab('cats')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        dockWallpaperTab === 'cats' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Cats 🐱
                    </button>
                    <button
                      type="button"
                      onClick={() => setDockWallpaperTab('custom')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        dockWallpaperTab === 'custom' ? 'bg-amber-500 text-black shadow' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Custom 📸
                    </button>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadCustomWallpaper}
                />

                {/* Custom upload box */}
                {dockWallpaperTab === 'custom' && (
                  <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                          📸 Set Custom Pet Photo or Wallpaper
                        </span>
                        <span className="text-xs text-gray-300">
                          Upload any photo from your device or paste an image link.
                        </span>
                      </div>
                      {customWallpaper && (
                        <button
                          type="button"
                          onClick={handleRemoveCustomWallpaper}
                          className="px-2.5 py-1 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 size={12} /> Reset
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
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
                          placeholder="Or paste image URL"
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
                          <span className="font-semibold text-white block">Custom Wallpaper Active</span>
                          <span className="text-[11px] text-amber-300">Saved and applied across all PawPad views.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* Active custom tile */}
                  {customWallpaper && (dockWallpaperTab === 'all' || dockWallpaperTab === 'custom') && (
                    <button
                      key="dock-custom-active"
                      onClick={() => changeWallpaper('custom')}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                        selectedWallpaper === 'custom'
                          ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02] bg-white/10'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-xl mb-2 shadow-inner bg-cover bg-center"
                        style={{ backgroundImage: `url('${customWallpaper}')` }}
                      />
                      <span className="text-xs font-semibold block truncate">📸 My Custom Photo</span>
                      <span className="text-[10px] text-amber-300">Custom Upload</span>
                      {selectedWallpaper === 'custom' && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                          <Check size={10} /> Active
                        </span>
                      )}
                    </button>
                  )}

                  {WALLPAPER_LIST.filter((theme) => {
                    if (dockWallpaperTab === 'dogs') return theme.category === 'Dog';
                    if (dockWallpaperTab === 'cats') return theme.category === 'Cat';
                    return true;
                  }).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => changeWallpaper(theme.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedWallpaper === theme.id
                          ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02] bg-white/10'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-xl mb-2 shadow-inner bg-cover bg-center"
                        style={{
                          backgroundImage: theme.preview.startsWith('url') ? theme.preview : undefined,
                          background: !theme.preview.startsWith('url') ? theme.preview : undefined,
                        }}
                      />
                      <span className="text-xs font-semibold block truncate">{theme.name}</span>
                      <span className="text-[10px] text-gray-400">{theme.category} Theme</span>
                      {selectedWallpaper === theme.id && (
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
                  Controls the background color inside apps. No gradients bleed into app screens.
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

              {/* Sound Synthesizer Test */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Volume2 size={14} className="text-amber-400" />
                  <span>Acoustic Engine Test</span>
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  Tap to verify real-time WebAudio synthesis frequencies for feline and canine audio.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['meow', 'purr', 'chirp', 'bark', 'howl'].map((sound) => (
                    <button
                      key={sound}
                      onClick={() => {
                        const rune = PAWSCRIPT_ALPHABET.find((r) => r.sound === sound) || PAWSCRIPT_ALPHABET[0];
                        playSound(rune.audioParams, 'loud', 'short');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500/20 text-xs font-semibold border border-white/15 hover:border-amber-400/40 text-amber-200 transition-all flex items-center gap-1.5"
                    >
                      <span>🔊</span>
                      <span className="capitalize">{sound}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Specs */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>About PawPad Pro</span>
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
    </div>
  );
}
