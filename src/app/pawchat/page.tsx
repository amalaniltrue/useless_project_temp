'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Send,
  ArrowLeft,
  Keyboard,
  Check,
  CheckCheck,
  Smile,
  Cpu,
  RefreshCw,
  Copy,
  Info,
  X,
  Sparkles,
  Wand2,
  ShieldCheck,
  User,
  LogOut,
  Edit2,
  Mail,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IPadFrame } from '@/components/ui/IPadFrame';
import {
  PAWSCRIPT_ALPHABET,
  translateToPawScript,
  getCharactersByAnimal,
} from '@/lib/pawscript';
import {
  playSound,
  playPhoneRing,
  playCallConnectedTone,
  playCallEndTone,
  playTapTone,
} from '@/lib/sounds';
import {
  generatePawLLMReply,
  getPawLLMSpecs,
  PawLLMReply,
  generatePawLLMHelperSuggestion,
} from '@/lib/pawllm';

// ==========================================
// Types
// ==========================================

export interface UserProfile {
  authType?: 'phone' | 'email';
  email?: string;
  phone?: string;
  countryCode?: string;
  nationalNumber?: string;
  name: string;
  avatar: string;
  about: string;
  registeredAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  species: 'Cat' | 'Dog' | 'AI Assistant';
  gender: 'Male' | 'Female' | 'AI';
  emoji: string;
  gradient: string;
  online: boolean;
  lastSeen: string;
  avatarUrl?: string;
  tagline: string;
  about: string;
  isAiHelper?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
  type: 'text' | 'pawscript' | 'voice';
  pawscript?: string;
  ipa?: string;
  emotion?: string;
  audioCue?: string;
  modelUsed?: string;
  latencyMs?: number;
}

export interface ActiveCall {
  contact: Contact;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected';
  duration: number;
}

// ==========================================
// Contact Roster (Strictly Given Names + Single AI Helper)
// ==========================================

export const CONTACTS: Contact[] = [
  // 1. Pinned Dedicated AI Copilot / Message Helper
  {
    id: 'pawllm-helper',
    name: 'PawLLM Helper ✨',
    phone: '+00 1-800-PAW-LLM',
    species: 'AI Assistant',
    gender: 'AI',
    emoji: '🧠',
    gradient: 'from-emerald-500 to-teal-600',
    online: true,
    lastSeen: 'Always online',
    tagline: 'Built-in Bio-Acoustic Message Helper & Tutor',
    about: '✨ Your 24/7 AI message assistant. Tap to translate, polish messages, or learn elder runes!',
    isAiHelper: true,
  },

  // 2. Cats (Strictly User Chosen)
  {
    id: '1',
    name: 'Ramesh',
    phone: '+91 98450 71829',
    species: 'Cat',
    gender: 'Male',
    emoji: '🐱',
    gradient: 'from-amber-400 to-orange-500',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/cat/cat-taking-a-selfie.webp',
    tagline: 'Selfie King Persian in the sunbeam',
    about: 'Basking on velvet pillows. Only gourmet salmon pâté accepted 🐾',
  },
  {
    id: '7',
    name: 'Microwave',
    phone: '+91 98231 44012',
    species: 'Cat',
    gender: 'Male',
    emoji: '🐱',
    gradient: 'from-orange-400 to-amber-600',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/cat/COaEeSIpWQW-png__700.webp',
    tagline: 'Cardboard box spinning champion & 3 AM zoomies',
    about: 'Running at 800 RPM. One orange brain cell operating at maximum joy 📦⚡',
  },
  {
    id: '8',
    name: 'Asbestos',
    phone: '+44 7700 900142',
    species: 'Cat',
    gender: 'Male',
    emoji: '🐈',
    gradient: 'from-slate-400 to-zinc-600',
    online: false,
    lastSeen: 'last seen today at 2:15 PM',
    avatarUrl: '/pictures/cat/random-weird-cat-pics-68999d4c7cf5a__700.webp',
    tagline: 'Motionless sentinel on top of refrigerator',
    about: 'Motionless for 6 hours. Observing cosmic dust in stoic silence.',
  },
  {
    id: '3',
    name: 'Kalyani',
    phone: '+91 94471 22980',
    species: 'Cat',
    gender: 'Female',
    emoji: '🐈',
    gradient: 'from-rose-400 to-pink-600',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/cat/naughty.webp',
    tagline: 'Acrobat auntie verifying gravity',
    about: 'Jump height: 2.1 meters. Water cups on table edges will be tested.',
  },
  {
    id: '4',
    name: 'Emotional Damage',
    phone: '+1 555-019-8833',
    species: 'Cat',
    gender: 'Female',
    emoji: '😿',
    gradient: 'from-purple-400 to-indigo-600',
    online: false,
    lastSeen: 'last seen 10m ago',
    avatarUrl: '/pictures/cat/portrait-of-a-scared-cat.webp',
    tagline: 'Overwhelmed Scottish fold judging you silently',
    about: 'Judging your life choices from under the bed. Mild panic at loud noises.',
  },
  {
    id: '9',
    name: 'Lady Dimitrescu',
    phone: '+40 21 555 0199',
    species: 'Cat',
    gender: 'Female',
    emoji: '🦁',
    gradient: 'from-purple-500 to-indigo-800',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/cat/CWbUskSKeMT-png__700.webp',
    tagline: '12kg Maine Coon Empress claiming the king bed',
    about: 'Massive floof empress. Requires salmon treats served on silver saucers 👑',
  },

  // 3. Dogs (Strictly User Given)
  {
    id: '2',
    name: 'Benjamin',
    phone: '+1 555-014-3829',
    species: 'Dog',
    gender: 'Male',
    emoji: '🐶',
    gradient: 'from-yellow-400 to-amber-500',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp',
    tagline: 'Golden Retriever scholar researching ball trajectory',
    about: 'Hold a PhD in treat retrieval. Spectacles worn with dignity 🎾🎓',
  },
  {
    id: '5',
    name: 'Samsung',
    phone: '+82 2 555 0142',
    species: 'Dog',
    gender: 'Male',
    emoji: '🐕',
    gradient: 'from-blue-500 to-indigo-600',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/dog/springer.webp',
    tagline: 'Springer Spaniel Scout running perimeter checks',
    about: '100% focused tracker. Ears flopping in wind, investigating every scent.',
  },
  {
    id: '6',
    name: 'Missile',
    phone: '+1 555-018-7744',
    species: 'Dog',
    gender: 'Male',
    emoji: '🐶',
    gradient: 'from-orange-500 to-red-600',
    online: false,
    lastSeen: 'last seen yesterday at 8:40 PM',
    avatarUrl: '/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp',
    tagline: 'Heat-seeking Frenchie sofa rocket',
    about: 'Bowtie on. Launching into sofa cuddle orbit in 3... 2... 1... 🚀',
  },
  {
    id: '10',
    name: 'Shantha',
    phone: '+91 98860 33411',
    species: 'Dog',
    gender: 'Female',
    emoji: '🐕',
    gradient: 'from-amber-300 to-yellow-500',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/dog/funny-dog-pics-19-10-24-2024.webp',
    tagline: 'Gentle golden therapy pup',
    about: 'Resting my chin on your knee. You are loved, remember to take care 💛',
  },
  {
    id: '11',
    name: 'Bombastic Lady',
    phone: '+1 555-017-6623',
    species: 'Dog',
    gender: 'Female',
    emoji: '🐩',
    gradient: 'from-pink-500 to-rose-600',
    online: true,
    lastSeen: 'online',
    avatarUrl: '/pictures/dog/funny-dog-picture-jr72rp2jqjo57wxv.webp',
    tagline: 'Glamour Poodle Diva on the sidewalk runway',
    about: 'Sidewalk is my runway, darling! Fresh curls, maximum glamour 🐩💅',
  },
  {
    id: '12',
    name: 'Big Mom',
    phone: '+41 79 555 1234',
    species: 'Dog',
    gender: 'Female',
    emoji: '🐶',
    gradient: 'from-stone-500 to-neutral-700',
    online: false,
    lastSeen: 'last seen today at 11:15 AM',
    avatarUrl: '/pictures/dog/funny-dumb-pictures-f0sbo1li5pvc91oj.webp',
    tagline: '90kg gentle giant matriarch giving bear hugs',
    about: 'Giant cuddly bear hugs for everyone! Drool is a sign of pure love 🐾❤️',
  },
];

