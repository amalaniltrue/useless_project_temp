'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Sparkles,
  Mic,
  Volume2,
  VolumeX,
  ExternalLink,
  MapPin,
  Globe,
  Share2,
  X,
  ArrowRight,
  Info,
  Check,
  Languages,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PAWSCRIPT_ALPHABET,
  translateToPawScript,
  translateFromPawScript,
} from '@/lib/pawscript';
import { playSound, playTapTone, playAppLaunchTone } from '@/lib/sounds';
import { IPadFrame } from '@/components/ui/IPadFrame';
import Link from 'next/link';

// ==========================================
// Types
// ==========================================

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  pawscriptSnippet: string;
  category: 'All' | 'PawScript' | 'Places' | 'Health' | 'Treats' | 'Images';
  source: 'google-web' | 'paw-knowledge' | 'wikipedia' | 'places-maps' | 'veterinary';
  speciesTarget?: string;
  rating?: number;
  badge?: string;
  soundCue?: string;
  audioSample?: string;
  imageUrl?: string;
  distance?: string;
  openStatus?: string;
  publishDate?: string;
}

export interface KnowledgePanelData {
  title: string;
  subtitle: string;
  species: string;
  description: string;
  imageUrl: string;
  audioSample?: string;
  soundTitle?: string;
  pawscriptGlyphs: string;
  ipaNotation?: string;
  attributes: Record<string, string>;
  quickFacts: string[];
  googleKnowledgeUrl: string;
}

export interface SearchApiResponse {
  originalQuery: string;
  englishQuery: string;
  isPawScript: boolean;
  pawScriptTranscription: string;
  googleUrl: string;
  googleImagesUrl: string;
  googleMapsUrl: string;
  stats: {
    totalResults: number;
    searchTimeMs: number;
    source: string;
  };
  knowledgePanel?: KnowledgePanelData;
  results: SearchResultItem[];
}

// Popular Trending Queries
const TRENDING_SEARCHES = [
  { text: 'Golden Retriever soft mouth', tag: 'Breed Guide' },
  { text: 'ᛗᛁᛁ', tag: 'PawScript: Kitten Mew' },
  { text: 'ᚱᚱᚱ', tag: 'PawScript: 25Hz Purr' },
  { text: 'Siberian Husky pack howling', tag: 'Acoustics' },
  { text: 'Are grapes toxic for dogs?', tag: 'Emergency' },
  { text: 'Off-leash swimming parks near me', tag: 'Places' },
  { text: 'Himalayan yak chew reviews', tag: 'Nutrition' },
];

