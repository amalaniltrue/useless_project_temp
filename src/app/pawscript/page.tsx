'use client';

import { useState, useEffect } from 'react';
import {
  Volume2,
  Languages,
  Keyboard,
  BookOpen,
  Waves,
  Activity,
  Sliders,
  FolderOpen,
  Filter,
  CheckCircle2,
  Layers,
  HeartPulse,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PAWSCRIPT_ALPHABET,
  STRESS_MODIFIERS,
  DURATION_MODIFIERS,
  translateToPawScript,
  translateFromPawScript,
  getAnimalEmoji,
  applyStress,
  applyDuration,
} from '@/lib/pawscript';
import { playSound, playTapTone } from '@/lib/sounds';
import { IPadFrame } from '@/components/ui/IPadFrame';
import type { StressLevel, DurationLevel, PawScriptCharacter, MouthMechanic } from '@/types';

type Tab = 'alphabet' | 'lifestages' | 'translator' | 'keyboard';

export default function PawScriptPage() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<Tab>('alphabet');
  const [inputText, setInputText] = useState(
    'The kitten lets out a mew and purrs, while the adult dog gives a play bark followed by an awoo howl'
  );
  const [composedText, setComposedText] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Active modifiers for interactive pronunciation
  const [selectedStress, setSelectedStress] = useState<StressLevel>('neutral');
  const [selectedDuration, setSelectedDuration] = useState<DurationLevel>('medium');

  // Filter states
  const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState<string>('All');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [selectedMechanicFilter, setSelectedMechanicFilter] = useState<string>('All');

  // Selected character for deep phonetic trajectory inspection
  const [inspectedChar, setInspectedChar] = useState<PawScriptCharacter>(PAWSCRIPT_ALPHABET[0]);

  useEffect(() => {
    const readMode = () => {
      try {
        const saved = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (saved === 'dark' || saved === 'light') setMode(saved);
      } catch {}
    };
    readMode();
    window.addEventListener('pawpad_mode_change', readMode);
    return () => window.removeEventListener('pawpad_mode_change', readMode);
  }, []);

  const handlePlaySound = (
    char: PawScriptCharacter,
    stress: StressLevel = selectedStress,
    duration: DurationLevel = selectedDuration
  ) => {
    playTapTone();
    setPlayingId(char.id);
    playSound(char.audioParams, stress, duration);
    setTimeout(() => setPlayingId(null), 1200);
  };

  const tabs = [
    { id: 'alphabet' as Tab, label: 'Alphabet & Phonetics', icon: BookOpen },
    { id: 'lifestages' as Tab, label: 'Life Stages & Bioacoustics', icon: Layers },
    { id: 'translator' as Tab, label: 'Live Translator', icon: Languages },
    { id: 'keyboard' as Tab, label: 'Typing Pad', icon: Keyboard },
  ];

  const speciesList = ['All', 'Cat', 'Dog'];

  const stageOptions = [
    { id: 'All', label: 'All Life Stages' },
    { id: 'kitten_puppy', label: 'Kittenhood / Puppyhood (0-6 Mo)' },
    { id: 'adolescence_adulthood', label: 'Adolescence & Adulthood' },
    { id: 'senior_years', label: 'Senior Years (10+ Yrs)' },
  ];

  const mechanicOptions: Array<'All' | MouthMechanic> = [
    'All',
    'Murmur (Mouth Closed)',
    'Vowel (Mouth Open-to-Closed)',
    'High-Intensity (Mouth Wide Open)',
    'Pack Resonance (Oral Horn)',
  ];

  const filteredCharacters = PAWSCRIPT_ALPHABET.filter((char) => {
    const matchesSpecies =
      selectedSpeciesFilter === 'All' || char.animal.toLowerCase() === selectedSpeciesFilter.toLowerCase();

    let matchesStage = true;
    if (selectedStageFilter === 'kitten_puppy') {
      matchesStage = char.lifeStage.includes('Kittenhood') || char.lifeStage.includes('Puppyhood');
    } else if (selectedStageFilter === 'adolescence_adulthood') {
      matchesStage = char.lifeStage.includes('Adolescence & Adulthood');
    } else if (selectedStageFilter === 'senior_years') {
      matchesStage = char.lifeStage.includes('Senior');
    }

    const matchesMechanic =
      selectedMechanicFilter === 'All' || char.mouthMechanic === selectedMechanicFilter;

    return matchesSpecies && matchesStage && matchesMechanic;
  });

  const cardBg = mode === 'dark' ? 'bg-[#121216] border-white/10 text-white' : 'bg-white border-neutral-200 text-neutral-900';
  const subCardBg = mode === 'dark' ? 'bg-[#1a1a22] border-white/10' : 'bg-neutral-50 border-neutral-200';
  const pillInactive = mode === 'dark' ? 'bg-white/10 text-white/70 hover:bg-white/15' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200';

  return (
    <IPadFrame
      appName="PawScript"
      appEmoji="🔤"
      appColor="from-amber-500 to-orange-600"
      rightActions={
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Waves size={13} />
            <span>Bioacoustics V2</span>
          </div>
        </div>
      }
    >
      <div className={`flex-1 flex flex-col overflow-y-auto ${mode === 'dark' ? 'bg-[#09090b] text-white' : 'bg-[#f8f9fa] text-neutral-900'} transition-colors duration-300`}>
        {/* Header Hero */}
        <div className="px-6 pt-6 pb-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-500 px-4 py-1 rounded-full text-xs font-semibold mb-3 border border-amber-500/30 shadow-xs">
            <Waves size={13} className="text-amber-400" />
            <span>Cats &amp; Dogs Bioacoustic Phonetics • Life Stages &amp; Formant Trajectories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-2">
            <span>PawScript</span>
            <span className="text-amber-500 font-mono text-2xl sm:text-3xl">ᛗᛖᐱ</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-2 leading-relaxed">
            Phonetic notation grounded in real animal physiology. Includes <strong>Cats</strong> (Murmurs, Vowels, High-Intensity) &amp; <strong>Dogs</strong> (Pitch, Duration, Pack Harmonics) across Kittenhood/Puppyhood, Adulthood, and Senior Years.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 px-4 mb-6 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTapTone();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : pillInactive
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 w-full">
          <AnimatePresence mode="wait">
            {/* ==================== 1. ALPHABET & PHONETICS TAB ==================== */}
            {activeTab === 'alphabet' && (
              <motion.div
                key="alphabet"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Real Audio Status Banner */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-orange-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                      <FolderOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                        <span>Real Animal Soundtracks Connected</span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                          68 Real Audio Tracks Active
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        High-fidelity animal recordings cached via Web Audio API with biological formant synthesis fallback.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acoustic Modifiers Control Bar */}
                <div className={`rounded-2xl p-4 border ${cardBg} shadow-sm`}>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold flex items-center gap-1.5 text-sm">
                        <Sliders size={15} className="text-amber-500" />
                        <span>Live Acoustic Modifiers</span>
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Adjust pitch tension, vocal volume, and duration on live playback.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {/* Stress Level */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-400">Stress:</span>
                        <div className={`flex p-0.5 rounded-xl ${subCardBg} border`}>
                          {STRESS_MODIFIERS.map((s) => (
                            <button
                              key={s.level}
                              onClick={() => {
                                playTapTone();
                                setSelectedStress(s.level);
                              }}
                              className={`px-2 py-1 rounded-lg capitalize font-semibold transition-all ${
                                selectedStress === s.level
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              {s.level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Duration Level */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-400">Duration:</span>
                        <div className={`flex p-0.5 rounded-xl ${subCardBg} border`}>
                          {DURATION_MODIFIERS.map((d) => (
                            <button
                              key={d.level}
                              onClick={() => {
                                playTapTone();
                                setSelectedDuration(d.level);
                              }}
                              className={`px-2 py-1 rounded-lg capitalize font-semibold transition-all ${
                                selectedDuration === d.level
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              {d.level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className={`rounded-2xl p-4 border ${cardBg} space-y-2.5`}>
                  {/* Species Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="font-bold text-neutral-400 flex items-center gap-1 flex-shrink-0">
                      <Filter size={12} /> Species:
                    </span>
                    {speciesList.map((species) => (
                      <button
                        key={species}
                        onClick={() => {
                          playTapTone();
                          setSelectedSpeciesFilter(species);
                        }}
                        className={`px-3 py-1 rounded-full font-semibold transition-all flex-shrink-0 ${
                          selectedSpeciesFilter === species
                            ? 'bg-amber-500 text-white shadow-xs'
                            : pillInactive
                        }`}
                      >
                        {species === 'All' ? '🐾 All (Cats & Dogs)' : `${getAnimalEmoji(species)} ${species}`}
                      </button>
                    ))}
                  </div>

                  {/* Life Stage Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="font-bold text-neutral-400 flex items-center gap-1 flex-shrink-0">
                      <HeartPulse size={12} /> Stage:
                    </span>
                    {stageOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          playTapTone();
                          setSelectedStageFilter(opt.id);
                        }}
                        className={`px-3 py-1 rounded-full font-semibold transition-all flex-shrink-0 ${
                          selectedStageFilter === opt.id
                            ? 'bg-orange-600 text-white shadow-xs'
                            : pillInactive
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Mouth Mechanics Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="font-bold text-neutral-400 flex-shrink-0">Mechanics:</span>
                    {mechanicOptions.map((mec) => (
                      <button
                        key={mec}
                        onClick={() => {
                          playTapTone();
                          setSelectedMechanicFilter(mec);
                        }}
                        className={`px-3 py-1 rounded-full font-semibold transition-all flex-shrink-0 ${
                          selectedMechanicFilter === mec
                            ? 'bg-amber-700 text-white shadow-xs'
                            : pillInactive
                        }`}
                      >
                        {mec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phonetic Trajectory Inspector (Interactive Deep Dive) */}
                {inspectedChar && (
                  <div className={`rounded-3xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-xl ${cardBg}`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl font-black font-mono shadow-inner border border-amber-500/30">
                          {applyDuration(applyStress(inspectedChar.symbol, selectedStress), selectedDuration)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-black">{inspectedChar.name}</h3>
                            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                              {getAnimalEmoji(inspectedChar.animal)} {inspectedChar.animal}
                            </span>
                            <span className="text-xs bg-purple-500/20 text-purple-400 font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                              {inspectedChar.lifeStage}
                            </span>
                            <span className="text-xs bg-white/10 text-neutral-300 font-mono px-2 py-0.5 rounded-md border border-white/10">
                              IPA [{inspectedChar.ipa}]
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1 flex-wrap">
                            <span>Mechanic: <strong className="text-amber-400">{inspectedChar.mouthMechanic}</strong></span>
                            <span>•</span>
                            <span>Situation: <strong className="text-white/80">{inspectedChar.situation}</strong></span>
                            <span>•</span>
                            <span>Base F0: <strong className="text-white/80">{inspectedChar.audioParams.frequency} Hz</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlaySound(inspectedChar)}
                        className={`w-full md:w-auto px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                          playingId === inspectedChar.id
                            ? 'bg-amber-600 text-white scale-105 ring-2 ring-amber-400/50'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white hover:scale-105'
                        }`}
                      >
                        <Volume2 size={16} className={playingId === inspectedChar.id ? 'animate-bounce' : ''} />
                        <span>{playingId === inspectedChar.id ? 'Playing Acoustic Wave...' : 'Pronounce Sound'}</span>
                      </button>
                    </div>

                    {/* Meaning & Acoustic Biology */}
                    <div className="py-4 space-y-2">
                      <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/25">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-0.5">Bioacoustic Meaning</div>
                        <p className="text-sm font-medium italic text-amber-200">{inspectedChar.meaning}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
                        {inspectedChar.description}
                      </p>
                    </div>

                    {/* Phonetic Stages Timeline */}
                    <div className="pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                        <Activity size={14} className="text-amber-400" />
                        <span>Dynamic Vocal Tract Formant Timeline</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {inspectedChar.phoneticStages.map((stage) => (
                          <div
                            key={stage.label}
                            className={`rounded-2xl p-3 border ${subCardBg} relative overflow-hidden`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold font-mono text-amber-400 text-sm">{stage.ipa}</span>
                              <span className="text-[10px] bg-white/10 text-white/80 font-bold px-1.5 py-0.5 rounded border border-white/10">
                                ~{stage.timePercent}% mark
                              </span>
                            </div>
                            <div className="text-xs font-semibold mb-1">{stage.label}</div>
                            <p className="text-[11px] text-neutral-400 leading-normal mb-2">{stage.description}</p>
                            <div className="flex flex-wrap gap-1 text-[10px] text-neutral-400 font-mono pt-1 border-t border-white/10">
                              <span className="bg-black/20 px-1 rounded">F0: {stage.pitchHz}Hz</span>
                              {stage.formants && (
                                <span className="bg-black/20 px-1 rounded">
                                  F1:{stage.formants.f1}Hz F2:{stage.formants.f2}Hz
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Real Audio Source Badge */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>
                          Audio File:{' '}
                          {inspectedChar.audioParams.realAudioFile ? (
                            <code className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-white/10">
                              {inspectedChar.audioParams.realAudioFile}
                            </code>
                          ) : (
                            <span className="text-amber-400 font-semibold">Real-time Formant Synthesized</span>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-75">Click any symbol card below to inspect</span>
                    </div>
                  </div>
                )}

                {/* Character Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredCharacters.map((char) => {
                    const isSelected = inspectedChar?.id === char.id;
                    const isPlaying = playingId === char.id;
                    return (
                      <motion.div
                        key={char.id}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setInspectedChar(char);
                          handlePlaySound(char);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'ring-2 ring-amber-500 bg-amber-500/15 border-amber-500/40 shadow-lg'
                            : `${cardBg} hover:border-amber-500/30`
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-neutral-400">{getAnimalEmoji(char.animal)} {char.animal}</span>
                            <span className="text-[10px] bg-white/10 text-neutral-300 font-mono px-1 rounded">
                              {char.ipa}
                            </span>
                          </div>
                          <div className="text-center my-2">
                            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mb-0.5">
                              {char.symbol}
                            </div>
                            <div className="text-xs font-bold truncate">{char.sound}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 truncate max-w-[80px]">{char.lifeStage.split('(')[0]}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySound(char);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPlaying ? 'bg-amber-500 text-white animate-pulse' : 'bg-white/10 hover:bg-amber-500 hover:text-white'
                            }`}
                            title="Play Sound"
                          >
                            <Volume2 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ==================== 2. LIFE STAGES & BIOACOUSTICS TAB ==================== */}
            {activeTab === 'lifestages' && (
              <motion.div
                key="lifestages"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className={`rounded-3xl p-6 border ${cardBg} shadow-sm`}>
                  <h2 className="text-xl sm:text-2xl font-black mb-2 flex items-center gap-2">
                    <Layers className="text-amber-500" size={22} />
                    <span>The Comparative Bioacoustics Guide: Cats vs. Dogs</span>
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    Cats possess nearly <strong>100 distinct vocalizations</strong> compared to a dog&apos;s 10.
                    These sounds evolve across life stages (Kittenhood/Puppyhood, Adolescence/Adulthood, and Senior Years)
                    and fall into 3 mouth mechanics: <strong>Murmurs</strong> (mouth closed), <strong>Vowels</strong> (mouth open then closing),
                    and <strong>High-Intensity Sounds</strong> (mouth wide open).
                  </p>
                </div>

                {/* CATS TAXONOMY */}
                <div className={`rounded-3xl p-6 border border-amber-500/30 ${cardBg} shadow-lg space-y-6`}>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl sm:text-4xl">🐱</div>
                      <div>
                        <h3 className="text-lg sm:text-2xl font-black text-amber-400">Cat Vocal Toolkit (100+ Sounds)</h3>
                        <p className="text-xs text-neutral-400">Categorized by Life Stages &amp; Mouth Mechanics</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                      Feline Bioacoustics
                    </span>
                  </div>

                  {/* Phase 1: Kittenhood */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <h4 className="font-bold text-sm sm:text-base text-amber-400">Phase 1: Kittenhood (Birth to 6 Months)</h4>
                      <span className="text-xs text-neutral-400">— Survival-vital, instinctual plea signals</span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PAWSCRIPT_ALPHABET.filter((c) => c.animal === 'Cat' && c.lifeStage === 'Kittenhood (0-6 Mo)').map((char) => (
                        <div key={char.id} className={`rounded-2xl p-4 border ${subCardBg} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{char.name.split('(')[0]}</span>
                              <span className="font-mono text-base text-amber-400 font-bold">{char.symbol}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-amber-500 mb-1.5">{char.mouthMechanic}</div>
                            <p className="text-xs text-neutral-400 mb-3">{char.meaning}</p>
                          </div>
                          <button
                            onClick={() => handlePlaySound(char)}
                            className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 size={13} /> Listen Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 2: Adolescence & Adulthood */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <h4 className="font-bold text-sm sm:text-base text-orange-400">Phase 2: Adolescence &amp; Adulthood (6 Months to 10+ Years)</h4>
                      <span className="text-xs text-neutral-400">— Tailored for human communication &amp; feline territory</span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PAWSCRIPT_ALPHABET.filter((c) => c.animal === 'Cat' && c.lifeStage === 'Adolescence & Adulthood').map((char) => (
                        <div key={char.id} className={`rounded-2xl p-4 border ${subCardBg} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{char.name.split('(')[0]}</span>
                              <span className="font-mono text-base text-orange-400 font-bold">{char.symbol}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-orange-400 mb-1.5">{char.mouthMechanic}</div>
                            <p className="text-xs text-neutral-400 mb-3">{char.meaning}</p>
                          </div>
                          <button
                            onClick={() => handlePlaySound(char)}
                            className="w-full py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 size={13} /> Listen Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 3: Senior Years */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h4 className="font-bold text-sm sm:text-base text-rose-400">Phase 3: Senior Years (11+ Years)</h4>
                      <span className="text-xs text-neutral-400">— Cognitive disorientation &amp; physical aging vocal changes</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PAWSCRIPT_ALPHABET.filter((c) => c.animal === 'Cat' && c.lifeStage.includes('Senior')).map((char) => (
                        <div key={char.id} className={`rounded-2xl p-4 border ${subCardBg} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{char.name.split('(')[0]}</span>
                              <span className="font-mono text-base text-rose-400 font-bold">{char.symbol}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-rose-400 mb-1.5">{char.mouthMechanic}</div>
                            <p className="text-xs text-neutral-400 mb-3">{char.meaning}</p>
                          </div>
                          <button
                            onClick={() => handlePlaySound(char)}
                            className="w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 size={13} /> Listen Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DOGS TAXONOMY */}
                <div className={`rounded-3xl p-6 border border-blue-500/30 ${cardBg} shadow-lg space-y-6`}>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl sm:text-4xl">🐶</div>
                      <div>
                        <h3 className="text-lg sm:text-2xl font-black text-blue-400">Dog Vocal Toolkit (Acoustic Mechanics)</h3>
                        <p className="text-xs text-neutral-400">Pitch Contours, Respiratory Duration, and Pack Harmonics</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                      Canine Bioacoustics
                    </span>
                  </div>

                  {/* Puppyhood */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <h4 className="font-bold text-sm sm:text-base text-blue-400">Puppyhood (0 to 6 Months)</h4>
                      <span className="text-xs text-neutral-400">— Whimpers, yelps &amp; playful pitch bursts</span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PAWSCRIPT_ALPHABET.filter((c) => c.animal === 'Dog' && c.lifeStage === 'Puppyhood (0-6 Mo)').map((char) => (
                        <div key={char.id} className={`rounded-2xl p-4 border ${subCardBg} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{char.name.split('(')[0]}</span>
                              <span className="font-mono text-base text-blue-400 font-bold">{char.symbol}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-blue-400 mb-1.5">{char.situation}</div>
                            <p className="text-xs text-neutral-400 mb-3">{char.meaning}</p>
                          </div>
                          <button
                            onClick={() => handlePlaySound(char)}
                            className="w-full py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 size={13} /> Listen Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adolescence & Adulthood */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <h4 className="font-bold text-sm sm:text-base text-indigo-400">Adolescence &amp; Adulthood (6 Months to 9+ Years)</h4>
                      <span className="text-xs text-neutral-400">— Pack distance, alert barking, low warning growls, and long howls</span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PAWSCRIPT_ALPHABET.filter((c) => c.animal === 'Dog' && c.lifeStage === 'Adolescence & Adulthood').map((char) => (
                        <div key={char.id} className={`rounded-2xl p-4 border ${subCardBg} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{char.name.split('(')[0]}</span>
                              <span className="font-mono text-base text-indigo-400 font-bold">{char.symbol}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-indigo-400 mb-1.5">{char.situation}</div>
                            <p className="text-xs text-neutral-400 mb-3">{char.meaning}</p>
                          </div>
                          <button
                            onClick={() => handlePlaySound(char)}
                            className="w-full py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 size={13} /> Listen Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Senior Years */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      <h4 className="font-bold text-sm sm:text-base text-teal-400">Senior Years (10+ Years)</h4>
                      <span className="text-xs text-neutral-400">— Twilight pacing howls &amp; stiffness sigh acoustics</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PAWSCRIPT_ALPHABET.filter((c) => c.animal === 'Dog' && c.lifeStage.includes('Senior')).map((char) => (
                        <div key={char.id} className={`rounded-2xl p-4 border ${subCardBg} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{char.name.split('(')[0]}</span>
                              <span className="font-mono text-base text-teal-400 font-bold">{char.symbol}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-teal-400 mb-1.5">{char.situation}</div>
                            <p className="text-xs text-neutral-400 mb-3">{char.meaning}</p>
                          </div>
                          <button
                            onClick={() => handlePlaySound(char)}
                            className="w-full py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 size={13} /> Listen Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 3. LIVE TRANSLATOR TAB ==================== */}
            {activeTab === 'translator' && (
              <motion.div
                key="translator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className={`rounded-3xl p-5 sm:p-6 border ${cardBg} shadow-lg space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                      <Languages className="text-amber-500" size={18} />
                      <span>Natural Speech → PawScript Bioacoustic Translation</span>
                    </h3>
                    <button
                      onClick={() => {
                        playTapTone();
                        setInputText('meow purr bark awoo');
                      }}
                      className="text-xs text-amber-500 hover:underline font-bold"
                    >
                      Load Sample
                    </button>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={3}
                    placeholder="Type human words, dog barks, or cat sounds (e.g. 'The puppy gives an alert bark and purrs')..."
                    className={`w-full p-3.5 rounded-2xl border ${subCardBg} focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm`}
                  />

                  {/* Output Translation Box */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Sparkles size={13} /> PawScript Glyph Stream
                      </span>
                      <button
                        onClick={() => {
                          playTapTone();
                          navigator.clipboard.writeText(translateToPawScript(inputText));
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                      </button>
                    </div>

                    <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 break-words py-2">
                      {translateToPawScript(inputText) || '—'}
                    </div>

                    <div className="text-xs text-neutral-400 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span>Reverse Interpretation: <strong className="text-neutral-200">{translateFromPawScript(translateToPawScript(inputText))}</strong></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 4. TYPING PAD TAB ==================== */}
            {activeTab === 'keyboard' && (
              <motion.div
                key="keyboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className={`rounded-3xl p-5 sm:p-6 border ${cardBg} shadow-lg space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                      <Keyboard className="text-amber-500" size={18} />
                      <span>Interactive PawScript Keyboard</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playTapTone();
                          setComposedText('');
                        }}
                        className="text-xs text-rose-400 hover:underline font-bold"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className={`min-h-[70px] p-3.5 rounded-2xl border ${subCardBg} font-mono text-2xl font-black text-amber-400 break-words flex items-center`}>
                    {composedText || <span className="text-xs font-sans text-neutral-500 font-normal">Tap keys below to compose in PawScript...</span>}
                  </div>

                  {/* Virtual Keyboard Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-2">
                    {PAWSCRIPT_ALPHABET.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setComposedText((prev) => prev + c.symbol + ' ');
                          handlePlaySound(c);
                        }}
                        className={`p-2.5 rounded-2xl border ${subCardBg} hover:border-amber-500/50 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90`}
                      >
                        <span className="font-mono text-lg font-black text-amber-400">{c.symbol}</span>
                        <span className="text-[10px] text-neutral-400 truncate max-w-[60px]">{c.sound}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </IPadFrame>
  );
}