// Contextual One-Tap Prompt Suggestions
export const CONTACT_PROMPT_SUGGESTIONS: Record<string, string[]> = {
  'pawllm-helper': ['✨ What is best to order?', '🐾 Translate "best friends" to runes', '🩺 Emergency poison guide'],
  '1': ['🐟 What is best to order?', '☀️ Where is the morning sunbeam?', '📸 Take a royal selfie'],
  '2': ['🦴 Recommend best treats to order', '🎾 Tell me your ball thesis', '🏊 Ready for lake swim?'],
  '3': ['🐟 Order best airborne treats', '🥛 Don\'t tap that water glass!', '🧗 How high did you jump?'],
  '4': ['🐟 Where is your dinner order?', '🦿 Vacuum monster is gone', '🐾 Can I give chin scratches?'],
  '5': ['🥓 What snacks to order on patrol?', '🐕 Perimeter check status', '🌳 Ready for outdoor park walk?'],
  '6': ['🍗 What snacks should I order?', '🚀 Launch the sofa rocket!', '💤 Ready for couch cuddles?'],
  '7': ['📦 What treats should I order?', '⚡ 3 AM zoomies status', '📦 Spinning in the cardboard box'],
  '8': ['🍗 Best gourmet order for you', '🧊 Refrigerator summit status', '🧘 Explain the cosmic dust'],
  '9': ['🐟 Royal feast recommendations', '👑 King bed sovereignty report', '✨ Groom the magnificent mane'],
  '10': ['🍪 Order soothing bone broth treats', '💛 Rest your chin on my knee', '🐕 Ready for gentle park walk?'],
  '11': ['💅 Order organic duck tenders', '🐩 Sidewalk runway show', '✨ How are the salon curls?'],
  '12': ['🥩 Order giant marrow bone', '🐾 Give me a 90kg bear hug', '🎾 Bring the slobbery rope toy'],
};

// ==========================================
// Pre-populated Dynamic Conversations
// ==========================================