export default function PawSearchPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'PawScript' | 'Places' | 'Health' | 'Treats' | 'Images'>('All');

  // Search Results & API State
  const [searchData, setSearchData] = useState<SearchApiResponse | null>(null);
  const [results, setResults] = useState<SearchResultItem[]>([]);

  // Interactive Tools
  const [showPawKeyboard, setShowPawKeyboard] = useState(false);
  const [keyboardCategory, setKeyboardCategory] = useState<'All' | 'Cat' | 'Dog'>('All');
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Audio preview
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Suggestions & Copy State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  // Local fallback search generator
  const fallbackSearch = useCallback((q: string) => {
    const isPaw = /[\u16A0-\u16FF]/.test(q);
    const eng = isPaw ? translateFromPawScript(q) : q;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(eng)}`;
    const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(eng)}`;
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(eng + ' pet care near me')}`;

    const fallbackResults: SearchResultItem[] = [
      {
        id: 'fb_1',
        title: `${eng} — Pet Knowledge & Google Web Search`,
        url: googleUrl,
        displayUrl: `google.com › search › ${encodeURIComponent(eng)}`,
        snippet: `Search Google directly for "${eng}". Connect to global animal ethology research, veterinary clinical papers, and verified companion guides.`,
        pawscriptSnippet: translateToPawScript(eng),
        category: 'All',
        source: 'google-web',
        rating: 4.9,
        badge: 'Google Web Link',
      },
      {
        id: 'fb_2',
        title: 'Central Whisker & Hound Ecological Park',
        url: googleMapsUrl,
        displayUrl: 'maps.google.com › places › whisker-hound-park',
        snippet: '40-acre pet paradise with agility obstacle courses, designated small dog & big dog meadows, and fenced feline sensory gardens.',
        pawscriptSnippet: translateToPawScript('Whisker Hound Park agility meadow'),
        category: 'Places',
        source: 'places-maps',
        rating: 4.9,
        distance: '0.8 km away',
        openStatus: 'Open 24 Hours • Well Lit',
        badge: 'Top Rated Park',
      },
      {
        id: 'fb_3',
        title: 'Feline & Canine Nutritional Standards (2026)',
        url: 'https://veterinarymedicine.vet/clinical-nutrition',
        displayUrl: 'veterinarymedicine.vet › clinical-nutrition',
        snippet: 'Peer-reviewed veterinary dietary index covering high-protein treats, bone broth hydration, and toxic pantry substances to avoid.',
        pawscriptSnippet: translateToPawScript('Nutrition guidelines for dogs and cats'),
        category: 'Health',
        source: 'veterinary',
        rating: 4.8,
        badge: 'Verified Vet',
      },
    ];

    setSearchData({
      originalQuery: q,
      englishQuery: eng,
      isPawScript: isPaw,
      pawScriptTranscription: translateToPawScript(q),
      googleUrl,
      googleImagesUrl,
      googleMapsUrl,
      stats: {
        totalResults: 4200,
        searchTimeMs: 120,
        source: 'Google & PawSearch Hybrid',
      },
      results: fallbackResults,
    });
    setResults(fallbackResults);
  }, []);

  // Perform Live Web & PawScript Search
  const executeSearch = useCallback(
    async (searchQuery: string, category: string = activeCategory) => {
      const q = searchQuery.trim();
      if (!q) return;

      playTapTone();
      setIsLoading(true);
      setHasSearched(true);
      setShowSuggestions(false);
      setShowPawKeyboard(false);

      try {
        const res = await fetch(
          `/api/pawsearch?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`
        );
        if (res.ok) {
          const data: SearchApiResponse = await res.json();
          setSearchData(data);
          setResults(data.results || []);
        } else {
          fallbackSearch(q);
        }
      } catch {
        fallbackSearch(q);
      } finally {
        setIsLoading(false);
      }
    },
    [activeCategory, fallbackSearch]
  );

  // Submit Handler
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(query, activeCategory);
  };

  // Category Tab Switch
  const handleCategoryChange = (cat: 'All' | 'PawScript' | 'Places' | 'Health' | 'Treats' | 'Images') => {
    playTapTone();
    setActiveCategory(cat);
    if (hasSearched) {
      executeSearch(query, cat);
    }
  };

  // Feeling Pawsome (Random Discovery)
  const handleFeelingPawsome = () => {
    playAppLaunchTone();
    const random = TRENDING_SEARCHES[Math.floor(Math.random() * TRENDING_SEARCHES.length)];
    setQuery(random.text);
    executeSearch(random.text, 'All');
  };

  // Animal voice audio simulation
  const simulateAnimalVoice = () => {
    setIsListening(true);
    setVoiceTranscript('🐾 Detecting acoustic frequency...');
    const sample = PAWSCRIPT_ALPHABET[1]; // Purr
    playSound(sample.audioParams, 'emphasized', 'medium');

    setTimeout(() => {
      const detected = 'Cat purr 25Hz';
      setQuery(detected);
      setIsListening(false);
      setVoiceTranscript('');
      executeSearch(detected, activeCategory);
    }, 1400);
  };

  // Voice Search (Browser Speech Recognition + Animal Sound Fallback)
  const handleVoiceSearch = () => {
    playTapTone();
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognitionClass =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        setVoiceTranscript('Listening... Speak now or make an animal sound...');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setQuery(spoken);
          setIsListening(false);
          setVoiceTranscript('');
          executeSearch(spoken, activeCategory);
        };

        recognition.onerror = () => {
          simulateAnimalVoice();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        simulateAnimalVoice();
        return;
      }
    }
    simulateAnimalVoice();
  };

  // Play Audio Track
  const toggleAudio = (sampleUrl?: string) => {
    if (!sampleUrl) return;

    if (playingAudioUrl === sampleUrl) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingAudioUrl(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    audioRef.current = new Audio(sampleUrl);
    audioRef.current.onended = () => setPlayingAudioUrl(null);
    audioRef.current.play().catch(() => {});
    setPlayingAudioUrl(sampleUrl);
  };

  // Copy Result URL
  const copyUrl = (id: string, url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2000);
    }
  };

  // Filtered PawScript Alphabet for Keypad
  const keypadChars = PAWSCRIPT_ALPHABET.filter((c) => {
    if (keyboardCategory === 'All') return true;
    return c.animal === keyboardCategory;
  });

  // Autocomplete suggestions
  const suggestions = [
    'golden retriever training & diet',
    'ᛗᛁᛁ (Kitten Mew distress signal)',
    'ᚱᚱᚱ (Feline Purr 25Hz healing frequency)',
    'siberian husky howling meaning',
    'toxic foods for dogs checklist',
    'emergency 24/7 veterinary clinic near me',
    'dog park with freshwater swimming pond',
    'himalayan yak chew nutrition comparison',
  ].filter((s) => s.toLowerCase().includes(query.toLowerCase().trim()) && query.trim().length > 1);

  // Close audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  return (
    <IPadFrame
      appName="PawSearch"
      appEmoji="🔍"
      appColor="from-cyan-400 via-teal-500 to-blue-600"
      rightActions={
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
          <span>paw://search.feline</span>
        </div>
      }
    >
      <div className="flex-1 flex flex-col overflow-y-auto select-none font-sans scrollbar-hide">
        {/* ============================================================ */}
        {/* 🔝 TOP HEADER BAR (WHEN SEARCHED) */}
        {/* ============================================================ */}
        {hasSearched && (
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-white/10 shadow-xs px-4 py-2.5">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-3 justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Logo / Home Button */}
                <button
                  onClick={() => {
                    playTapTone();
                    setHasSearched(false);
                    setQuery('');
                    setSearchData(null);
                  }}
                  className="flex items-center gap-1.5 text-lg font-black tracking-tight flex-shrink-0 cursor-pointer"
                  title="Back to PawSearch Home"
                >
                  <span className="text-amber-500 text-xl">🐾</span>
                  <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 bg-clip-text text-transparent">
                    PawSearch
                  </span>
                </button>

                {/* Compact Google-Style Search Input */}
                <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative">
                  <div className="flex items-center bg-gray-100 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700/80 focus-within:bg-white dark:focus-within:bg-neutral-700/90 border border-gray-300 dark:border-neutral-700 hover:border-amber-400 focus-within:border-amber-500 rounded-full px-4 py-1.5 shadow-xs transition-all">
                    <Search size={15} className="text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search in English or PawScript runes..."
                      className="w-full text-xs md:text-sm outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400 bg-transparent"
                    />

                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 mr-1"
                      >
                        <X size={14} />
                      </button>
                    )}

                    {/* Virtual PawScript Keypad Button */}
                    <button
                      type="button"
                      onClick={() => setShowPawKeyboard(!showPawKeyboard)}
                      className="p-1 px-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 rounded-md transition-colors mr-1 cursor-pointer"
                      title="Open PawScript Alphabet Keyboard"
                    >
                      🐾 Glyphs
                    </button>

                    {/* Voice Search Button */}
                    <button
                      type="button"
                      onClick={handleVoiceSearch}
                      className={`p-1.5 rounded-full transition-all ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-amber-500'
                      }`}
                      title="Voice Search"
                    >
                      <Mic size={15} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Direct Google Search Action Button */}
              <div className="flex items-center gap-2">
                <a
                  href={searchData?.googleUrl || `https://www.google.com/search?q=${encodeURIComponent(query || 'pets')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  title="Search this query on Google in a new tab"
                >
                  <span>🔍 Google</span>
                  <ExternalLink size={12} />
                </a>

                <Link
                  href="/pawos"
                  className="px-3 py-1.5 bg-amber-100 dark:bg-neutral-800 hover:bg-amber-200 dark:hover:bg-neutral-700 text-amber-900 dark:text-amber-300 rounded-full text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>🖥️ PawOS</span>
                </Link>
              </div>
            </div>

            {/* Navigation Category Tabs (Google Style) */}
            <div className="max-w-6xl mx-auto flex items-center gap-2 md:gap-4 mt-2 overflow-x-auto pb-0.5 text-xs font-semibold text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-neutral-800 pt-2">
              {[
                { id: 'All', label: '🌐 All Web & Google' },
                { id: 'PawScript', label: '🐾 PawScript Phonetics' },
                { id: 'Places', label: '📍 Parks & Near Me' },
                { id: 'Health', label: '🩺 Vets & Poison Guide' },
                { id: 'Treats', label: '🍖 Treats & Reviews' },
                { id: 'Images', label: '🖼️ Animal Images' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleCategoryChange(tab.id as 'All' | 'PawScript' | 'Places' | 'Health' | 'Treats' | 'Images')}
                  className={`pb-1 px-2 border-b-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'border-amber-500 text-amber-900 dark:text-amber-400 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>
        )}

        {/* ============================================================ */}
        {/* 🎹 VIRTUAL PAWSCRIPT KEYBOARD DRAWER */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showPawKeyboard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-50/95 dark:bg-neutral-900 border-b border-amber-200 dark:border-neutral-800 p-4 shadow-inner z-30"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Insert PawScript Glyphs:</span>
                    </span>
                    <div className="flex gap-1 text-[11px] font-semibold">
                      {(['All', 'Cat', 'Dog'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            playTapTone();
                            setKeyboardCategory(cat);
                          }}
                          className={`px-2 py-0.5 rounded-md ${
                            keyboardCategory === cat
                              ? 'bg-amber-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {cat === 'All' ? 'All' : cat === 'Cat' ? 'Cats 🐱' : 'Dogs 🐶'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPawKeyboard(false)}
                    className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline"
                  >
                    Done
                  </button>
                </div>

                {/* Grid of Keypad Runes */}
                <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {keypadChars.map((c) => (
                    <button
                      key={c.symbol}
                      onClick={() => {
                        setQuery((prev) => (prev ? `${prev} ${c.symbol}` : c.symbol));
                        playSound(c.audioParams, 'neutral', 'short');
                      }}
                      className="p-2 bg-white dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 hover:scale-105 border border-amber-200 dark:border-neutral-700 rounded-xl text-center shadow-xs transition-all cursor-pointer"
                      title={`${c.name} (${c.sound})`}
                    >
                      <div className="pawscript-text text-base font-black text-amber-900 dark:text-amber-300">{c.symbol}</div>
                      <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{c.sound}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Transcript Floating Banner */}
        {isListening && (
          <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800 p-2.5 text-center text-xs text-red-700 dark:text-red-300 font-semibold flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            <span>{voiceTranscript || 'Listening for speech or animal sounds...'}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* 🏠 MAIN LANDING VIEW (BEFORE SEARCH) */}
        {/* ============================================================ */}
        {!hasSearched ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl text-center"
            >
              {/* PawSearch Brand Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-6xl float-animation">🐾</span>
                <div className="text-left">
                  <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                    <span className="text-amber-500">Paw</span>
                    <span className="text-emerald-600">Search</span>
                  </h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    The Google for Animals &amp; Pet Guardians
                  </p>
                </div>
              </div>

              {/* Google-Style Big Search Bar */}
              <form onSubmit={handleSubmit} className="relative mb-5">
                <div className="flex items-center bg-white dark:bg-neutral-900 border-2 border-amber-200 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500 focus-within:border-amber-500 rounded-full px-5 py-3.5 shadow-lg shadow-amber-500/5 transition-all">
                  <Search size={22} className="text-amber-500 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search in English (e.g. 'golden retriever') or PawScript (e.g. 'ᛗᛁᛁ')..."
                    className="w-full text-base outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400 bg-transparent"
                    autoFocus
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2"
                    >
                      <X size={16} />
                    </button>
                  )}

                  <div className="flex items-center gap-2 pl-2">
                    <button
                      type="button"
                      onClick={() => setShowPawKeyboard(!showPawKeyboard)}
                      className="p-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                      title="Open PawScript Keypad"
                    >
                      🐾 Glyphs
                    </button>

                    <button
                      type="button"
                      onClick={handleVoiceSearch}
                      className={`p-2.5 rounded-full transition-all cursor-pointer ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-amber-600'
                      }`}
                      title="Animal Voice Search"
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 text-left overflow-hidden z-20">
                    {suggestions.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          setQuery(s);
                          setShowSuggestions(false);
                          executeSearch(s, 'All');
                        }}
                        className="px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-neutral-800 text-xs md:text-sm text-gray-700 dark:text-gray-200 cursor-pointer flex items-center gap-2 border-b border-gray-50 dark:border-neutral-800 last:border-0"
                      >
                        <Search size={14} className="text-gray-400" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </form>

              {/* Live PawScript Realtime Indicator */}
              {query.trim() && (
                <div className="mb-4 bg-amber-50/80 dark:bg-neutral-900 p-2.5 rounded-xl border border-amber-200 dark:border-neutral-800 text-xs text-amber-950 dark:text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Languages size={14} className="text-amber-600 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400">PawScript Translation:</span>
                    <span className="pawscript-text font-bold truncate">
                      {translateToPawScript(query)}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-md border border-amber-200 dark:border-neutral-700 flex-shrink-0">
                    Auto-Phonetics
                  </span>
                </div>
              )}

              {/* Google-Style Action Buttons */}
              <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
                <button
                  type="button"
                  onClick={() => executeSearch(query, activeCategory)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  PawSearch
                </button>

                <button
                  type="button"
                  onClick={handleFeelingPawsome}
                  className="bg-white dark:bg-neutral-800 hover:bg-amber-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200 font-bold px-6 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-xs transition-all hover:scale-105 cursor-pointer"
                >
                  I&apos;m Feeling Pawsome ✨
                </button>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(query || 'cats and dogs')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold px-5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔍 Search on Google</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Trending Animal Topics */}
              <div className="text-left bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-amber-100 dark:border-neutral-800 rounded-3xl p-5 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Trending Searches Today</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((item) => (
                    <button
                      key={item.text}
                      onClick={() => {
                        setQuery(item.text);
                        executeSearch(item.text, 'All');
                      }}
                      className="text-xs bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-full border border-amber-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🔍 {item.text}</span>
                      <span className="text-[10px] bg-white dark:bg-neutral-900 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded-md font-semibold">
                        {item.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Offered Bar */}
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 flex-wrap">
                <span>PawSearch offered in:</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">English</span>
                <span>•</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold pawscript-text">ᛈᚪᚹᛊᚲᚱᛁᛈᛏ (PawScript)</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Feline Purrs 🐱</span>
                <span>•</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold">Canine Barks 🐕</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ============================================================ */
          /* 📄 GOOGLE-STYLE SEARCH RESULTS VIEW */
          /* ============================================================ */
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-5">
            {/* PawScript Translation Banner */}
            {searchData?.isPawScript && (
              <div className="mb-4 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 dark:from-neutral-900 dark:via-neutral-850 dark:to-neutral-900 p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-600/40 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300 mb-1">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>PawScript Language Translation Active</span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      <span>Input in PawScript: </span>
                      <strong className="pawscript-text text-amber-900 dark:text-amber-300 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-md border border-amber-200 dark:border-neutral-700 font-bold">
                        {searchData.originalQuery}
                      </strong>
                      <span className="mx-2">➔</span>
                      <span>Translated to English for Google/Web: </span>
                      <strong className="text-blue-700 dark:text-blue-400 font-black underline">
                        &ldquo;{searchData.englishQuery}&rdquo;
                      </strong>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Query phonetically parsed. Live web results and Google index queried in English.
                    </p>
                  </div>

                  {/* Direct Google Link for Translated Query */}
                  <a
                    href={searchData.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs flex-shrink-0 transition-colors"
                  >
                    <span>Google Results ↗</span>
                  </a>
                </div>
              </div>
            )}

            {/* Results Stats Bar */}
            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-2">
              <span>
                About {searchData?.stats?.totalResults?.toLocaleString() || '1,420'} results (
                {((searchData?.stats?.searchTimeMs || 150) / 1000).toFixed(2)} seconds)
              </span>
              <span className="text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1">
                <span>PawScript Engine:</span>
                <span className="pawscript-text font-bold">
                  {searchData?.pawScriptTranscription || translateToPawScript(query)}
                </span>
              </span>
            </div>

            {/* Main Two-Column Grid (Results Left + Knowledge Graph Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ============================================================ */}
              {/* 📰 LEFT COLUMN: SEARCH RESULTS LIST (2 COLS WIDE) */}
              {/* ============================================================ */}
              <div className="lg:col-span-2 space-y-4">
                {isLoading ? (
                  /* Skeleton Loader */
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xs animate-pulse space-y-2">
                        <div className="h-3 w-48 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                        <div className="h-5 w-3/4 bg-gray-300 dark:bg-neutral-700 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  results.map((item, idx) => (
                    <motion.article
                      key={`${item.id}_${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all group"
                    >
                      {/* URL Breadcrumb & Badge */}
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-gray-400 font-mono truncate">{item.displayUrl}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full flex-shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.distance && (
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <MapPin size={11} />
                              <span>{item.distance}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Result Title (Google Blue) */}
                      <h2 className="text-base md:text-lg font-bold text-blue-700 dark:text-blue-400 group-hover:underline cursor-pointer mb-1.5 flex items-center justify-between">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          {item.title}
                        </a>
                        <ExternalLink size={15} className="text-gray-300 group-hover:text-blue-600 flex-shrink-0 ml-2" />
                      </h2>

                      {/* Text Snippet */}
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        {item.snippet}
                      </p>

                      {/* PawScript Audio & Phonetic Subtitle */}
                      <div className="bg-amber-50/70 dark:bg-neutral-800/70 rounded-xl p-3 border border-amber-200/70 dark:border-neutral-700 mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 tracking-wider mb-0.5">
                            PawScript Phonetic Transcription:
                          </div>
                          <div className="pawscript-text text-xs md:text-sm font-bold text-amber-950 dark:text-amber-200">
                            {item.pawscriptSnippet}
                          </div>
                        </div>

                        {/* Play Audio Button */}
                        {item.audioSample && (
                          <button
                            onClick={() => toggleAudio(item.audioSample)}
                            className="flex-shrink-0 px-2.5 py-1.5 bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-950 dark:text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Listen to authentic vocal track"
                          >
                            {playingAudioUrl === item.audioSample ? (
                              <>
                                <VolumeX size={13} className="text-rose-600 animate-pulse" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={13} className="text-amber-800 dark:text-amber-300" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Action Bar Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-neutral-800 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          {item.rating && (
                            <span className="font-bold text-amber-600 flex items-center gap-1">
                              ⭐ {item.rating}
                            </span>
                          )}
                          {item.openStatus && (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{item.openStatus}</span>
                          )}
                          {item.publishDate && <span>{item.publishDate}</span>}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Copy Link */}
                          <button
                            onClick={() => copyUrl(item.id, item.url)}
                            className="hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy Link"
                          >
                            {copiedUrlId === item.id ? (
                              <>
                                <Check size={12} className="text-emerald-600" />
                                <span className="text-emerald-600 font-bold text-[11px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Share2 size={12} />
                                <span className="text-[11px]">Share</span>
                              </>
                            )}
                          </button>

                          {/* Search on Google */}
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(item.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <span>Google it</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  /* Empty Results */
                  <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800">
                    <div className="text-6xl mb-3">🦴</div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No local results found for &ldquo;{query}&rdquo;</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                      Would you like to search directly on Google for live web results?
                    </p>
                    <a
                      href={searchData?.googleUrl || `https://www.google.com/search?q=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                    >
                      <span>Search &ldquo;{query}&rdquo; on Google ↗</span>
                    </a>
                  </div>
                )}

                {/* Bottom Google-Style Page Links */}
                {results.length > 0 && (
                  <div className="pt-8 pb-4 text-center">
                    <div className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
                      <span className="text-blue-600">P</span>
                      <span className="text-rose-500">a</span>
                      <span className="text-amber-500">a</span>
                      <span className="text-blue-600">w</span>
                      <span className="text-emerald-500">S</span>
                      <span className="text-rose-500">e</span>
                      <span className="text-blue-600">a</span>
                      <span className="text-amber-500">r</span>
                      <span className="text-emerald-600">c</span>
                      <span className="text-blue-600">h</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 rounded-lg text-blue-900 dark:text-blue-300">1</span>
                      <button onClick={() => executeSearch(query, activeCategory)} className="px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer">2</button>
                      <button onClick={() => executeSearch(query, activeCategory)} className="px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer">3</button>
                      <a
                        href={searchData?.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-amber-100 dark:bg-neutral-800 hover:bg-amber-200 text-amber-900 dark:text-amber-300 rounded-lg flex items-center gap-1"
                      >
                        <span>More on Google</span>
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* 👑 RIGHT COLUMN: GOOGLE KNOWLEDGE PANEL GRAPH */}
              {/* ============================================================ */}
              <div className="space-y-4">
                {searchData?.knowledgePanel ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200/90 dark:border-neutral-800 shadow-md p-5 space-y-4 sticky top-28">
                    {/* Photo with species tag */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={searchData.knowledgePanel.imageUrl}
                        alt={searchData.knowledgePanel.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        {searchData.knowledgePanel.species}
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">
                        {searchData.knowledgePanel.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {searchData.knowledgePanel.subtitle}
                      </p>
                    </div>

                    {/* Authentic Audio Player */}
                    {searchData.knowledgePanel.audioSample && (
                      <div className="bg-amber-50 dark:bg-neutral-800 p-3 rounded-2xl border border-amber-200 dark:border-neutral-700 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-amber-950 dark:text-amber-200">
                            {searchData.knowledgePanel.soundTitle || 'Authentic Vocal Sample'}
                          </div>
                          <div className="text-[10px] text-amber-700 dark:text-amber-400">Real Biological Animal Recording</div>
                        </div>

                        <button
                          onClick={() => toggleAudio(searchData.knowledgePanel?.audioSample)}
                          className="px-3 py-1.5 bg-black hover:bg-gray-900 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          {playingAudioUrl === searchData.knowledgePanel.audioSample ? (
                            <>
                              <VolumeX size={13} className="text-rose-400 animate-pulse" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={13} className="text-amber-400" />
                              <span>Play Vocal</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {searchData.knowledgePanel.description}
                    </p>

                    {/* PawScript Glyph Card */}
                    <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-xs">
                      <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-200 mb-1">
                        <span>PawScript Glyphs:</span>
                        <span className="pawscript-text text-base font-black text-purple-950 dark:text-purple-100">
                          {searchData.knowledgePanel.pawscriptGlyphs}
                        </span>
                      </div>
                      {searchData.knowledgePanel.ipaNotation && (
                        <div className="text-[11px] text-purple-700 dark:text-purple-300">
                          Phonetic IPA: <code className="font-mono">{searchData.knowledgePanel.ipaNotation}</code>
                        </div>
                      )}
                    </div>

                    {/* Attributes Table */}
                    {searchData.knowledgePanel.attributes && (
                      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 space-y-1.5 text-xs">
                        {Object.entries(searchData.knowledgePanel.attributes).map(([key, val]) => (
                          <div key={key} className="flex justify-between py-1 border-b border-gray-50 dark:border-neutral-800 last:border-0">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">{key}:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200 text-right max-w-[60%] truncate">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Facts */}
                    {searchData.knowledgePanel.quickFacts?.length > 0 && (
                      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3">
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                          <Info size={13} className="text-amber-500" />
                          <span>Key Ethology Facts:</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-1">
                          {searchData.knowledgePanel.quickFacts.map((fact, i) => (
                            <li key={i}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* View on Google Knowledge Graph Link */}
                    <div className="border-t border-gray-100 dark:border-neutral-800 pt-3">
                      <a
                        href={searchData.knowledgePanel.googleKnowledgeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Google Knowledge Graph ↗</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Generic Search Companion Card */
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800 p-5 space-y-3 sticky top-28 text-xs">
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
                      <Globe size={16} className="text-blue-600" />
                      <span>Google &amp; Web Integration</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      PawSearch connects to live web sources and translates animal phonetics using PawScript.
                    </p>

                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
                      <a
                        href={searchData?.googleUrl || `https://www.google.com/search?q=${encodeURIComponent(query)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Search on Google ↗</span>
                      </a>
                      <a
                        href={searchData?.googleImagesUrl || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Google Images ↗</span>
                      </a>
                      <a
                        href={searchData?.googleMapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(query + ' pet near me')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Google Maps (Nearby) ↗</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* ============================================================ */}
        {/* 🐾 FOOTER */}
        {/* ============================================================ */}
        <footer className="bg-white/50 dark:bg-neutral-900/50 border-t border-gray-200 dark:border-neutral-800 py-4 px-6 text-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <span>🐾 PawSearch Engine</span>
              <span>•</span>
              <span>Google &amp; Web Hybrid</span>
              <span>•</span>
              <span>PawScript Neural Phonetics</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Link href="/pawscript" className="hover:text-gray-700 dark:hover:text-gray-200">Bioacoustics</Link>
              <Link href="/pawmatch" className="hover:text-gray-700 dark:hover:text-gray-200">PawMatch</Link>
              <Link href="/pawchat" className="hover:text-gray-700 dark:hover:text-gray-200">PawChat</Link>
              <Link href="/pawos" className="hover:text-gray-700 dark:hover:text-gray-200">PawOS</Link>
            </div>
          </div>
        </footer>
      </div>
    </IPadFrame>
  );
}
