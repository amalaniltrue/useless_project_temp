'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import {
  Wifi,
  Bluetooth,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Volume2,
  Home,
  Zap,
  Sun,
  Moon,
  Music,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTapTone, playSound, getBgmState, toggleBgm, BgmTrack } from '@/lib/sounds';
import { PAWSCRIPT_ALPHABET } from '@/lib/pawscript';
import { IPadDock } from '@/components/ui/IPadDock';
import { setPadLocked, subscribePadLock } from '@/lib/deviceLock';

interface IPadFrameProps {
  children: ReactNode;
  appName?: string;
  appEmoji?: string;
  appColor?: string;
  backHref?: string;
  rightActions?: ReactNode;
  showDock?: boolean;
}

export function IPadFrame({
  children,
  appName,
  appEmoji = '🐾',
  appColor = 'from-amber-500 to-orange-500',
  backHref = '/',
  rightActions,
  showDock = true,
}: IPadFrameProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [catCaseActive, setCatCaseActive] = useState(true);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });

  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // When an app is mounted, if not manually locked, mark device active/unlocked
    if (!isLocked) {
      setPadLocked(false);
    }
  }, [isLocked]);

  useEffect(() => {
    const unsub = subscribePadLock((locked) => {
      setIsLocked(locked);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const readMode = () => {
      try {
        const saved = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (saved === 'dark' || saved === 'light') {
          setMode(saved);
        }
      } catch {}
    };
    readMode();
    window.addEventListener('pawpad_mode_change', readMode);
    return () => window.removeEventListener('pawpad_mode_change', readMode);
  }, []);

  const [bgmInfo, setBgmInfo] = useState<{ isPlaying: boolean; currentTrack?: BgmTrack }>({ isPlaying: false });

  useEffect(() => {
    queueMicrotask(() => {
      setBgmInfo(getBgmState());
    });
    const handleBgm = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        setBgmInfo(customEvt.detail);
      }
    };
    window.addEventListener('pawlingo_bgm_change', handleBgm);
    return () => window.removeEventListener('pawlingo_bgm_change', handleBgm);
  }, []);

  const toggleMode = () => {
    playTapTone();
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    try {
      localStorage.setItem('pawpad_mode', nextMode);
      window.dispatchEvent(new Event('pawpad_mode_change'));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-0 md:p-4 select-none overflow-hidden relative font-sans text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-gradient-to-tr from-amber-600/20 via-purple-600/20 to-pink-600/20 blur-[140px] rounded-full" />
      </div>

      {/* Outer Floating Tablet Control HUD */}
      <div className="fixed top-2.5 right-3 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] text-white shadow-2xl">
        <span className="text-amber-400 font-bold flex items-center gap-1">
          <span>🐱</span>
          <span className="hidden sm:inline">CatPad Pro</span>
        </span>
        <div className="w-px h-3 bg-white/20" />
        <button
          onClick={() => {
            playTapTone();
            setCatCaseActive(!catCaseActive);
          }}
          className={`p-1 flex items-center gap-1 transition-colors ${catCaseActive ? 'text-pink-400 font-bold' : 'text-gray-400'}`}
          title="Toggle Silicone Cat Ears Case"
        >
          <span>🐾 Cat Case</span>
        </button>
        <button
          onClick={() => {
            playTapTone();
            const nextLocked = !isLocked;
            setIsLocked(nextLocked);
            setPadLocked(nextLocked);
          }}
          className="hover:text-amber-400 p-1 flex items-center gap-1"
          title={isLocked ? 'Wake Up CatPad' : 'Sleep CatPad'}
        >
          {isLocked ? <Lock size={13} className="text-red-400" /> : <Unlock size={13} />}
          <span className="hidden md:inline">{isLocked ? 'Locked' : 'Sleep'}</span>
        </button>
        <button
          onClick={toggleMode}
          className="hover:text-amber-400 p-1 flex items-center gap-1"
          title={`Switch to ${mode === 'dark' ? 'Light Mode (White)' : 'Dark Mode (Black)'}`}
        >
          {mode === 'dark' ? <Sun size={13} className="text-amber-300" /> : <Moon size={13} className="text-blue-300" />}
          <span className="hidden md:inline">{mode === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
        <button
          onClick={() => {
            playTapTone();
            setIsFullScreen(!isFullScreen);
          }}
          className="hover:text-amber-400 p-1 flex items-center gap-1"
          title={isFullScreen ? 'Fit in iPad Frame' : 'Expand to Fullscreen'}
        >
          {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span className="hidden md:inline">{isFullScreen ? 'Chassis' : 'Full'}</span>
        </button>
      </div>

      {/* Optional Interactive Floating Laser Dot for Cats */}
      <div className="fixed top-2.5 left-3 z-50">
        <button
          onClick={() => {
            playTapTone();
            setLaserActive(!laserActive);
            setLaserPos({
              x: Math.floor(Math.random() * 80) + 10,
              y: Math.floor(Math.random() * 80) + 10,
            });
          }}
          className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md transition-all flex items-center gap-1 shadow-lg ${
            laserActive
              ? 'bg-red-600 text-white border-red-400 shadow-red-500/50 animate-pulse'
              : 'bg-black/60 text-red-400 border-red-500/30 hover:bg-red-950/40'
          }`}
          title="Toggle live laser pointer for your cat!"
        >
          <Zap size={13} />
          <span>{laserActive ? 'Laser Active!' : '🔴 Laser Toy'}</span>
        </button>
      </div>

      {/* Floating Laser Dot element when active */}
      {laserActive && (
        <motion.button
          animate={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={() => {
            const meow = PAWSCRIPT_ALPHABET[0];
            playSound(meow.audioParams, 'loud', 'short');
            setLaserPos({
              x: Math.floor(Math.random() * 80) + 10,
              y: Math.floor(Math.random() * 80) + 10,
            });
          }}
          className="fixed z-50 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-[0_0_25px_#ef4444] border-2 border-white cursor-pointer animate-ping"
          title="Tap the laser dot!"
        />
      )}

      {/* ========================================================================= */}
      {/* THE IPAD CHASSIS */}
      {/* ========================================================================= */}
      <div
        className={`relative transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl ${
          isFullScreen
            ? 'w-screen h-screen rounded-none border-0'
            : 'w-full max-w-[1150px] h-[95vh] max-h-[850px] rounded-[48px] border-[14px] border-neutral-800 bg-neutral-900 shadow-[0_25px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10'
        }`}
      >
        {/* Cat Case Silhouette Ears (On Top Bezel) */}
        {!isFullScreen && catCaseActive && (
          <>
            {/* Left Cat Ear */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: -8, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 15 }}
              onClick={() => {
                const meow = PAWSCRIPT_ALPHABET[0];
                playSound(meow.audioParams, 'soft', 'short');
              }}
              className="absolute -top-[23px] left-12 w-14 h-10 bg-neutral-800 rounded-t-full border-t-2 border-l-2 border-r-2 border-neutral-700 pointer-events-auto cursor-pointer z-30 shadow-md flex items-center justify-center animate-ear-left group"
              title="Tap to tickle left cat ear!"
            >
              <div className="w-8 h-6 bg-pink-500/25 rounded-t-full mt-1 border-t border-pink-400/40 group-hover:bg-pink-500/45 transition-colors" />
            </motion.div>
            {/* Right Cat Ear */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 8, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 15 }}
              onClick={() => {
                const purr = PAWSCRIPT_ALPHABET.find((r) => r.sound === 'purr') || PAWSCRIPT_ALPHABET[0];
                playSound(purr.audioParams, 'soft', 'short');
              }}
              className="absolute -top-[23px] right-12 w-14 h-10 bg-neutral-800 rounded-t-full border-t-2 border-l-2 border-r-2 border-neutral-700 pointer-events-auto cursor-pointer z-30 shadow-md flex items-center justify-center animate-ear-right group"
              title="Tap to tickle right cat ear!"
            >
              <div className="w-8 h-6 bg-pink-500/25 rounded-t-full mt-1 border-t border-pink-400/40 group-hover:bg-pink-500/45 transition-colors" />
            </motion.div>
          </>
        )}

        {/* Front Camera Pill Sensor on Top Bezel */}
        {!isFullScreen && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" title="Cat FaceID / Retina Scanner active" />
          </div>
        )}

        {/* iPad Inner Screen Content Box - Solid Black or White by mode */}
        <div
          className={`relative flex-1 flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
            mode === 'dark' ? 'bg-[#09090b] text-white' : 'bg-[#f8f9fa] text-neutral-900'
          }`}
        >
          {/* ================= 1. IPADOS TOP STATUS BAR ================= */}
          <div
            className={`h-7 px-5 pt-1.5 flex items-center justify-between text-xs z-30 font-medium select-none transition-colors ${
              mode === 'dark'
                ? 'bg-black/85 text-white/80 border-b border-white/10'
                : 'bg-white/90 text-neutral-700 border-b border-neutral-200'
            }`}
          >
            {/* Left: Time & Purr-Fi */}
            <div className="flex items-center gap-2">
              <span className={`font-bold text-xs tracking-tight ${mode === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                {currentTime || '9:41'}
              </span>
              <span className="opacity-40">•</span>
              <span className="hidden sm:inline text-[10px] opacity-75">{currentDate}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-500 font-bold px-2 py-0.2 rounded-full border border-amber-500/30 flex items-center gap-1">
                <span>🐱</span> Purr-Fi 5G
              </span>
              {bgmInfo.isPlaying && bgmInfo.currentTrack && (
                <button
                  onClick={() => {
                    playTapTone();
                    toggleBgm();
                  }}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold cursor-pointer hover:bg-amber-500/30 transition-all"
                  title="BGM Active (Tap to pause/resume)"
                >
                  <Music size={10} className="animate-spin [animation-duration:5s]" />
                  <span className="hidden md:inline truncate max-w-[110px]">{bgmInfo.currentTrack.title}</span>
                </button>
              )}
            </div>

            {/* Right: Mode Toggle, Sound, Battery (Fish Energy), Network */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={toggleMode}
                className={`p-1 rounded-full transition-colors ${
                  mode === 'dark' ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-neutral-200 text-amber-600'
                }`}
                title={`Switch to ${mode === 'dark' ? 'Light Mode (White)' : 'Dark Mode (Black)'}`}
              >
                {mode === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              </button>
              <button
                onClick={() => {
                  const meow = PAWSCRIPT_ALPHABET[0];
                  playSound(meow.audioParams, 'soft', 'short');
                }}
                className={`p-0.5 transition-colors ${
                  mode === 'dark' ? 'hover:text-amber-400 text-white/70' : 'hover:text-amber-600 text-neutral-600'
                }`}
                title="Hear a gentle meow chime"
              >
                <Volume2 size={13} />
              </button>
              <Bluetooth size={12} className="opacity-60" />
              <Wifi size={13} />
              <div
                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border cursor-default group ${
                  mode === 'dark' ? 'bg-white/10 border-white/15' : 'bg-black/5 border-black/10'
                }`}
                title="Fish Energy: 99% Full"
              >
                <span className="text-emerald-500 font-bold">99%</span>
                <span className="text-xs animate-fish">🐟</span>
              </div>
            </div>
          </div>

          {/* ================= 2. IPADOS APP HEADER BAR ================= */}
          <div
            className={`px-4 py-2 flex items-center justify-between z-20 shadow-xs transition-colors ${
              mode === 'dark'
                ? 'bg-[#121216]/95 backdrop-blur-xl border-b border-white/10 text-white'
                : 'bg-white/95 backdrop-blur-xl border-b border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Link
                href={backHref}
                onClick={playTapTone}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                  mode === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300'
                }`}
              >
                <ChevronLeft size={16} />
                <span>PawPad</span>
              </Link>

              {appName && (
                <div className="flex items-center gap-2 ml-2">
                  <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${appColor} flex items-center justify-center text-xs shadow-xs border border-white/20`}>
                    {appEmoji}
                  </span>
                  <span className={`font-bold text-sm ${mode === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{appName}</span>
                </div>
              )}
            </div>

            {/* iPad Multitasking Center Pill (•••) */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              onClick={playTapTone}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer border shadow-sm transition-all ${
                mode === 'dark' ? 'bg-white/10 border-white/15' : 'bg-black/5 border-black/10'
              }`}
              title="iPad Multitasking Center"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mode === 'dark' ? 'bg-white/90' : 'bg-neutral-700'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${mode === 'dark' ? 'bg-white/90' : 'bg-neutral-700'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${mode === 'dark' ? 'bg-white/90' : 'bg-neutral-700'}`} />
            </motion.div>

            {/* Right App Actions */}
            <div className="flex items-center gap-2">
              {rightActions}

              {/* Quick Jump to Home */}
              <Link
                href="/"
                onClick={playTapTone}
                className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
                  mode === 'dark'
                    ? 'bg-white/10 hover:bg-amber-500 text-white'
                    : 'bg-neutral-100 hover:bg-amber-500 hover:text-white text-neutral-800'
                }`}
                title="Return to Springboard Home"
              >
                <Home size={15} />
              </Link>
            </div>
          </div>

          {/* ================= 3. SCROLLABLE APP BODY ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide flex flex-col ${
              mode === 'dark' ? 'bg-[#09090b]' : 'bg-[#f8f9fa]'
            }`}
          >
            {children}
          </motion.div>

          {/* ================= 4. IPADOS BOTTOM DOCK & HOME INDICATOR ================= */}
          {showDock && (
            <div className={`pt-1.5 pb-1 flex flex-col items-center justify-center z-30 pointer-events-auto transition-colors ${
              mode === 'dark'
                ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                : 'bg-gradient-to-t from-neutral-200/90 via-neutral-100/40 to-transparent'
            }`}>
              <IPadDock />
            </div>
          )}

          {/* ================= LOCK SCREEN MODAL ================= */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="absolute inset-0 z-50 backdrop-blur-2xl bg-black/75 flex flex-col items-center justify-between p-8 select-none text-white"
              >
                <div className="text-center pt-6">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3 border border-white/20">
                    <Lock size={18} className="text-amber-300" />
                  </div>
                  <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-md">
                    {currentTime || '9:41'}
                  </h1>
                  <p className="text-sm text-white/80 font-medium mt-1">
                    {currentDate || 'Saturday, September 12'}
                  </p>
                </div>

                <div className="text-center my-auto">
                  <div className="text-5xl mb-3 float-animation">🐱</div>
                  <p className="text-base font-bold text-amber-300">CatPad is napping 💤</p>
                  <p className="text-xs text-white/70 mt-1">Tap below to wake up and resume session</p>
                </div>

                <button
                  onClick={() => {
                    playTapTone();
                    setIsLocked(false);
                    setPadLocked(false);
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 text-white shadow-xl hover:scale-105 transition-all"
                >
                  <Unlock size={15} />
                  <span>Tap to Wake CatPad</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