const INITIAL_CONVERSATIONS: Record<string, ChatMessage[]> = {
  'pawllm-helper': [
    {
      id: 'h1',
      senderId: 'pawllm-helper',
      text: '✨ Hello human friend! I am PawLLM Helper, your dedicated pet translation copilot. Tap the chips below or type anything to order pet treats, translate phrases into ancient Elder runes, or get veterinary advice!',
      pawscript: '✨ ᛗᛖᐱ! ᛁ ᚪᛗ ᛈᚪᚹᛚᛚᛗ ᚺᛖᛚᛈᛖᚱ. ᚪᛋᚳ ᛗᛖ ᛏᚩ ᛏᚱᚪᚾᛋᛚᚪᛏᛖ ᚩᚱ ᛞᚱᚪᚠᛏ ᛗᛖᛋᛋᚪᚷᛖᛋ!',
      ipa: '[pɔː.ɛl.ɛl.ɛm] • AI Copilot Active',
      emotion: 'AI Message Assistance',
      time: '10:00 AM',
      read: true,
      type: 'text',
      modelUsed: 'PawLLM-BioAcoustic 1.2B',
    },
  ],
  '1': [
    {
      id: 'm1_1',
      senderId: '1',
      text: 'meow! The morning sunbeam is arriving on the velvet couch. Did you bring fresh wild salmon pâté? meo purr!',
      pawscript: 'ᛗᛖᐱ! ᚦᛖ ᛗᚩᚱᚾᛁᛝ ᛋᚢᚾᛒᛖᚪᛗ ᛁᛋ ᚪᚱᚱᛁᚡᛁᛝ ᚩᚾ ᚦᛖ ᚡᛖᛚᚡᛖᛏ ᚳᚩᚢᚳᚺ! ᛗᛖᚩ ᚱᚱᚱ!',
      ipa: '[mʲe.oʊ̯] • Aristocratic Purr',
      emotion: 'Aristocratic Purr',
      audioCue: '/sounds/animals/cat/cat_purr.mp3',
      time: '10:30 AM',
      read: true,
      type: 'text',
    },
  ],
  '2': [
    {
      id: 'm2_1',
      senderId: '2',
      text: 'BARK BARK! Human colleague! I have formulated a groundbreaking scientific thesis on the aerodynamic velocity of rubber balls! woof!',
      pawscript: 'ᛒᐱᚢ ᛒᐱᚢ! ᚺᚢᗡᚪᚾ, ᛁ ᚺᚪᚡᛖ ᚠᚩᚱᛗᚢᛚᚪᛏᛖᛞ ᚪ ᚷᚱᚩᚢᚾᛞᛒᚱᛖᚪᚳᛁᛝ ᚦᛖᛋᛁᛋ ᚩᚾ ᚦᛖ ᚡᛖᛚᚩᚳᛁᛏᛁ ᚩᚠ ᚱᚢᛒᛒᛖᚱ ᛒᚪᛚᛚᛋ! ᚹᚢᚠ!',
      ipa: '[bɑːrk] • Academic Enthusiasm',
      emotion: 'Scholarly Joy',
      audioCue: '/sounds/animals/dog/dog_bark_play.mp3',
      time: '9:00 AM',
      read: true,
      type: 'text',
    },
  ],
  '3': [
    {
      id: 'm3_1',
      senderId: '3',
      text: 'chirp meo! Refrigerator summit achieved at 2.1 meters! Water glass on the dining counter is looking dangerously tempting, meo!',
      pawscript: 'ᛏᛊᛁᚱᛈ ᛗᛖᚩ! ᚱᛖᚠᚱᛁᚷᛖᚱᚪᛏᚩᚱ ᛊᚢᛗᛗᛁᛏ ᚪᛏᛊᚺᛁᛁᚡᛖᛞ, ᛗᛖᚩ!',
      ipa: '[tʃɪɹp] • High Acrobat',
      emotion: 'Acrobat Joy',
      audioCue: '/sounds/animals/cat/cat_trill_sweet.wav',
      time: '11:15 AM',
      read: true,
      type: 'text',
    },
  ],
  '6': [
    {
      id: 'm6_1',
      senderId: '6',
      text: 'snort bow! Heat-seeking sofa rocket armed! Looking for a warm lap to crash land into immediately, bow bow!',
      pawscript: 'ᛊᚾᚩᚱᛏ ᛒᚪᚢ! ᚺᛁᛁᛏ ᛊᛁᛁᚲᛁᛝ ᛊᚩᚠᚪ ᚱᚩᚲᛖᛏ ᚪᚱᛗᛖᛞ, ᛒᚪᚢ!',
      ipa: '[pænt] • Couch Rocket',
      emotion: 'Couch Rocket',
      audioCue: '/sounds/animals/dog/dog_pant_active.mp3',
      time: '11:45 AM',
      read: true,
      type: 'text',
    },
  ],
  '7': [
    {
      id: 'm7_1',
      senderId: '7',
      text: 'meo meo! Delivery box claimed! Currently spinning at 800 RPM in the cardboard box! One orange brain cell operating at maximum joy! purr meo!',
      pawscript: 'ᛗᛖᚩ ᛗᛖᚩ! ᛞᛖᛚᛁᚡᛖᚱᛁ ᛒᚩᚲᛊ ᚲᛚᚪᛁᛗᛖᛞ! ᚱᚱᚱ ᛗᛖᚩ!',
      ipa: '[tʃɪɹp] • Box Spin',
      emotion: 'Box Spin 800RPM',
      audioCue: '/sounds/animals/cat/cat_meow_continuous.mp3',
      time: '12:00 PM',
      read: true,
      type: 'text',
    },
  ],
  '8': [
    {
      id: 'm8_1',
      senderId: '8',
      text: 'purr... perched on the refrigerator summit for 6 hours. cosmic dust particles observed in absolute stoic silence. meo.',
      pawscript: 'ᚱᚱᚱ... ᛈᛖᚱᛏᛊᚺᛖᛞ ᚩᚾ ᚱᛖᚠᚱᛁᚷᛖᚱᚪᛏᚩᚱ ᛊᚢᛗᛗᛁᛏ. ᛗᛖᚩ.',
      ipa: '[r̥ːːː] • Stoic Zen',
      emotion: 'Stoic Zen',
      audioCue: '/sounds/animals/cat/cat_purr.mp3',
      time: '12:15 PM',
      read: true,
      type: 'text',
    },
  ],
  '10': [
    {
      id: 'm10_1',
      senderId: '10',
      text: 'bow... resting my warm chin on your knee. you have worked hard today, remember you are loved. bow purr.',
      pawscript: 'ᛒᚪᚢ... ᚱᛖᛋᛏᛁᛝ ᛗᚪᛁ ᚹᚪᚱᛗ ᛏᛊᛁᚾ ᚩᚾ ᛁᚩᚢᚱ ᚾᛁᛁ. ᛒᚪᚢ ᚱᚱᚱ.',
      ipa: '[wʊf] • Therapy Chin',
      emotion: 'Therapy Chin',
      audioCue: '/sounds/animals/dog/dog_bark_greeting.mp3',
      time: '1:00 PM',
      read: true,
      type: 'text',
    },
  ],
  '11': [
    {
      id: 'm11_1',
      senderId: '11',
      text: 'bow bow darling! salon curls freshly fluffed, sidewalk runway ready! only gourmet organic duck tenders for the queen, bow!',
      pawscript: 'ᛒᚪᚢ ᛒᚪᚢ ᛞᚪᚱᛚᛁᛝ! ᛊᚪᛚᚩᚾ ᚲᚢᚱᛚᛋ ᚠᛚᚢᚠᚠᛖᛞ, ᛒᚪᚢ!',
      ipa: '[bɑːrk] • Glamour Diva',
      emotion: 'Runway Diva',
      audioCue: '/sounds/animals/dog/dog_pant_active.mp3',
      time: '1:30 PM',
      read: true,
      type: 'text',
    },
  ],
  '12': [
    {
      id: 'm12_1',
      senderId: '12',
      text: 'woof bow! 90kg gentle bear hugs ready! brought you my favorite slobbery rope toy, bow bow!',
      pawscript: 'ᚹᚢᚠ ᛒᚪᚢ! ᚾᚪᛁᚾᛏᛁ ᚲᚷ ᛒᛖᚪᚱ ᚺᚢᚷᛋ ᚱᛁᛁᛞᛁ! ᛒᚪᚢ ᛒᚪᚢ!',
      ipa: '[wʊf] • 90kg Bear Hug',
      emotion: '90kg Bear Hug',
      audioCue: '/sounds/animals/dog/dog_pant_breath.mp3',
      time: '2:00 PM',
      read: true,
      type: 'text',
    },
  ],
};

// ==========================================
// Virtual PawScript Keyboard Drawer
// ==========================================

