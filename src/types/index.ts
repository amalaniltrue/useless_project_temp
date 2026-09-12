// PawLingo Type Definitions

// ==========================================
// PawScript Types
// ==========================================

export type PhoneticCategory =
  | 'Resonant Vocal Glide'
  | 'Fricative & Breath Friction'
  | 'Plosive & Guttural Burst'
  | 'Sub-harmonic & Glottal Flutter'
  | 'High-Frequency Syrinx Trill'
  | 'Percussive & Mechanical Snap';

export type IntonationContour =
  | 'Rising ↗'
  | 'Falling ↘'
  | 'Rise-Fall ↗↘'
  | 'Fall-Rise ↘↗'
  | 'Tremolo / Vibrato 〰️'
  | 'Continuous Rumble ──'
  | 'Explosive Burst 💥'
  | 'Staccato Bursts ⏱️';

export interface PhoneticStage {
  label: string; // e.g., "Onset [m]", "Resonance [ɛ→a]", "Closure [ʊ]"
  ipa: string;   // "[m]", "[ɛ.a]", "[ʊ]"
  timePercent: number; // 0 to 100%
  pitchHz: number; // fundamental frequency F0 at this stage
  formants?: {
    f1: number; // Formant 1 in Hz (jaw opening)
    f2: number; // Formant 2 in Hz (tongue position)
  };
  breathRatio?: number; // breath / friction level (0 to 1)
  description: string; // what the animal vocal tract is doing
}

export interface PitchKeyframe {
  timeOffset: number; // 0.0 to 1.0 (fraction of sound duration)
  pitchFactor: number; // multiplier of base frequency (e.g., 0.7 -> 1.35 -> 0.6)
}

export interface FormantKeyframe {
  timeOffset: number; // 0.0 to 1.0
  f1: number; // Formant 1 Hz
  f2: number; // Formant 2 Hz
  q?: number; // Resonance Q factor
}

export type LifeStage =
  | 'Kittenhood (0-6 Mo)'
  | 'Puppyhood (0-6 Mo)'
  | 'Adolescence & Adulthood'
  | 'Senior Years (10+ Yrs)'
  | 'All Life Stages';

export type VocalSituation =
  | 'Greeting & Attention'
  | 'Distress & Need'
  | 'Alarm & Territory'
  | 'Hunting & Excitement'
  | 'Conflict & Defense'
  | 'Comfort & Self-Soothing'
  | 'Cognitive Disorientation'
  | 'Joint Stiffness & Handling'
  | 'Pack & Distance Communication'
  | 'Prey / Excitement';

export type MouthMechanic =
  | 'Murmur (Mouth Closed)'
  | 'Vowel (Mouth Open-to-Closed)'
  | 'High-Intensity (Mouth Wide Open)'
  | 'Pack Resonance (Oral Horn)'
  | 'Mechanical Clack';

export interface PawScriptCharacter {
  id: string;
  symbol: string;
  name: string;
  sound: string;
  animal: string;
  category: PhoneticCategory;
  intonation: IntonationContour;
  lifeStage: LifeStage;
  situation: VocalSituation;
  mouthMechanic: MouthMechanic;
  targetAudience: string;
  primaryEmotion: string;
  meaning: string;
  description: string;
  ipa: string;
  phoneticStages: PhoneticStage[];
  audioParams: AudioParams;
}

export interface AudioParams {
  frequency: number;
  waveform: OscillatorType;
  duration: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  pitchTrajectory?: PitchKeyframe[]; // Dynamic F0 pitch contour over time
  formantTrajectory?: FormantKeyframe[]; // Dynamic F1 and F2 vocal tract sweeps
  modFrequency?: number;
  modDepth?: number;
  noiseLevel?: number;
  noiseFilterType?: BiquadFilterType;
  noiseFilterFreq?: number;
  glottalPuffRate?: number; // low-frequency fluttering rate (purr, growl)
  tremoloRate?: number; // vibrato/tremolo rate (bleat, whinny)
  tremoloDepth?: number;
  filterFrequency?: number;
  filterType?: BiquadFilterType;
  realAudioFile?: string; // Path to real audio file, e.g. "/audio/animals/cat_meow.mp3"
}

export type StressLevel = 'whisper' | 'soft' | 'neutral' | 'emphasized' | 'loud';
export type DurationLevel = 'short' | 'medium' | 'long' | 'very-long';

export interface PawScriptStress {
  level: StressLevel;
  symbol: string;
  description: string;
}

export interface PawScriptDuration {
  level: DurationLevel;
  symbol: string;
  description: string;
}

// ==========================================
// User & Profile Types
// ==========================================

export interface UserProfile {
  id: string;
  name: string;
  handle?: string;
  species: string;
  breed?: string;
  avatar?: string;
  avatarImage?: string;
  bio?: string;
  bioPS?: string;
  type: 'animal' | 'human';
  age?: number;
  gender?: string;
  location?: string;
  followers?: number;
  following?: number;
  createdAt: string;
}

// ==========================================
// PetGram Types
// ==========================================

export type ReactionType = 'paw' | 'bone' | 'fish' | 'feather' | 'zoomies' | 'laugh';

export interface PostData {
  id: string;
  authorId: string;
  author: UserProfile;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  captionPS?: string;
  type: 'photo' | 'reel' | 'story';
  createdAt: string;
  reactions: ReactionData[];
  comments: CommentData[];
  likesCount?: number;
  sharesCount?: number;
  mediaAspect?: 'square' | 'vertical';
  tags?: string[];
  _count?: {
    reactions: number;
    comments: number;
  };
}

export interface ReactionData {
  id: string;
  type: ReactionType;
  userId: string;
  postId: string;
}

export interface CommentData {
  id: string;
  content: string;
  contentPS?: string;
  authorId: string;
  author: UserProfile;
  postId: string;
  createdAt: string;
}

// ==========================================
// PawChat Types
// ==========================================

export interface MessageData {
  id: string;
  content: string;
  contentPS?: string;
  senderId: string;
  sender: UserProfile;
  receiverId: string;
  receiver: UserProfile;
  type: 'text' | 'voice' | 'image' | 'pawscript';
  read: boolean;
  createdAt: string;
}

export interface ChatConversation {
  user: UserProfile;
  lastMessage: MessageData;
  unreadCount: number;
}

// ==========================================
// PawMatch Types
// ==========================================

export interface MatchProfileData {
  id: string;
  userId: string;
  user: UserProfile;
  lookingFor?: string;
  temperament?: string;
  diet?: string;
  vaccinated: boolean;
  neutered: boolean;
  aboutMe?: string;
  aboutMePS?: string;
  interests?: string[];
  createdAt: string;
}

export interface MatchData {
  id: string;
  likerId: string;
  likedId: string;
  matched: boolean;
  createdAt: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