function PawScriptKeyboardDrawer({
  onSelect,
  onClose,
}: {
  onSelect: (symbol: string) => void;
  onClose: () => void;
}) {
  const categories = [
    {
      title: 'Vocalizations & Resonances',
      symbols: ['ᛗ', 'ᛁ', 'ᐱ', 'ᚱ', 'ᚳ', 'ᛋ', 'ᛒ', 'ᚹ', 'ᚪ', 'ᛝ'],
    },
    {
      title: 'Elder Vowels',
      symbols: ['ᚪ', 'ᛖ', 'ᛁ', 'ᚩ', 'ᚢ', 'ᚣ'],
    },
    {
      title: 'Elder Consonants',
      symbols: ['ᛒ', 'ᚳ', 'ᛞ', 'ᚠ', 'ᚷ', 'ᚺ', 'ᛚ', 'ᛗ', 'ᚾ', 'ᛈ', 'ᚱ', 'ᛋ', 'ᛏ', 'ᚦ', 'ᚹ'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="bg-gray-50 dark:bg-neutral-900 border-t border-black/10 dark:border-white/10 p-3 select-none"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Keyboard size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
            PawScript Runic Keyboard (Elder Futhark)
          </span>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              {cat.title}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.symbols.map((sym, sIdx) => {
                const charObj = PAWSCRIPT_ALPHABET.find((c) => c.symbol === sym);
                return (
                  <button
                    key={sIdx}
                    onClick={() => {
                      playTapTone();
                      onSelect(sym);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-all shadow-sm active:scale-95 group"
                    title={`${charObj?.name || sym} • ${charObj?.ipa || ''}`}
                  >
                    <span className="pawscript-text text-sm font-bold">{sym}</span>
                    <span className="text-[8px] text-gray-400 group-hover:text-white font-mono leading-none">
                      {charObj?.sound || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==========================================
// Message Bubble Component
// ==========================================

function MessageBubble({
  message,
  isMe,
  viewMode,
}: {
  message: ChatMessage;
  isMe: boolean;
  viewMode: 'both' | 'pawscript' | 'english';
}) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCopyRunes = () => {
    playTapTone();
    navigator.clipboard.writeText(message.pawscript || message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    if (message.audioCue) {
      const audio = new Audio(message.audioCue);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      audio.play().catch(() => setIsPlayingAudio(false));
    } else {
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  return (
    <div className={`flex flex-col mb-3 ${isMe ? 'items-end' : 'items-start'}`}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-md relative group transition-all ${
          isMe
            ? 'bg-emerald-600 text-white rounded-br-xs'
            : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-xs border border-black/5 dark:border-white/5'
        }`}
      >
        {/* Header Ribbon for AI / Audio */}
        {!isMe && (
          <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/5 text-[10px]">
            <div className="flex items-center gap-1.5">
              {message.emotion && (
                <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                  {message.emotion}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handlePlayVoice}
                disabled={isPlayingAudio}
                className="text-gray-400 hover:text-emerald-500 p-1 rounded-md transition-colors"
                title="Play Audio"
              >
                {isPlayingAudio ? <VolumeX size={13} className="text-emerald-500 animate-pulse" /> : <Volume2 size={13} />}
              </button>
              {message.pawscript && (
                <button
                  onClick={handleCopyRunes}
                  className="text-gray-400 hover:text-amber-500 p-1 rounded-md transition-colors"
                  title="Copy Runes"
                >
                  {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 1. PawScript Runes */}
        {(viewMode === 'both' || viewMode === 'pawscript') && message.pawscript && (
          <div
            className={`rounded-xl p-2.5 mb-1.5 text-left border ${
              isMe
                ? 'bg-emerald-700/60 border-emerald-500/40 text-emerald-100'
                : 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/20 text-amber-900 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-1 mb-1 text-[9px] font-bold uppercase tracking-wider opacity-80">
              <span>🐾 Elder PawScript Runes:</span>
            </div>
            <p className="pawscript-text text-base font-bold tracking-wider leading-relaxed select-text">
              {message.pawscript}
            </p>
            {message.ipa && (
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mt-1 block">
                IPA: {message.ipa}
              </span>
            )}
          </div>
        )}

        {/* 2. English Text */}
        {(viewMode === 'both' || viewMode === 'english') && (
          <div>
            {!isMe && viewMode === 'both' && (
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Human Translation:
              </span>
            )}
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        )}

        {/* Footer */}
        <div
          className={`flex items-center gap-2 mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400 ${
            isMe ? 'justify-end' : 'justify-between'
          }`}
        >
          {!isMe && message.modelUsed && (
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">
              {message.modelUsed}
            </span>
          )}
          <div className="flex items-center gap-1">
            <span>{message.time}</span>
            {isMe &&
              (message.read ? (
                <CheckCheck size={13} className="text-blue-400" />
              ) : (
                <CheckCheck size={13} className="text-gray-300" />
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// WhatsApp Mobile Number Registration Wizard
// ==========================================

function WhatsAppRegistrationScreen({
  onRegisterComplete,
}: {
  onRegisterComplete: (profile: UserProfile) => void;
}) {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [nationalNumber, setNationalNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [expectedOtp, setExpectedOtp] = useState<string>('7492');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [smsBanner, setSmsBanner] = useState<{ title: string; body: string; code: string; isEmail: boolean } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧑');
  const [about, setAbout] = useState('Hey there! I am using PawChat 🐾');

  const countryCodes = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'Japan', code: '+81', flag: '🇯🇵' },
    { name: 'PawLand (Animal Kingdom)', code: '+999', flag: '🐾' },
  ];

  const avatarOptions = ['🧑', '🐱', '🐶', '🦊', '🦁', '🐾', '🐼', '🐯'];
  const aboutPresets = [
    'Hey there! I am using PawChat 🐾',
    'Available',
    'Sleeping in the sunbeam ☀️',
    'At the dog park 🐕',
    'Hunting red laser dots 🔴',
    'Busy eating snacks 🍗',
  ];

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const triggerSendOtp = async (destination: string, type: 'phone' | 'email') => {
    setIsSendingOtp(true);
    setOtpError(null);
    let code = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', destination, type }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.code) code = data.code;
      }
    } catch {
      // Offline fallback: random dynamic code generated locally
    } finally {
      setIsSendingOtp(false);
    }

    setExpectedOtp(code);
    setResendCooldown(30);
    playTapTone();

    if (type === 'email') {
      setSmsBanner({
        title: '✉️ Email Inbox • PawChat Security',
        body: `Verification code for ${destination} is:`,
        code,
        isEmail: true,
      });
    } else {
      setSmsBanner({
        title: '💬 Carrier SMS • PawOS Verification',
        body: `Your PawChat verification code is:`,
        code,
        isEmail: false,
      });
    }

    setStep('otp');
  };

  const handlePhoneOrEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'phone') {
      if (!nationalNumber.trim() || nationalNumber.length < 5) return;
      const destination = `${countryCode} ${nationalNumber.trim()}`;
      triggerSendOtp(destination, 'phone');
    } else {
      if (!emailAddress.trim() || !emailAddress.includes('@')) return;
      triggerSendOtp(emailAddress.trim().toLowerCase(), 'email');
    }
  };

  const handleAutoFillOtp = (code: string) => {
    playTapTone();
    setOtpError(null);
    setOtp(code.split('').slice(0, 4));
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) return;

    if (entered !== expectedOtp) {
      setOtpError('Incorrect code. Please check and try again.');
      return;
    }

    playTapTone();
    setOtpError(null);
    setStep('profile');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playCallConnectedTone();

    const fullProfile: UserProfile = {
      authType: authMode,
      phone: authMode === 'phone' ? `${countryCode} ${nationalNumber.trim()}` : undefined,
      email: authMode === 'email' ? emailAddress.trim() : undefined,
      countryCode: authMode === 'phone' ? countryCode : undefined,
      nationalNumber: authMode === 'phone' ? nationalNumber.trim() : undefined,
      name: name.trim(),
      avatar,
      about: about.trim(),
      registeredAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('pawchat_user_session', JSON.stringify(fullProfile));
    } catch {}

    onRegisterComplete(fullProfile);
  };

  const currentDestination =
    authMode === 'phone' ? `${countryCode} ${nationalNumber}` : emailAddress;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white relative select-none">
      {/* Real-Time Live Push Notification Banner */}
      <AnimatePresence>
        {smsBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-4 left-4 right-4 max-w-md mx-auto bg-neutral-800/95 border border-emerald-500/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center justify-between text-xs z-50"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl flex-shrink-0">{smsBanner.isEmail ? '✉️' : '💬'}</span>
              <div className="min-w-0">
                <p className="font-bold text-emerald-400 text-xs truncate">{smsBanner.title}</p>
                <p className="text-gray-200 text-[11px] truncate">
                  {smsBanner.body} <strong className="text-amber-300 font-mono text-sm tracking-wider">🐾 {smsBanner.code}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <button
                onClick={() => handleAutoFillOtp(smsBanner.code)}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
              >
                Auto-fill
              </button>
              <button onClick={() => setSmsBanner(null)} className="text-gray-400 hover:text-white p-1">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 dark:text-white">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20 mb-3">
            💬
          </div>
          <h2 className="text-2xl font-bold tracking-tight">PawChat</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            End-to-End Purr-to-Purr Encrypted Messenger
          </p>
        </div>

        {/* STEP 1: Phone or Email Selector & Input */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneOrEmailSubmit} className="space-y-4">
            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  playTapTone();
                  setAuthMode('phone');
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authMode === 'phone'
                    ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Phone size={13} />
                <span>Mobile Phone</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapTone();
                  setAuthMode('email');
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authMode === 'email'
                    ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Mail size={13} />
                <span>Email Address</span>
              </button>
            </div>

            <div className="text-center mb-3">
              <h3 className="font-bold text-sm">
                {authMode === 'phone' ? 'Enter your phone number' : 'Enter your email address'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {authMode === 'phone'
                  ? 'We will send a 4-digit verification code via SMS.'
                  : 'We will send a 4-digit verification code to your email inbox.'}
              </p>
            </div>

            {authMode === 'phone' ? (
              <>
                {/* Country Dropdown */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">Country / Region</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500 border border-black/5 dark:border-white/10"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.name} value={c.code}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs font-mono font-bold flex items-center border border-black/5 dark:border-white/10">
                      {countryCode}
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98450 12345"
                      value={nationalNumber}
                      onChange={(e) => setNationalNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 px-3 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 border border-black/5 dark:border-white/10"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Email Input Field */
              <div>
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 border border-black/5 dark:border-white/10"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                isSendingOtp ||
                (authMode === 'phone' ? nationalNumber.length < 5 : !emailAddress.includes('@'))
              }
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSendingOtp ? 'Sending Code...' : `Send Verification Code ➔`}</span>
            </button>
          </form>
        )}

        {/* STEP 2: Enter Verification Code */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-sm">Verify {currentDestination}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the 4-digit code dispatched to your {authMode === 'phone' ? 'SMS' : 'email'}.
              </p>
            </div>

            {/* 4 Digit Boxes */}
            <div className="flex justify-center gap-3 my-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const next = [...otp];
                    next[idx] = val;
                    setOtp(next);
                    setOtpError(null);
                  }}
                  className="w-12 h-14 text-center text-xl font-bold font-mono bg-gray-100 dark:bg-neutral-800 border-2 border-emerald-500/40 rounded-xl outline-none focus:border-emerald-500"
                />
              ))}
            </div>

            {/* Error Message */}
            {otpError && (
              <p className="text-xs text-rose-500 text-center font-semibold bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-200 dark:border-rose-900">
                {otpError}
              </p>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => handleAutoFillOtp(expectedOtp)}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>⚡ Auto-fill ({expectedOtp})</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isSendingOtp}
                onClick={() => triggerSendOtp(currentDestination, authMode)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 cursor-pointer"
              >
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '']);
                  setOtpError(null);
                }}
                className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
              >
                Change {authMode === 'phone' ? 'Phone Number' : 'Email Address'}
              </button>
            </div>

            <button
              type="submit"
              disabled={otp.join('').length < 4}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer mt-2"
            >
              Verify Code & Continue
            </button>
          </form>
        )}

        {/* STEP 3: Profile Setup */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="font-bold text-sm">Profile Info</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Choose your avatar and display name for PawChat.
              </p>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1 text-center">Choose Avatar</label>
              <div className="flex justify-center gap-2 flex-wrap mb-3">
                {avatarOptions.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => {
                      playTapTone();
                      setAvatar(av);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      avatar === av
                        ? 'bg-emerald-500 scale-110 shadow-md ring-2 ring-emerald-400'
                        : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Type your name here..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 border border-black/5 dark:border-white/10"
              />
            </div>

            {/* About / Status */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">Status / About</label>
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 border border-black/5 dark:border-white/10 mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {aboutPresets.slice(0, 3).map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAbout(preset)}
                    className="text-[10px] bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
            >
              Finish & Start Chatting 🐾
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// User Profile / Settings Modal
// ==========================================

function UserProfileModal({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onLogout,
}: {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = { ...user, name, about };
    try {
      localStorage.setItem('pawchat_user_session', JSON.stringify(updated));
    } catch {}
    onUpdateUser(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 border border-white/20 rounded-3xl max-w-md w-full p-6 text-neutral-900 dark:text-white shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <User size={18} className="text-emerald-500" />
            <h3 className="font-bold text-base">My WhatsApp Profile</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="py-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-4xl shadow-lg mb-3">
            {user.avatar}
          </div>

          {isEditing ? (
            <div className="w-full space-y-3 mt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-xl text-sm font-bold text-center outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs text-center outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold flex items-center gap-1.5">
                <span>{user.name}</span>
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-emerald-500 p-0.5">
                  <Edit2 size={13} />
                </button>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.about}</p>
            </>
          )}

          {/* Registered Phone Badge */}
          <div className="mt-5 w-full bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="text-[10px] text-gray-400 block font-semibold">Registered Mobile Number</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{user.phone}</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
              <ShieldCheck size={11} /> Verified
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
          <button
            onClick={onLogout}
            className="text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
          >
            <LogOut size={14} />
            <span>Log Out / Change Number</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-neutral-800 rounded-xl font-bold"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Contact Info Modal
// ==========================================

function ContactInfoModal({
  contact,
  isOpen,
  onClose,
}: {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 border border-white/20 rounded-3xl max-w-sm w-full p-6 text-neutral-900 dark:text-white shadow-2xl relative"
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center -mt-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl mb-3 flex items-center justify-center text-4xl bg-neutral-800">
            {contact.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
            ) : (
              <span>{contact.emoji}</span>
            )}
          </div>
          <h2 className="text-xl font-bold">{contact.name}</h2>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{contact.species} • {contact.gender}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-2">{contact.about}</p>

          <div className="mt-5 w-full bg-gray-50 dark:bg-neutral-800/80 rounded-2xl p-3 text-left border border-black/5 dark:border-white/10 space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold">Phone Number</span>
              <span className="font-mono font-bold">{contact.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold">Security</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={12} /> Purr-to-Purr Encrypted
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// PawLLM Local Engine Inspector Modal
// ==========================================

function PawLLMInspectorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const specs = getPawLLMSpecs();

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/pawllm');
      if (res.ok) {
        const data = await res.json();
        setOllamaOnline(data.ollamaBridge?.online || false);
        setOllamaModels(data.ollamaBridge?.models || []);
      }
    } catch {
      setOllamaOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetch('/api/pawllm')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setOllamaOnline(data.ollamaBridge?.online || false);
          setOllamaModels(data.ollamaBridge?.models || []);
        }
      })
      .catch(() => {
        if (!cancelled) setOllamaOnline(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 border border-white/20 rounded-3xl max-w-lg w-full p-6 text-neutral-900 dark:text-white shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-md">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base">PawLLM Bio-Acoustic Engine</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Local Neural Architecture v2.4</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Primary: Embedded PawLLM 1.2B (Active)</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                100% On-Device
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              Zero network dependencies. Zero cloud telemetry. Runs directly in PawOS with real-time bioacoustic rune generation.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-neutral-800/60 rounded-2xl p-3.5 border border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span>🦙</span>
                <span>Local Ollama Bridge (127.0.0.1:11434)</span>
              </span>
              <button
                onClick={checkStatus}
                disabled={isChecking}
                className="text-amber-500 hover:text-amber-600 flex items-center gap-1 text-[11px] font-semibold"
              >
                <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
                <span>Ping</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${ollamaOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {ollamaOnline ? 'Ollama Daemon Detected' : 'Ollama Daemon in Standby (Fallback Active)'}
              </span>
            </div>
            {ollamaOnline && ollamaModels.length > 0 && (
              <div className="mt-2 text-[10px] text-gray-400">
                <span>Available Local Models: {ollamaModels.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2.5">
              <span className="text-gray-400 block text-[10px]">Context Window</span>
              <span className="font-mono font-bold">{specs.contextWindow} tokens</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2.5">
              <span className="text-gray-400 block text-[10px]">PawScript Runes</span>
              <span className="font-mono font-bold">23 Elder Glyphs</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2.5">
              <span className="text-gray-400 block text-[10px]">Quantization</span>
              <span className="font-mono font-bold">4-bit INT4</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2.5">
              <span className="text-gray-400 block text-[10px]">Telemetry</span>
              <span className="font-mono font-bold text-emerald-500">0% Cloud / Local Only</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Purr-to-Purr Voice/Video Call Modal
// ==========================================

function CallModal({
  call,
  duration,
  onEndCall,
}: {
  call: ActiveCall;
  duration: number;
  onEndCall: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [subtitle, setSubtitle] = useState('');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (call.status !== 'connected') return;
    const interval = setInterval(() => {
      const isCat = call.contact.species === 'Cat';
      const noises = isCat
        ? ['ᛗᛖᐱ meow! purr...', 'ᚳᚱᛈ chirp chirp!', 'ᚱᚱᚱ deep purr 26Hz']
        : ['ᛒᐱᚢ bark bark!', 'ᚹᚢᚠ woof!', 'ᛈᛝᛏ pant pant!'];
      const chosen = noises[Math.floor(Math.random() * noises.length)];
      setSubtitle(chosen);
      if (speaker) {
        const chars = getCharactersByAnimal(call.contact.species);
        if (chars.length > 0) playSound(chars[0].audioParams, 'neutral', 'short');
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [call.status, call.contact.species, speaker]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-between p-6 sm:p-10 select-none text-white">
      <div className="text-center pt-4">
        <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-emerald-400 font-semibold border border-white/15">
          {call.type === 'video' ? '🐾 PawVideo 4K' : '🐾 PawVoice HD'} • Purr-to-Purr Encrypted
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">{call.contact.name}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {call.status === 'ringing' ? 'Ringing across animal network...' : formatTime(duration)}
        </p>
      </div>

      <div className="flex flex-col items-center my-auto">
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center text-6xl bg-neutral-800">
            {call.contact.avatarUrl && !videoDisabled ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={call.contact.avatarUrl} alt={call.contact.name} className="w-full h-full object-cover" />
            ) : (
              <span>{call.contact.emoji}</span>
            )}
          </div>
          {call.status === 'connected' && (
            <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-neutral-950 animate-pulse" />
          )}
        </div>

        {subtitle && (
          <div className="mt-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold text-amber-300">
            {subtitle}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6 pb-6">
        <button
          onClick={() => {
            playTapTone();
            setMuted(!muted);
          }}
          className={`p-4 rounded-full border transition-all ${
            muted ? 'bg-red-600 border-red-500 text-white' : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
          }`}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {call.type === 'video' && (
          <button
            onClick={() => {
              playTapTone();
              setVideoDisabled(!videoDisabled);
            }}
            className={`p-4 rounded-full border transition-all ${
              videoDisabled ? 'bg-red-600 border-red-500 text-white' : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
            }`}
            title={videoDisabled ? 'Enable Video' : 'Disable Video'}
          >
            {videoDisabled ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        )}

        <button
          onClick={() => {
            playTapTone();
            setSpeaker(!speaker);
          }}
          className={`p-4 rounded-full border transition-all ${
            speaker ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : 'bg-gray-700 border-gray-600 text-gray-400'
          }`}
          title={speaker ? 'Mute Speaker' : 'Enable Speaker'}
        >
          {speaker ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button
          onClick={onEndCall}
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white border border-rose-500 shadow-xl transition-all hover:scale-110 active:scale-95"
          title="End Call"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Main PawChat Component
// ==========================================

export default function PawChatPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [selectedChat, setSelectedChat] = useState<string | null>('pawllm-helper');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CONVERSATIONS);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showLiveRunePreview, setShowLiveRunePreview] = useState(true);
  const [showHelperDrawer, setShowHelperDrawer] = useState(false);
  const [selectedContactInfo, setSelectedContactInfo] = useState<Contact | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'pawscript' | 'english'>('both');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stopRingRef = useRef<(() => void) | null>(null);

  // Check registration and load conversations on initial mount asynchronously
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const saved = localStorage.getItem('pawchat_user_session');
        if (saved) {
          setUserProfile(JSON.parse(saved));
        } else {
          setIsRegistering(true);
        }

        const savedConvs = localStorage.getItem('pawchat_conversations_v3');
        if (savedConvs) {
          const parsed = JSON.parse(savedConvs);
          if (parsed && typeof parsed === 'object') {
            setChatMessages((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {
        setIsRegistering(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem('pawchat_conversations_v3', JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, selectedChat, isGenerating]);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  const handleStartCall = (contact: Contact, type: 'voice' | 'video') => {
    playTapTone();
    stopRingRef.current = playPhoneRing();
    setActiveCall({
      contact,
      type,
      status: 'ringing',
      duration: 0,
    });
    setCallDuration(0);

    setTimeout(() => {
      if (stopRingRef.current) {
        stopRingRef.current();
        stopRingRef.current = null;
      }
      playCallConnectedTone();
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 3000);
  };

  const handleEndCall = () => {
    if (stopRingRef.current) {
      stopRingRef.current();
      stopRingRef.current = null;
    }
    playCallEndTone();
    setActiveCall(null);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('pawchat_user_session');
    } catch {}
    setUserProfile(null);
    setShowProfileModal(false);
    setIsRegistering(true);
  };

  const selectedContact = CONTACTS.find((c) => c.id === selectedChat);
  const currentMessages = selectedChat ? chatMessages[selectedChat] || [] : [];

  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const getUnreadCount = (contactId: string): number => {
    const msgs = chatMessages[contactId] || [];
    return msgs.filter((m) => m.senderId !== 'me' && !m.read).length;
  };

  const getLastMessage = (contactId: string): ChatMessage => {
    const msgs = chatMessages[contactId] || [];
    return (
      msgs[msgs.length - 1] || {
        id: '',
        senderId: '',
        text: 'No messages yet',
        time: '',
        read: true,
        type: 'text' as const,
      }
    );
  };

  // ==========================================
  // Single Message Helper Actions (Copilot)
  // ==========================================
  const handleHelperAction = (action: 'translate' | 'suggest_reply' | 'paw_slang' | 'polish') => {
    playTapTone();
    const res = generatePawLLMHelperSuggestion(action, messageInput, selectedContact?.name);
    setMessageInput(res.text);
    setShowLiveRunePreview(true);
    setShowHelperDrawer(false);
  };

  // ==========================================
  // Interactive Message Send
  // ==========================================
  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChat || isGenerating) return;
    const userText = messageInput.trim();
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User's outgoing message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      senderId: 'me',
      text: userText,
      pawscript: translateToPawScript(userText),
      time: userTime,
      read: false,
      type: 'text',
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), userMsg],
    }));
    setMessageInput('');
    setIsGenerating(true);
    playTapTone();

    // Simulated reply from Contact Pet OR PawLLM Helper
    try {
      const history = (chatMessages[selectedChat] || []).slice(-6).map((m) => ({
        senderId: m.senderId,
        text: m.text,
      }));

      // PawLLM generates contextual reply
      const reply: PawLLMReply = await generatePawLLMReply(selectedChat, userText, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        senderId: selectedChat,
        text: reply.english,
        pawscript: reply.pawscript,
        ipa: reply.ipa,
        emotion: reply.emotion,
        audioCue: reply.audioCue,
        modelUsed: selectedContact?.isAiHelper ? reply.modelUsed : undefined,
        latencyMs: reply.latencyMs,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text',
      };

      setChatMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), botMsg],
      }));

      if (reply.audioCue) {
        const audio = new Audio(reply.audioCue);
        audio.play().catch(() => {});
      } else if (selectedContact) {
        const chars = getCharactersByAnimal(selectedContact.species);
        if (chars.length > 0) playSound(chars[0].audioParams, 'neutral', 'short');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        senderId: selectedChat,
        text: 'purr meow! My paws are overflowing with affection! 🐾',
        pawscript: 'ᛗᛖᐱ! ᛈᚢᚱᚱ ᛗᛖᚩᚹ ᛈᚪᚹᛋᚳᚱᛁᛈᛏ ᛚᚩᚳᚳᛖᛞ!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text',
      };
      setChatMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), fallbackMsg],
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    if (!selectedChat) return;
    playTapTone();
    setChatMessages((prev) => {
      const updated = {
        ...prev,
        [selectedChat]: [],
      };
      try {
        localStorage.setItem('pawchat_conversations_v3', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const liveRunePreview = messageInput.trim() ? translateToPawScript(messageInput) : '';

  return (
    <IPadFrame
      appName="PawChat"
      appEmoji="💬"
      appColor="from-emerald-400 to-green-600"
      rightActions={
        <div className="flex items-center gap-2">
          {/* PawLLM Local Engine Status Pill */}
          <button
            onClick={() => {
              playTapTone();
              setShowInspector(true);
            }}
            className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 transition-all hover:scale-105"
            title="Inspect PawLLM Local Engine & Specs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🧠 PawLLM (Local)</span>
            <Info size={12} className="text-emerald-500" />
          </button>
        </div>
      }
    >
      {/* If user is not registered, show WhatsApp Mobile Number Registration screen */}
      {isRegistering || !userProfile ? (
        <WhatsAppRegistrationScreen
          onRegisterComplete={(profile) => {
            setUserProfile(profile);
            setIsRegistering(false);
          }}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden bg-neutral-900 text-white relative">
          {/* Active Call Modal */}
          <AnimatePresence>
            {activeCall && <CallModal call={activeCall} duration={callDuration} onEndCall={handleEndCall} />}
          </AnimatePresence>

          {/* User Profile / Settings Modal */}
          {userProfile && (
            <UserProfileModal
              user={userProfile}
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
              onUpdateUser={(updated) => setUserProfile(updated)}
              onLogout={handleLogout}
            />
          )}

          {/* Contact Info Modal */}
          {selectedContactInfo && (
            <ContactInfoModal
              contact={selectedContactInfo}
              isOpen={!!selectedContactInfo}
              onClose={() => setSelectedContactInfo(null)}
            />
          )}

          {/* PawLLM Inspector Modal */}
          <PawLLMInspectorModal isOpen={showInspector} onClose={() => setShowInspector(false)} />

          {/* ==================== 1. CHAT LIST PANEL ==================== */}
          <div
            className={`w-full md:w-[360px] bg-white dark:bg-neutral-900 border-r border-black/10 dark:border-white/10 flex flex-col ${
              selectedChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header: User Profile & App Title */}
            <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-2.5">
                <button
                  onClick={() => {
                    playTapTone();
                    setShowProfileModal(true);
                  }}
                  className="flex items-center gap-2 text-left group"
                  title="View / Edit Profile & Number"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-lg shadow-sm group-hover:ring-2 ring-emerald-400">
                    {userProfile.avatar}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-neutral-900 dark:text-white block truncate">
                      {userProfile.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block truncate">
                      {userProfile.phone}
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>WhatsApp Mode</span>
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search animal contacts or phone..."
                  className="w-full pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Conversation Contacts List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
              {filteredContacts.map((contact) => {
                const lastMsg = getLastMessage(contact.id);
                const unread = getUnreadCount(contact.id);
                const isActive = selectedChat === contact.id;

                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      playTapTone();
                      setSelectedChat(contact.id);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500'
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50'
                    } ${contact.isAiHelper ? 'bg-amber-500/5 dark:bg-amber-950/20' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-xl shadow-sm ${
                          contact.isAiHelper
                            ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white ring-2 ring-emerald-400/50'
                            : 'bg-neutral-800'
                        }`}
                      >
                        {contact.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{contact.emoji}</span>
                        )}
                      </div>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white truncate flex items-center gap-1.5">
                          <span>{contact.name}</span>
                          {contact.isAiHelper && (
                            <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase">
                              AI Copilot
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-gray-400">{lastMsg.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {lastMsg.text}
                      </p>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block truncate font-medium">
                        {contact.phone} • {contact.tagline}
                      </span>
                    </div>

                    {unread > 0 && (
                      <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {unread}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================== 2. ACTIVE CONVERSATION PANEL ==================== */}
          {selectedContact ? (
            <div
              className={`flex-1 flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white ${
                selectedChat ? 'flex' : 'hidden md:flex'
              }`}
            >
              {/* WhatsApp Active Header */}
              <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-white dark:bg-neutral-900 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden text-gray-500 hover:text-neutral-900 dark:hover:text-white p-1"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    onClick={() => setSelectedContactInfo(selectedContact)}
                    className="flex items-center gap-2.5 text-left group"
                    title="Click for Contact Details"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-lg bg-neutral-800 shadow-sm group-hover:ring-2 ring-emerald-400">
                        {selectedContact.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={selectedContact.avatarUrl}
                            alt={selectedContact.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{selectedContact.emoji}</span>
                        )}
                      </div>
                      {selectedContact.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900" />
                      )}
                    </div>

                    <div>
                      <h2 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <span>{selectedContact.name}</span>
                        {selectedContact.isAiHelper && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                            AI Message Helper
                          </span>
                        )}
                      </h2>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                        {selectedContact.phone} • {selectedContact.lastSeen}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center bg-gray-100 dark:bg-neutral-800 rounded-xl p-0.5 text-[11px]">
                    <button
                      onClick={() => setViewMode('both')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        viewMode === 'both' ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-400'
                      }`}
                    >
                      Dual 🌟
                    </button>
                    <button
                      onClick={() => setViewMode('pawscript')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        viewMode === 'pawscript' ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-400'
                      }`}
                    >
                      Runes 🐾
                    </button>
                    <button
                      onClick={() => setViewMode('english')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        viewMode === 'english' ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-400'
                      }`}
                    >
                      English 💬
                    </button>
                  </div>

                  {/* Voice / Video Call */}
                  <button
                    onClick={() => handleStartCall(selectedContact, 'voice')}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                    title="Purr-to-Purr Voice Call"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => handleStartCall(selectedContact, 'video')}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                    title="PawVideo 4K Call"
                  >
                    <Video size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedContactInfo(selectedContact)}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                    title="Contact Details"
                  >
                    <Info size={16} />
                  </button>

                  {/* Clear Chat History */}
                  <button
                    onClick={handleClearChat}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-rose-500 hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                    title="Clear Conversation History"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-radial from-emerald-500/5 via-transparent to-transparent">
                {/* Purr-to-purr Encryption Notice */}
                <div className="flex justify-center mb-4">
                  <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck size={12} />
                    <span>Messages to {selectedContact.name} ({selectedContact.phone}) are Purr-to-Purr Encrypted</span>
                  </div>
                </div>

                {currentMessages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isMe={msg.senderId === 'me'}
                    viewMode={viewMode}
                  />
                ))}

                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 mb-3"
                  >
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-xs p-3 border border-black/5 dark:border-white/5 shadow-md">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <span>{selectedContact.name} is typing...</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ==================== 3. SINGLE MESSAGE HELPER & COMPOSER ==================== */}
              {/* Single Message Helper Floating Toolbar */}
              <AnimatePresence>
                {showHelperDrawer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-emerald-50 dark:bg-neutral-900 border-t border-emerald-500/30 p-3"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>PawLLM Single Message Copilot</span>
                      </span>
                      <button onClick={() => setShowHelperDrawer(false)} className="text-gray-400 hover:text-white p-0.5">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <button
                        onClick={() => handleHelperAction('translate')}
                        className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-500/20 hover:border-emerald-500 text-left transition-all hover:scale-102 flex flex-col gap-1"
                      >
                        <span className="font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Wand2 size={13} /> ᛗ Translate
                        </span>
                        <span className="text-[10px] text-gray-500">To Elder PawScript</span>
                      </button>

                      <button
                        onClick={() => handleHelperAction('suggest_reply')}
                        className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-500/20 hover:border-emerald-500 text-left transition-all hover:scale-102 flex flex-col gap-1"
                      >
                        <span className="font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          🐾 Suggest
                        </span>
                        <span className="text-[10px] text-gray-500">Witty reply for {selectedContact.name}</span>
                      </button>

                      <button
                        onClick={() => handleHelperAction('paw_slang')}
                        className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-500/20 hover:border-emerald-500 text-left transition-all hover:scale-102 flex flex-col gap-1"
                      >
                        <span className="font-bold flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          🐕 Paw Slang
                        </span>
                        <span className="text-[10px] text-gray-500">Bork & zoomie phrases</span>
                      </button>

                      <button
                        onClick={() => handleHelperAction('polish')}
                        className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-500/20 hover:border-emerald-500 text-left transition-all hover:scale-102 flex flex-col gap-1"
                      >
                        <span className="font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          ✨ Polish
                        </span>
                        <span className="text-[10px] text-gray-500">Warm affectionate tone</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Real-time PawScript Translation Preview Ribbon */}
              {showLiveRunePreview && liveRunePreview && (
                <div className="bg-amber-500/10 dark:bg-amber-950/30 border-t border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-amber-500 font-bold flex-shrink-0">Live PawScript:</span>
                    <span className="pawscript-text font-bold text-amber-700 dark:text-amber-300 text-sm truncate">
                      {liveRunePreview}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        playTapTone();
                        setMessageInput(liveRunePreview);
                      }}
                      className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline ml-2"
                      title="Insert raw runes into input"
                    >
                      Use Runes
                    </button>
                    <button
                      onClick={() => setShowLiveRunePreview(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                      title="Dismiss preview"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Virtual PawScript Alphabet Keyboard Drawer */}
              <AnimatePresence>
                {showKeyboard && (
                  <PawScriptKeyboardDrawer
                    onSelect={(symbol) => setMessageInput((prev) => prev + symbol + ' ')}
                    onClose={() => setShowKeyboard(false)}
                  />
                )}
              </AnimatePresence>

              {/* Quick Prompt Suggestions for Selected Contact */}
              {selectedChat && CONTACT_PROMPT_SUGGESTIONS[selectedChat]?.length > 0 && (
                <div className="px-3 py-1.5 bg-gray-50 dark:bg-neutral-900/90 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
                    <Sparkles size={11} className="text-emerald-500" /> Suggestions:
                  </span>
                  {CONTACT_PROMPT_SUGGESTIONS[selectedChat].map((promptText, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        playTapTone();
                        setMessageInput(promptText);
                      }}
                      className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-black/5 dark:border-white/10 text-[11px] font-medium transition-all hover:scale-102 cursor-pointer shadow-2xs"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              )}

              {/* Composer Input Bar */}
              <div className="bg-white dark:bg-neutral-900 px-3 py-3 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  {/* Single Message Helper Trigger Pill */}
                  <button
                    onClick={() => {
                      playTapTone();
                      setShowHelperDrawer(!showHelperDrawer);
                    }}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                      showHelperDrawer
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                    }`}
                    title="Open PawLLM Message Helper"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Helper</span>
                  </button>

                  <button
                    onClick={() => {
                      playTapTone();
                      setMessageInput((prev) => prev + ' 🐾 ');
                    }}
                    className="text-gray-400 hover:text-amber-500 p-1 transition-colors"
                    title="Add Paw Emoji"
                  >
                    <Smile size={20} />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        if (!showLiveRunePreview) setShowLiveRunePreview(true);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder={
                        selectedContact.isAiHelper
                          ? `Ask PawLLM Helper anything (translate, runes, tips)...`
                          : `Message ${selectedContact.name} in English or PawScript...`
                      }
                      disabled={isGenerating}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-gray-400 rounded-full text-xs outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                    />
                  </div>

                  {/* Toggle Virtual PawScript Alphabet Keyboard */}
                  <button
                    onClick={() => {
                      playTapTone();
                      setShowKeyboard(!showKeyboard);
                    }}
                    className={`flex-shrink-0 px-2.5 py-2 rounded-full transition-all flex items-center gap-1 text-xs font-semibold ${
                      showKeyboard
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                    }`}
                    title="Toggle Virtual PawScript Rune Keyboard"
                  >
                    <Keyboard size={16} />
                    <span className="hidden sm:inline">Runes</span>
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim() || isGenerating}
                    className="flex-shrink-0 w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
                    title="Send Message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
              <div className="text-center p-6 max-w-sm">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-xl font-bold mb-2">PawChat with PawLLM</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4">
                  Select a contact pet to start chatting, or click on PawLLM Helper to draft and translate messages.
                </p>
                <button
                  onClick={() => setSelectedChat('pawllm-helper')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-md hover:bg-emerald-700"
                >
                  Open PawLLM Helper ✨
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </IPadFrame>
  );
}
