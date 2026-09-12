// PawScript — Grounded Animal Phonetic Language System
// Focused on Cats & Dogs across Life Stages, Situations, and Vocal Mechanics

import type {
  PawScriptCharacter,
  PawScriptStress,
  PawScriptDuration,
  StressLevel,
  DurationLevel,
  LifeStage,
  VocalSituation,
} from '@/types';

// ==========================================
// The Situational PawScript Alphabet (Cats & Dogs)
// ==========================================

export const PAWSCRIPT_ALPHABET: PawScriptCharacter[] = [
  // =================================================================
  // 🐱 CATS — PHASE 1: KITTENHOOD (Birth to 6 Months)
  // =================================================================
  {
    id: 'cat_mew',
    symbol: 'ᛗᛁᛁ',
    name: 'The Mew (Distress & Hunger Cry)',
    sound: 'mew',
    animal: 'Cat',
    lifeStage: 'Kittenhood (0-6 Mo)',
    situation: 'Distress & Need',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Mother Cat',
    primaryEmotion: 'Distress / Need',
    meaning: '"Help, I\'m cold, lost, or hungry!" Purely instinctual survival signal.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rising ↗',
    description: 'High-frequency, thin harmonic plea produced by newborn and young kittens. Instinctively triggers the mother cat\'s retrieval and nursing reflexes.',
    ipa: 'miː↗',
    phoneticStages: [
      {
        label: 'Closed Nasal Start',
        ipa: '[m]',
        timePercent: 25,
        pitchHz: 780,
        formants: { f1: 280, f2: 2100 },
        breathRatio: 0.05,
        description: 'Vocal folds tense up in closed nasal cavity.',
      },
      {
        label: 'Aspirated Squeak Peak',
        ipa: '[iː]',
        timePercent: 100,
        pitchHz: 1150,
        formants: { f1: 260, f2: 2600 },
        breathRatio: 0.1,
        description: 'Vocal tract stretches to high palate with urgent upward flare.',
      },
    ],
    audioParams: {
      frequency: 850,
      waveform: 'triangle',
      duration: 0.65,
      attack: 0.04,
      decay: 0.08,
      sustain: 0.75,
      release: 0.2,
      realAudioFile: '/sounds/animals/cat/cat_mew_kitten.wav',
    },
  },
  {
    id: 'cat_purr_nursing',
    symbol: 'ᚱᚱᚱ',
    name: 'The Purr (Nursing & Comfort Vibration)',
    sound: 'purr',
    animal: 'Cat',
    lifeStage: 'Kittenhood (0-6 Mo)',
    situation: 'Comfort & Self-Soothing',
    mouthMechanic: 'Murmur (Mouth Closed)',
    targetAudience: 'Mother & Companions',
    primaryEmotion: 'Comfort / Safe',
    meaning: '"I am safe and drinking milk." Vibration guides mother without attracting predators.',
    category: 'Sub-harmonic & Glottal Flutter',
    intonation: 'Continuous Rumble ──',
    description: 'Soft 26 Hz diaphragmatic vibration starting at days old so nursing kittens can signal wellbeing while latching.',
    ipa: 'r̥ːːː',
    phoneticStages: [
      {
        label: 'Inspiratory Flutter',
        ipa: '[r̥↑]',
        timePercent: 50,
        pitchHz: 26,
        formants: { f1: 150, f2: 430 },
        breathRatio: 0.15,
        description: 'Low-frequency glottal pulsing during inhale.',
      },
      {
        label: 'Expiratory Flutter',
        ipa: '[r̥↓]',
        timePercent: 100,
        pitchHz: 27,
        formants: { f1: 160, f2: 450 },
        breathRatio: 0.15,
        description: 'Laryngeal resonance continues uninterrupted during exhale.',
      },
    ],
    audioParams: {
      frequency: 26,
      waveform: 'sawtooth',
      duration: 2.4,
      attack: 0.2,
      decay: 0.1,
      sustain: 0.9,
      release: 0.4,
      glottalPuffRate: 26,
      realAudioFile: '/sounds/animals/cat/cat_purr.mp3',
    },
  },
  {
    id: 'cat_hiss_spit',
    symbol: 'ᚺᛊᛊ',
    name: 'The Hiss / Spit (Defensive Reflex)',
    sound: 'hiss',
    animal: 'Cat',
    lifeStage: 'Kittenhood (0-6 Mo)',
    situation: 'Conflict & Defense',
    mouthMechanic: 'High-Intensity (Mouth Wide Open)',
    targetAudience: 'Threat / Opponent',
    primaryEmotion: 'Fear / Warning',
    meaning: '"You scare me, stay back!" Involuntary reflex to mimic dangerous animals like snakes.',
    category: 'Fricative & Breath Friction',
    intonation: 'Falling ↘',
    description: 'Begins around 2-3 weeks old when kittens open their eyes and encounter strange smells or loud noises.',
    ipa: 'h̥ɪs̻ː',
    phoneticStages: [
      {
        label: 'Incisor Jet Onset',
        ipa: '[h̥]',
        timePercent: 25,
        pitchHz: 3800,
        breathRatio: 0.9,
        description: 'Tongue channels rapid jet of air toward incisors.',
      },
      {
        label: 'Snake-Mimic Sibilance',
        ipa: '[s̻ː]',
        timePercent: 100,
        pitchHz: 5200,
        breathRatio: 0.85,
        description: 'Wideband aerodynamic friction warning predators to back away.',
      },
    ],
    audioParams: {
      frequency: 3800,
      waveform: 'sawtooth',
      duration: 0.65,
      attack: 0.02,
      decay: 0.08,
      sustain: 0.5,
      release: 0.25,
      noiseLevel: 0.88,
      noiseFilterType: 'highpass',
      noiseFilterFreq: 4200,
      realAudioFile: '/sounds/animals/cat/mixkit-angry-cartoon-kitty-meow-94.wav',
    },
  },

  // =================================================================
  // 🐱 CATS — PHASE 2: ADOLESCENCE & ADULTHOOD (6 Months to 10 Years)
  // =================================================================
  {
    id: 'cat_meow_standard',
    symbol: 'ᛗᛖᐱ',
    name: 'The Standard Meow (Human Communication)',
    sound: 'meow',
    animal: 'Cat',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Greeting & Attention',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Humans',
    primaryEmotion: 'Attention Seeking',
    meaning: '"Hello!" or "Do something for me." Adult cats only vocalize this open-mouth call to humans.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rise-Fall ↗↘',
    description: 'Deliberate acoustic tool evolved exclusively to solicit human attention for food, opening doors, or greetings.',
    ipa: 'm͡ɛ.aʊ̯',
    phoneticStages: [
      {
        label: 'Onset (Nasal Murmur)',
        ipa: '[m]',
        timePercent: 15,
        pitchHz: 410,
        formants: { f1: 310, f2: 1200 },
        breathRatio: 0.05,
        description: 'Lips closed with resonant nasal hum.',
      },
      {
        label: 'Vocal Open Vowel',
        ipa: '[ɛ.a]',
        timePercent: 65,
        pitchHz: 680,
        formants: { f1: 780, f2: 1750 },
        breathRatio: 0.1,
        description: 'Mouth opens wide; pharyngeal cavity expands with clear pitch peak.',
      },
      {
        label: 'Closed Offglide',
        ipa: '[ʊ̯]',
        timePercent: 100,
        pitchHz: 350,
        formants: { f1: 360, f2: 980 },
        breathRatio: 0.08,
        description: 'Lips gently round shut with downward pitch decay.',
      },
    ],
    audioParams: {
      frequency: 440,
      waveform: 'sawtooth',
      duration: 0.75,
      attack: 0.05,
      decay: 0.12,
      sustain: 0.75,
      release: 0.25,
      realAudioFile: '/sounds/animals/cat/cat_meow_standard.mp3',
    },
  },
  {
    id: 'cat_trill_chirp',
    symbol: 'ᛗᚱᚱ',
    name: 'The Chirp / Trill (Happy Greeting)',
    sound: 'trill',
    animal: 'Cat',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Greeting & Attention',
    mouthMechanic: 'Murmur (Mouth Closed)',
    targetAudience: 'Kittens / Loved Humans',
    primaryEmotion: 'Happiness / Follow Me',
    meaning: '"Follow me!" or "Hey, I\'m glad you\'re here!" Friendly musical rolled greeting.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rising ↗',
    description: 'High-pitched rolled sound made without opening mouth. Used by mothers calling kittens or adult cats greeting bonded humans.',
    ipa: 'mʀ̥iː↗',
    phoneticStages: [
      {
        label: 'Rolled Throat Murmur',
        ipa: '[mʀ̥]',
        timePercent: 35,
        pitchHz: 480,
        formants: { f1: 340, f2: 1500 },
        breathRatio: 0.1,
        description: 'Vibratory rolled throat flutter.',
      },
      {
        label: 'Musical Chirp Flare',
        ipa: '[iː]',
        timePercent: 100,
        pitchHz: 820,
        formants: { f1: 290, f2: 2400 },
        breathRatio: 0.05,
        description: 'Upward jump into pure high-frequency singing note.',
      },
    ],
    audioParams: {
      frequency: 540,
      waveform: 'triangle',
      duration: 0.45,
      attack: 0.03,
      decay: 0.08,
      sustain: 0.7,
      release: 0.15,
      realAudioFile: '/sounds/animals/cat/cat_trill_sweet.wav',
    },
  },
  {
    id: 'cat_meow_begging',
    symbol: 'ᛗᛖᚢ',
    name: 'The Begging / Hungry Meow (Insistent Demand)',
    sound: 'begging',
    animal: 'Cat',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Greeting & Attention',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Humans',
    primaryEmotion: 'Urgency / Hunger',
    meaning: '"I am starving! Feed me right now!" Drawn-out pitch with embedded crying acoustic.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rise-Fall ↗↘',
    description: 'Acoustically embeds a human-infant-like cry frequency (300-600 Hz) within the meow to make it nearly impossible for humans to ignore.',
    ipa: 'mɛː.aʊ̯ː',
    phoneticStages: [
      {
        label: 'Insistent Pleading Start',
        ipa: '[mɛː]',
        timePercent: 40,
        pitchHz: 520,
        formants: { f1: 490, f2: 1800 },
        breathRatio: 0.1,
        description: 'Extended crying vocal glide.',
      },
      {
        label: 'Demanding Offglide',
        ipa: '[aʊ̯]',
        timePercent: 100,
        pitchHz: 390,
        formants: { f1: 420, f2: 1050 },
        breathRatio: 0.08,
        description: 'Drawn-out release asserting hunger urgency.',
      },
    ],
    audioParams: {
      frequency: 480,
      waveform: 'sawtooth',
      duration: 1.1,
      attack: 0.08,
      decay: 0.15,
      sustain: 0.8,
      release: 0.35,
      realAudioFile: '/sounds/animals/cat/cat_meow_hungry.wav',
    },
  },
  {
    id: 'cat_chatter',
    symbol: 'ᚲᚲᚲ',
    name: 'The Chatter / Chirek (Prey Excitement)',
    sound: 'chatter',
    animal: 'Cat',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Hunting & Excitement',
    mouthMechanic: 'Mechanical Clack',
    targetAudience: 'Self (None)',
    primaryEmotion: 'Frustration / Excitement',
    meaning: 'Intense excitement and frustration watching unreachable birds or bugs; mimics prey neck bite.',
    category: 'Percussive & Mechanical Snap',
    intonation: 'Staccato Bursts ⏱️',
    description: 'Rapid jaw vibration and teeth clicking while intently gazing at outdoor prey through glass.',
    ipa: 'kʼ.kʼ.kʼ',
    phoneticStages: [
      {
        label: 'Fast Mandible Click 1',
        ipa: '[kʼ]',
        timePercent: 33,
        pitchHz: 1250,
        breathRatio: 0.25,
        description: 'Lower jaw clacks against upper incisors.',
      },
      {
        label: 'Rapid Click 2',
        ipa: '[kʼ]',
        timePercent: 66,
        pitchHz: 1450,
        breathRatio: 0.25,
        description: 'Second rhythmic neck-snap simulation.',
      },
      {
        label: 'Click 3 & Squeak',
        ipa: '[kʼ]',
        timePercent: 100,
        pitchHz: 1650,
        breathRatio: 0.2,
        description: 'Final teeth tap with soft aspirated tail.',
      },
    ],
    audioParams: {
      frequency: 1350,
      waveform: 'triangle',
      duration: 0.25,
      attack: 0.01,
      decay: 0.04,
      sustain: 0.2,
      release: 0.05,
      glottalPuffRate: 14,
      realAudioFile: '/sounds/animals/cat/stu9-cute-cat-352656.mp3',
    },
  },
  {
    id: 'cat_growl_snarl',
    symbol: 'ᚷᚱᚱ',
    name: 'The Growl / Snarl (Territorial Threat)',
    sound: 'growl',
    animal: 'Cat',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Conflict & Defense',
    mouthMechanic: 'High-Intensity (Mouth Wide Open)',
    targetAudience: 'Other Animals / Threat',
    primaryEmotion: 'Anger / Warning',
    meaning: '"This is mine. If you come closer, I will attack."',
    category: 'Sub-harmonic & Glottal Flutter',
    intonation: 'Continuous Rumble ──',
    description: 'Low guttural rumble produced with pulled-back lips and bared fangs during food or territory disputes.',
    ipa: 'ɢ̆ʀ̥ː',
    phoneticStages: [
      {
        label: 'Guttural Rumble Core',
        ipa: '[ɢ̆]',
        timePercent: 40,
        pitchHz: 120,
        formants: { f1: 280, f2: 700 },
        breathRatio: 0.35,
        description: 'Vocal tract narrowed in threatening posture.',
      },
      {
        label: 'Snarl Vibration',
        ipa: '[ʀ̥ː]',
        timePercent: 100,
        pitchHz: 140,
        formants: { f1: 320, f2: 850 },
        breathRatio: 0.4,
        description: 'Sub-harmonic throat oscillation asserting dominance.',
      },
    ],
    audioParams: {
      frequency: 130,
      waveform: 'sawtooth',
      duration: 1.2,
      attack: 0.1,
      decay: 0.15,
      sustain: 0.8,
      release: 0.3,
      glottalPuffRate: 20,
      realAudioFile: '/sounds/animals/cat/cat_angry_snarl.wav',
    },
  },
  {
    id: 'cat_yowl_fight',
    symbol: 'ᛃᐱᚢᛚ',
    name: 'The Yowl / Caterwaul (Territorial Standoff)',
    sound: 'yowl',
    animal: 'Cat',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Conflict & Defense',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Other Cats',
    primaryEmotion: 'Dominance / Mating Urge',
    meaning: 'In a fight: "I am dominant, back down!" In heat: "I am ready to mate, find me!"',
    category: 'Resonant Vocal Glide',
    intonation: 'Tremolo / Vibrato 〰️',
    description: 'Sustained, loud siren-like vocalization exchanged between outdoor cats facing off before physical combat.',
    ipa: 'jæʊːːl',
    phoneticStages: [
      {
        label: 'Strained Vocal Attack',
        ipa: '[jæ]',
        timePercent: 30,
        pitchHz: 440,
        formants: { f1: 650, f2: 1700 },
        breathRatio: 0.15,
        description: 'Maximal air pressure through tense larynx.',
      },
      {
        label: 'High-Energy Siren Core',
        ipa: '[æʊː]',
        timePercent: 80,
        pitchHz: 690,
        formants: { f1: 780, f2: 1450 },
        breathRatio: 0.1,
        description: 'Intense harmonic projection carrying hundreds of meters.',
      },
      {
        label: 'Exhausted Descent',
        ipa: '[l]',
        timePercent: 100,
        pitchHz: 310,
        formants: { f1: 390, f2: 950 },
        breathRatio: 0.2,
        description: 'Deep guttural closure as breath empties.',
      },
    ],
    audioParams: {
      frequency: 450,
      waveform: 'sawtooth',
      duration: 1.6,
      attack: 0.15,
      decay: 0.1,
      sustain: 0.85,
      release: 0.4,
      realAudioFile: '/sounds/animals/cat/virtual_vibes-cat-meow-sound-383823.mp3',
    },
  },
  {
    id: 'cat_shriek_pain',
    symbol: 'ᛊᚱᛁᚲ',
    name: 'The Shriek / Scream (Acute Pain & Terror)',
    sound: 'shriek',
    animal: 'Cat',
    lifeStage: 'All Life Stages',
    situation: 'Distress & Need',
    mouthMechanic: 'High-Intensity (Mouth Wide Open)',
    targetAudience: 'Opponent / Handler',
    primaryEmotion: 'Pain / Mortal Terror',
    meaning: 'Extreme sudden pain or mortal terror! (Tail stepped on or physical brawl).',
    category: 'Plosive & Guttural Burst',
    intonation: 'Explosive Burst 💥',
    description: 'High-amplitude piercing shriek emitted when in acute agony or trapped in physical combat.',
    ipa: 'ʃriːkʼ',
    phoneticStages: [
      {
        label: 'Sibilant Screech Burst',
        ipa: '[ʃr]',
        timePercent: 20,
        pitchHz: 1800,
        breathRatio: 0.4,
        description: 'Instantaneous high-gain acoustic burst.',
      },
      {
        label: 'Piercing Pain Peak',
        ipa: '[iːkʼ]',
        timePercent: 100,
        pitchHz: 2400,
        breathRatio: 0.2,
        description: 'Saturated high-frequency harmonic spike.',
      },
    ],
    audioParams: {
      frequency: 1900,
      waveform: 'sawtooth',
      duration: 0.7,
      attack: 0.01,
      decay: 0.06,
      sustain: 0.6,
      release: 0.2,
      noiseLevel: 0.5,
      realAudioFile: '/sounds/animals/cat/mixkit-little-cat-pain-meow-87.wav',
    },
  },

  // =================================================================
  // 🐱 CATS — PHASE 3: SENIOR YEARS (11+ Years)
  // =================================================================
  {
    id: 'cat_meow_grumpy',
    symbol: 'ᛗᚢᚷ',
    name: 'Low Grumpy Meow (Joint Ache Handling)',
    sound: 'grumpy',
    animal: 'Cat',
    lifeStage: 'Senior Years (10+ Yrs)',
    situation: 'Joint Stiffness & Handling',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Humans',
    primaryEmotion: 'Irritation / Joint Ache',
    meaning: '"Leave me alone, my joints ache." Aging cats protest being picked up or moved.',
    category: 'Resonant Vocal Glide',
    intonation: 'Falling ↘',
    description: 'Dull, low-pitched groan-like meow emitted by arthritic geriatric cats when physical handling causes stiffness.',
    ipa: 'mʊː.g',
    phoneticStages: [
      {
        label: 'Low Guttural Murmur',
        ipa: '[mʊː]',
        timePercent: 60,
        pitchHz: 290,
        formants: { f1: 340, f2: 850 },
        breathRatio: 0.15,
        description: 'Low-frequency complaint through stiffened vocal folds.',
      },
      {
        label: 'Weary Dropped Release',
        ipa: '[g]',
        timePercent: 100,
        pitchHz: 210,
        formants: { f1: 280, f2: 680 },
        breathRatio: 0.25,
        description: 'Vocal tract closes in weary, low grunt.',
      },
    ],
    audioParams: {
      frequency: 260,
      waveform: 'sawtooth',
      duration: 0.85,
      attack: 0.08,
      decay: 0.12,
      sustain: 0.7,
      release: 0.3,
      realAudioFile: '/sounds/animals/cat/cat_meow_grumpy.mp3',
    },
  },
  {
    id: 'cat_yowl_midnight',
    symbol: 'ᛃᚢᚢᛚ',
    name: 'Nighttime Yowl (Cognitive Disorientation)',
    sound: 'nightyowl',
    animal: 'Cat',
    lifeStage: 'Senior Years (10+ Yrs)',
    situation: 'Cognitive Disorientation',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'None (End of Life)',
    primaryEmotion: 'Disorientation / Dementia',
    meaning: '"Where am I? I\'m confused and lost in the dark." (Feline Cognitive Dysfunction).',
    category: 'Resonant Vocal Glide',
    intonation: 'Rise-Fall ↗↘',
    description: 'Loud, eerie midnight vocalization caused by feline dementia or sensory loss, waking owners at 3 AM.',
    ipa: 'jʊːːl',
    phoneticStages: [
      {
        label: 'Confused Open Call',
        ipa: '[jʊː]',
        timePercent: 50,
        pitchHz: 510,
        formants: { f1: 480, f2: 1100 },
        breathRatio: 0.15,
        description: 'Vocalized into empty dark space.',
      },
      {
        label: 'Trailing Lost Descent',
        ipa: '[l]',
        timePercent: 100,
        pitchHz: 320,
        formants: { f1: 350, f2: 780 },
        breathRatio: 0.2,
        description: 'Slow decay echoing in dark room.',
      },
    ],
    audioParams: {
      frequency: 440,
      waveform: 'sawtooth',
      duration: 1.5,
      attack: 0.15,
      decay: 0.15,
      sustain: 0.8,
      release: 0.45,
      realAudioFile: '/sounds/animals/cat/dragon-studio-meowing-cat-401728.mp3',
    },
  },

  // =================================================================
  // 🐕 DOGS — PHASE 1: PUPPYHOOD (Birth to 6 Months)
  // =================================================================
  {
    id: 'dog_whimper_puppy',
    symbol: 'ᚹᛁᛗ',
    name: 'The Whimper / Peep (Survival Distress)',
    sound: 'whimper',
    animal: 'Dog',
    lifeStage: 'Puppyhood (0-6 Mo)',
    situation: 'Distress & Need',
    mouthMechanic: 'Murmur (Mouth Closed)',
    targetAudience: 'Mother Dog',
    primaryEmotion: 'Discomfort / Cold',
    meaning: '"Help, I\'m uncomfortable, cold, or hungry!" Prompts mother to nurse or warm.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rising ↗',
    description: 'High-pitched instinctual peep produced by blind and deaf puppies during their first two weeks of life.',
    ipa: 'wĩː↗',
    phoneticStages: [
      {
        label: 'High Vocal Lip Murmur',
        ipa: '[wĩ]',
        timePercent: 40,
        pitchHz: 650,
        formants: { f1: 310, f2: 1900 },
        breathRatio: 0.1,
        description: 'Nasal air expulsion with soft lips closed.',
      },
      {
        label: 'Distress Squeak Glide',
        ipa: '[ĩː]',
        timePercent: 100,
        pitchHz: 890,
        formants: { f1: 270, f2: 2300 },
        breathRatio: 0.15,
        description: 'Pitch climbs to alert mother across whelping box.',
      },
    ],
    audioParams: {
      frequency: 680,
      waveform: 'sine',
      duration: 0.55,
      attack: 0.05,
      decay: 0.08,
      sustain: 0.75,
      release: 0.2,
      realAudioFile: '/sounds/animals/dog/dog_crying_distress.mp3',
    },
  },
  {
    id: 'dog_yelp_bite',
    symbol: 'ᛃᛖᛚ',
    name: 'The Yelp (Bite Inhibition "Ouch!")',
    sound: 'yelp',
    animal: 'Dog',
    lifeStage: 'Puppyhood (0-6 Mo)',
    situation: 'Distress & Need',
    mouthMechanic: 'High-Intensity (Mouth Wide Open)',
    targetAudience: 'Littermates',
    primaryEmotion: 'Pain / "Stop it!"',
    meaning: '"Ouch! That hurt! Stop biting!" Critical sound for puppies to learn jaw bite inhibition.',
    category: 'Plosive & Guttural Burst',
    intonation: 'Explosive Burst 💥',
    description: 'Very high, sharp acoustic scream emitted when play fighting becomes too painful. Instantly pauses sibling aggression.',
    ipa: 'jɛlpʼ',
    phoneticStages: [
      {
        label: 'Sudden Shockwave Pop',
        ipa: '[jɛ]',
        timePercent: 30,
        pitchHz: 1200,
        formants: { f1: 650, f2: 2100 },
        breathRatio: 0.2,
        description: 'Instantaneous glottal opening under sudden pain.',
      },
      {
        label: 'Piercing Yelp Cutoff',
        ipa: '[lpʼ]',
        timePercent: 100,
        pitchHz: 850,
        formants: { f1: 380, f2: 1200 },
        breathRatio: 0.1,
        description: 'Abrupt closure signaling bite inhibition.',
      },
    ],
    audioParams: {
      frequency: 980,
      waveform: 'sawtooth',
      duration: 0.28,
      attack: 0.008,
      decay: 0.04,
      sustain: 0.3,
      release: 0.08,
      realAudioFile: '/sounds/animals/dog/dog_yelp_pain.mp3',
    },
  },
  {
    id: 'dog_bark_play',
    symbol: 'ᛒᐱᚲ',
    name: 'The Play Bark (Staccato Joy)',
    sound: 'playbark',
    animal: 'Dog',
    lifeStage: 'Puppyhood (0-6 Mo)',
    situation: 'Hunting & Excitement',
    mouthMechanic: 'High-Intensity (Mouth Wide Open)',
    targetAudience: 'Siblings / Playmates',
    primaryEmotion: 'Playfulness / Joy',
    meaning: '"Look at me! Let\'s play!" High-pitched staccato barks discovering toys around 4-6 weeks.',
    category: 'Plosive & Guttural Burst',
    intonation: 'Explosive Burst 💥',
    description: 'Sharp, light-hearted bark accompanying play bows, tail wags, and wrestling with littermates.',
    ipa: 'b̥a.kʼ',
    phoneticStages: [
      {
        label: 'Light Plosive Burst',
        ipa: '[b̥]',
        timePercent: 25,
        pitchHz: 520,
        formants: { f1: 580, f2: 1400 },
        breathRatio: 0.2,
        description: 'Bouncy energetic chest release.',
      },
      {
        label: 'Crisp Playful Decay',
        ipa: '[a.kʼ]',
        timePercent: 100,
        pitchHz: 380,
        formants: { f1: 420, f2: 950 },
        breathRatio: 0.15,
        description: 'Fast cheerful transient pop.',
      },
    ],
    audioParams: {
      frequency: 440,
      waveform: 'sawtooth',
      duration: 0.22,
      attack: 0.01,
      decay: 0.05,
      sustain: 0.3,
      release: 0.06,
      realAudioFile: '/sounds/animals/dog/dog_bark_play.mp3',
    },
  },

  // =================================================================
  // 🐕 DOGS — PHASE 2: ADOLESCENCE & ADULTHOOD (6 Months to 9 Years)
  // =================================================================
  {
    id: 'dog_bark_continuous',
    symbol: 'ᛒᐱᚢ',
    name: 'The Rapid Continuous Bark (Territory Alert)',
    sound: 'bark',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Alarm & Territory',
    mouthMechanic: 'Pack Resonance (Oral Horn)',
    targetAudience: 'Pack / Intruders',
    primaryEmotion: 'Alarm / "Look out!"',
    meaning: '"Alert! Someone is approaching our territory! Pack assemble!"',
    category: 'Plosive & Guttural Burst',
    intonation: 'Explosive Burst 💥',
    description: 'Mid-pitch rapid continuous barking triggered by delivery drivers, footsteps, or perimeter breaches.',
    ipa: 'b̥aʊ̯',
    phoneticStages: [
      {
        label: 'Explosive Pressure Wave',
        ipa: '[b̥]',
        timePercent: 20,
        pitchHz: 420,
        formants: { f1: 650, f2: 1350 },
        breathRatio: 0.35,
        description: 'Diaphragm punches air through vocal cords.',
      },
      {
        label: 'Oral Horn Projection',
        ipa: '[aʊ̯]',
        timePercent: 100,
        pitchHz: 260,
        formants: { f1: 720, f2: 1150 },
        breathRatio: 0.25,
        description: 'Lips form directional megaphone projecting alarm across home.',
      },
    ],
    audioParams: {
      frequency: 320,
      waveform: 'sawtooth',
      duration: 0.38,
      attack: 0.01,
      decay: 0.08,
      sustain: 0.3,
      release: 0.12,
      realAudioFile: '/sounds/animals/dog/dog_bark_alert.mp3',
    },
  },
  {
    id: 'dog_growl_low',
    symbol: 'ᚷᚱᚢ',
    name: 'The Low-Pitch Growl (Defensive Warning)',
    sound: 'growl',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Conflict & Defense',
    mouthMechanic: 'Murmur (Mouth Closed)',
    targetAudience: 'Threat / Opponent',
    primaryEmotion: 'Warning / "Back away"',
    meaning: '"Back off. I am uncomfortable or angry, and I will defend myself."',
    category: 'Sub-harmonic & Glottal Flutter',
    intonation: 'Continuous Rumble ──',
    description: 'Sub-bass chest rumble produced with closed or barely parted mouth to de-escalate without initiating a fight.',
    ipa: 'ɢ̆ʀ̥ːː',
    phoneticStages: [
      {
        label: 'Posterior Vocal Occlusion',
        ipa: '[ɢ̆]',
        timePercent: 30,
        pitchHz: 85,
        formants: { f1: 210, f2: 620 },
        breathRatio: 0.3,
        description: 'Throat tightens creating deep resonance.',
      },
      {
        label: 'Chest Rumble Wave',
        ipa: '[ʀ̥ː]',
        timePercent: 100,
        pitchHz: 95,
        formants: { f1: 260, f2: 700 },
        breathRatio: 0.35,
        description: 'Vocal folds vibrate at sub-harmonics under sternum.',
      },
    ],
    audioParams: {
      frequency: 95,
      waveform: 'sawtooth',
      duration: 1.5,
      attack: 0.12,
      decay: 0.15,
      sustain: 0.85,
      release: 0.35,
      glottalPuffRate: 22,
      realAudioFile: '/sounds/animals/dog/dog_growl_snarl.mp3',
    },
  },
  {
    id: 'dog_bark_greeting',
    symbol: 'ᛒᚢᚪ',
    name: 'The Isolated Greeting Bark (Joyful Reunion)',
    sound: 'greeting',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Greeting & Attention',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Loved Human',
    primaryEmotion: 'Friendly Greeting / Joy',
    meaning: '"You\'re home! Yay!" Sharp upward-pitch bark accompanied by full-body tail wag.',
    category: 'Plosive & Guttural Burst',
    intonation: 'Rising ↗',
    description: 'Single, high-pitched welcoming pop emitted when an owner returns through the door after work.',
    ipa: 'bʊ́.a',
    phoneticStages: [
      {
        label: 'Joyful Pop Attack',
        ipa: '[bʊ́]',
        timePercent: 35,
        pitchHz: 510,
        formants: { f1: 450, f2: 1600 },
        breathRatio: 0.15,
        description: 'Upward jump in fundamental pitch.',
      },
      {
        label: 'Warm Tail Offglide',
        ipa: '[a]',
        timePercent: 100,
        pitchHz: 420,
        formants: { f1: 520, f2: 1250 },
        breathRatio: 0.1,
        description: 'Vocal tract settles into welcoming tail wag.',
      },
    ],
    audioParams: {
      frequency: 460,
      waveform: 'sawtooth',
      duration: 0.25,
      attack: 0.015,
      decay: 0.06,
      sustain: 0.4,
      release: 0.08,
      realAudioFile: '/sounds/animals/dog/dog_bark_greeting.mp3',
    },
  },
  {
    id: 'dog_whine_high',
    symbol: 'ᚹᛁᚾ',
    name: 'The High-Pitched Whine (Anticipation & Pleading)',
    sound: 'whine',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Greeting & Attention',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'Humans',
    primaryEmotion: 'Anxiety / Anticipation',
    meaning: '"I want that food right now," or "Please don\'t leave me behind."',
    category: 'Resonant Vocal Glide',
    intonation: 'Rising ↗',
    description: 'High-frequency nasal plea emitted while sitting by the dinner bowl, waiting at the door, or wanting in.',
    ipa: 'ĩːː↗',
    phoneticStages: [
      {
        label: 'Nasal Chamber Resonance',
        ipa: '[ĩ]',
        timePercent: 35,
        pitchHz: 720,
        formants: { f1: 290, f2: 2200 },
        breathRatio: 0.06,
        description: 'Channeled upward through nasal passages.',
      },
      {
        label: 'Emotional Upward Slide',
        ipa: '[ĩː↗]',
        timePercent: 100,
        pitchHz: 1050,
        formants: { f1: 260, f2: 2600 },
        breathRatio: 0.08,
        description: 'Tension peaks in poignant plea.',
      },
    ],
    audioParams: {
      frequency: 760,
      waveform: 'sine',
      duration: 0.95,
      attack: 0.1,
      decay: 0.08,
      sustain: 0.85,
      release: 0.25,
      realAudioFile: '/sounds/animals/dog/dog_crying_distress.mp3',
    },
  },
  {
    id: 'dog_sigh_pant',
    symbol: 'ᚺᚢᚠ',
    name: 'The Sigh / Groan (Relaxation Plop)',
    sound: 'sigh',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Comfort & Self-Soothing',
    mouthMechanic: 'Murmur (Mouth Closed)',
    targetAudience: 'Self / Pack',
    primaryEmotion: 'Relaxation / Contentment',
    meaning: '"Life is good, I am going to sleep now." Emitted when plopping onto bed after long walk.',
    category: 'Fricative & Breath Friction',
    intonation: 'Falling ↘',
    description: 'Audible exhalation through relaxed jowls marking transition to sleep and emotional security.',
    ipa: 'hʊf.hɛ',
    phoneticStages: [
      {
        label: 'Heavy Breath Release',
        ipa: '[hʊf]',
        timePercent: 50,
        pitchHz: 180,
        formants: { f1: 340, f2: 920 },
        breathRatio: 0.7,
        description: 'Deep pulmonary exhalation into mattress.',
      },
      {
        label: 'Settled Resting Whisper',
        ipa: '[hɛ]',
        timePercent: 100,
        pitchHz: 120,
        formants: { f1: 260, f2: 680 },
        breathRatio: 0.8,
        description: 'Full muscle relaxation release.',
      },
    ],
    audioParams: {
      frequency: 160,
      waveform: 'triangle',
      duration: 0.85,
      attack: 0.06,
      decay: 0.15,
      sustain: 0.5,
      release: 0.25,
      noiseLevel: 0.6,
      realAudioFile: '/sounds/animals/dog/dog_pant_tired.mp3',
    },
  },
  {
    id: 'dog_howl_long',
    symbol: 'ᚺᐱᚢᛚ',
    name: 'The Long Howl (Ancient Pack Locator)',
    sound: 'howl',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Pack & Distance Communication',
    mouthMechanic: 'Pack Resonance (Oral Horn)',
    targetAudience: 'Distance Pack',
    primaryEmotion: 'Pack Connection / Loneliness',
    meaning: '"I am here, where are you?" or joining sirens: "That siren sounds like a lonely dog!"',
    category: 'Resonant Vocal Glide',
    intonation: 'Rise-Fall ↗↘',
    description: 'Ancient wolf reflex designed to bridge miles of wilderness, coordinate hunting packs, and reply to acoustic sirens.',
    ipa: 'h̥aʊ̯ːːl',
    phoneticStages: [
      {
        label: 'Mouth Cone Elevation',
        ipa: '[h̥a]',
        timePercent: 25,
        pitchHz: 220,
        formants: { f1: 460, f2: 980 },
        breathRatio: 0.2,
        description: 'Snout aims at sky as pitch ascends.',
      },
      {
        label: 'Sustained Pack Siren',
        ipa: '[ʊ̯ː]',
        timePercent: 75,
        pitchHz: 480,
        formants: { f1: 390, f2: 850 },
        breathRatio: 0.08,
        description: 'Pure acoustic horn wave carrying across valleys.',
      },
      {
        label: 'Fading Tail Offglide',
        ipa: '[l]',
        timePercent: 100,
        pitchHz: 280,
        formants: { f1: 320, f2: 720 },
        breathRatio: 0.15,
        description: 'Lungs empty as pitch slowly slides down.',
      },
    ],
    audioParams: {
      frequency: 240,
      waveform: 'sine',
      duration: 2.5,
      attack: 0.35,
      decay: 0.1,
      sustain: 0.85,
      release: 0.7,
      realAudioFile: '/sounds/animals/dog/dog_howl_pack.mp3',
    },
  },
  {
    id: 'dog_baying',
    symbol: 'ᛒᛖᛃ',
    name: 'The Baying (Hound Scent Trail Call)',
    sound: 'baying',
    animal: 'Dog',
    lifeStage: 'Adolescence & Adulthood',
    situation: 'Pack & Distance Communication',
    mouthMechanic: 'Pack Resonance (Oral Horn)',
    targetAudience: 'Hunting Pack & Handler',
    primaryEmotion: 'Trailing Urge / Excitement',
    meaning: '"I found the scent trail! Follow me!" Deep, prolonged bark-howl mixture.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rise-Fall ↗↘',
    description: 'Signature acoustic signature of scent hounds (Beagles, Bloodhounds) echoing through dense brush while following animal scents.',
    ipa: 'b̥eː.jæʊ̯',
    phoneticStages: [
      {
        label: 'Chest Plosive Start',
        ipa: '[b̥e]',
        timePercent: 30,
        pitchHz: 360,
        formants: { f1: 520, f2: 1450 },
        breathRatio: 0.15,
        description: 'Head down over trail, bursts into vocal horn.',
      },
      {
        label: 'Prolonged Trail Howl',
        ipa: '[jæʊ̯]',
        timePercent: 100,
        pitchHz: 270,
        formants: { f1: 410, f2: 950 },
        breathRatio: 0.2,
        description: 'Deep resonant wail keeping hunting group aligned.',
      },
    ],
    audioParams: {
      frequency: 290,
      waveform: 'sawtooth',
      duration: 1.1,
      attack: 0.08,
      decay: 0.12,
      sustain: 0.75,
      release: 0.3,
      realAudioFile: '/sounds/animals/dog/dog_bark_distant.mp3',
    },
  },

  // =================================================================
  // 🐕 DOGS — PHASE 3: SENIOR YEARS (10+ Years)
  // =================================================================
  {
    id: 'dog_grunt_senior',
    symbol: 'ᚷᚱᚾ',
    name: 'The Grumpy Groan / Grunt (Arthritic Stiffness)',
    sound: 'grunt',
    animal: 'Dog',
    lifeStage: 'Senior Years (10+ Yrs)',
    situation: 'Joint Stiffness & Handling',
    mouthMechanic: 'Murmur (Mouth Closed)',
    targetAudience: 'Self / Handler',
    primaryEmotion: 'Joint Aches / Fatigue',
    meaning: '"Oof, my joints ache." Aging dogs grunt due to physical effort shifting positions.',
    category: 'Sub-harmonic & Glottal Flutter',
    intonation: 'Falling ↘',
    description: 'Low, gravelly grunt emitted when standing up from hardwood floors or curling into bed.',
    ipa: 'gʀ̥n̩',
    phoneticStages: [
      {
        label: 'Physical Exertion Start',
        ipa: '[g]',
        timePercent: 30,
        pitchHz: 140,
        formants: { f1: 260, f2: 680 },
        breathRatio: 0.35,
        description: 'Hips push upward against joint resistance.',
      },
      {
        label: 'Aspirated Release Grunt',
        ipa: '[ʀ̥n̩]',
        timePercent: 100,
        pitchHz: 95,
        formants: { f1: 210, f2: 520 },
        breathRatio: 0.45,
        description: 'Exhaled groan settling into rest.',
      },
    ],
    audioParams: {
      frequency: 110,
      waveform: 'sawtooth',
      duration: 0.65,
      attack: 0.04,
      decay: 0.1,
      sustain: 0.5,
      release: 0.2,
      noiseLevel: 0.4,
      realAudioFile: '/sounds/animals/dog/dog_pant_breath.mp3',
    },
  },
  {
    id: 'dog_midnight_bark',
    symbol: 'ᚺᚹᚾ',
    name: 'The Midnight Bark / Whine (Canine Dementia)',
    sound: 'midnightbark',
    animal: 'Dog',
    lifeStage: 'Senior Years (10+ Yrs)',
    situation: 'Cognitive Disorientation',
    mouthMechanic: 'Vowel (Mouth Open-to-Closed)',
    targetAudience: 'None (Self in the Dark)',
    primaryEmotion: 'Disorientation / Fear',
    meaning: '"Where am I? I\'m scared." Standing in dark corners staring at walls at 3:00 AM.',
    category: 'Resonant Vocal Glide',
    intonation: 'Rise-Fall ↗↘',
    description: 'Heart-wrenching call caused by Canine Cognitive Dysfunction (CCD), crying out for orientation in dark hallways.',
    ipa: 'hʌʊ̯.wĩ',
    phoneticStages: [
      {
        label: 'Startled Hollow Bark',
        ipa: '[hʌʊ̯]',
        timePercent: 45,
        pitchHz: 340,
        formants: { f1: 490, f2: 1100 },
        breathRatio: 0.25,
        description: 'Disoriented bark aimed at corner.',
      },
      {
        label: 'Lost Pleading Whimper',
        ipa: '[wĩ]',
        timePercent: 100,
        pitchHz: 480,
        formants: { f1: 320, f2: 1700 },
        breathRatio: 0.2,
        description: 'Trailing plea waiting for owner\'s footstep.',
      },
    ],
    audioParams: {
      frequency: 360,
      waveform: 'sawtooth',
      duration: 1.25,
      attack: 0.08,
      decay: 0.14,
      sustain: 0.7,
      release: 0.35,
      realAudioFile: '/sounds/animals/dog/dog_howl_senior.mp3',
    },
  },
  {
    id: 'dog_startle_bark',
    symbol: 'ᛒᚱᚲ',
    name: 'Startle Alarm Bark (Sensory Loss Reflex)',
    sound: 'startle',
    animal: 'Dog',
    lifeStage: 'Senior Years (10+ Yrs)',
    situation: 'Alarm & Territory',
    mouthMechanic: 'High-Intensity (Mouth Wide Open)',
    targetAudience: 'Surprise Entrant',
    primaryEmotion: 'Startle Reflex',
    meaning: '"Whoa! You startled me because I didn\'t hear or see you approach!"',
    category: 'Plosive & Guttural Burst',
    intonation: 'Explosive Burst 💥',
    description: 'Sudden, sharp alarm bark triggered when a family member touches or approaches an elderly dog whose vision/hearing has degraded.',
    ipa: 'b̥ʀa.kʼ',
    phoneticStages: [
      {
        label: 'Sudden Startle Jump',
        ipa: '[b̥ʀ]',
        timePercent: 30,
        pitchHz: 490,
        formants: { f1: 580, f2: 1350 },
        breathRatio: 0.3,
        description: 'Reflexive acoustic jolt.',
      },
      {
        label: 'Relief Recognition',
        ipa: '[a.kʼ]',
        timePercent: 100,
        pitchHz: 310,
        formants: { f1: 410, f2: 950 },
        breathRatio: 0.15,
        description: 'Immediate relaxation upon sniffing human scent.',
      },
    ],
    audioParams: {
      frequency: 380,
      waveform: 'sawtooth',
      duration: 0.26,
      attack: 0.01,
      decay: 0.05,
      sustain: 0.3,
      release: 0.08,
      realAudioFile: '/sounds/animals/dog/dog_bark_effect.mp3',
    },
  },
];

// ==========================================
// Stress & Intensity Modifiers
// ==========================================

export const STRESS_MODIFIERS: PawScriptStress[] = [
  { level: 'whisper', symbol: '̏', description: 'Whisper — secretive, stealthy, or cautious' },
  { level: 'soft', symbol: '̀', description: 'Soft — relaxed, gentle, or affectionate' },
  { level: 'neutral', symbol: '̄', description: 'Neutral — standard cross-species conversation' },
  { level: 'emphasized', symbol: '́', description: 'Emphasized — excited, alert, or calling out' },
  { level: 'loud', symbol: '̋', description: 'Very Loud — high alarm, territorial, or commanding' },
];

// ==========================================
// Duration & Length Modifiers
// ==========================================

export const DURATION_MODIFIERS: PawScriptDuration[] = [
  { level: 'short', symbol: '', description: 'Short burst — snappy transient clip' },
  { level: 'medium', symbol: 'ː', description: 'Sustained — standard breath length' },
  { level: 'long', symbol: 'ːː', description: 'Extended — drawn out acoustic glide' },
  { level: 'very-long', symbol: 'ːːː', description: 'Very Extended — majestic howl / marathon purr' },
];

// ==========================================
// Universal English-to-PawScript Phonetic System
// ==========================================

// 1. Canonical Situational Animal Sound Vocalizations
const SOUND_WORD_MAP: Record<string, string> = {
  // Multi-word phrases (matched first)
  'midnight bark': 'ᚺᚹᚾ',
  'night yowl': 'ᛃᚢᚢᛚ',
  'play bark': 'ᛒᐱᚲ',
  'greeting bark': 'ᛒᚢᚪ',
  'feed me': 'ᛗᛖᚢ',

  // Cats
  'meow': 'ᛗᛖᐱ',
  'meows': 'ᛗᛖᐱᛊ',
  'meowing': 'ᛗᛖᐱᛁᛝ',
  'meaow': 'ᛗᛖᐱ',
  'mew': 'ᛗᛁᛁ',
  'mews': 'ᛗᛁᛁᛊ',
  'mewing': 'ᛗᛁᛁᛁᛝ',
  'purr': 'ᚱᚱᚱ',
  'purrs': 'ᚱᚱᚱᛊ',
  'purring': 'ᚱᚱᚱ',
  'trill': 'ᛗᚱᚱ',
  'trills': 'ᛗᚱᚱᛊ',
  'chirrup': 'ᛗᚱᚱ',
  'begging': 'ᛗᛖᚢ',
  'hungry': 'ᛗᛖᚢ',
  'chatter': 'ᚲᚲᚲ',
  'chatters': 'ᚲᚲᚲᛊ',
  'chattering': 'ᚲᚲᚲ',
  'chitter': 'ᚲᚲᚲ',
  'chirek': 'ᚲᚲᚲ',
  'hiss': 'ᚺᛊᛊ',
  'hisses': 'ᚺᛊᛊ',
  'hissing': 'ᚺᛊᛊ',
  'spit': 'ᚺᛊᛊ',
  'spits': 'ᚺᛊᛊ',
  'growl': 'ᚷᚱᚱ',
  'growls': 'ᚷᚱᚱᛊ',
  'growling': 'ᚷᚱᚱ',
  'snarl': 'ᚷᚱᚱ',
  'snarls': 'ᚷᚱᚱᛊ',
  'yowl': 'ᛃᐱᚢᛚ',
  'yowls': 'ᛃᐱᚢᛚᛊ',
  'yowling': 'ᛃᐱᚢᛚ',
  'caterwaul': 'ᛃᐱᚢᛚ',
  'caterwauls': 'ᛃᐱᚢᛚᛊ',
  'shriek': 'ᛊᚱᛁᚲ',
  'scream': 'ᛊᚱᛁᚲ',
  'grumpy': 'ᛗᚢᚷ',

  // Dogs
  'bark': 'ᛒᐱᚢ',
  'barks': 'ᛒᐱᚢᛊ',
  'barking': 'ᛒᐱᚢᛁᛝ',
  'barked': 'ᛒᐱᚢᛏ',
  'bowwow': 'ᛒᐱᚢ',
  'woof': 'ᛒᐱᚢ',
  'woofs': 'ᛒᐱᚢᛊ',
  'boof': 'ᛒᚢᚠ',
  'yap': 'ᛃᚪᛈ',
  'yaps': 'ᛃᚪᛈᛊ',
  'whimper': 'ᚹᛁᛗ',
  'whimpers': 'ᚹᛁᛗᛊ',
  'whimpering': 'ᚹᛁᛗ',
  'peep': 'ᚹᛁᛗ',
  'yelp': 'ᛃᛖᛚ',
  'yelps': 'ᛃᛖᛚᛊ',
  'whine': 'ᚹᛁᚾ',
  'whines': 'ᚹᛁᚾᛊ',
  'whining': 'ᚹᛁᚾ',
  'sigh': 'ᚺᚢᚠ',
  'sighs': 'ᚺᚢᚠᛊ',
  'pant': 'ᚺᚢᚠ',
  'pants': 'ᚺᚢᚠᛊ',
  'panting': 'ᚺᚢᚠ',
  'groan': 'ᚺᚢᚠ',
  'groans': 'ᚺᚢᚠᛊ',
  'howl': 'ᚺᐱᚢᛚ',
  'howls': 'ᚺᐱᚢᛚᛊ',
  'howling': 'ᚺᐱᚢᛚ',
  'howled': 'ᚺᐱᚢᛚᛞ',
  'awoo': 'ᚺᐱᚢᛚ',
  'awoooo': 'ᚺᐱᚢᛚ',
  'awooooo': 'ᚺᐱᚢᛚ',
  'baying': 'ᛒᛖᛃ',
  'grunt': 'ᚷᚱᚾ',
  'startle': 'ᛒᚱᚲ',
};

// 2. High-Frequency English Vocabulary Phonetic Dictionary
const COMMON_ENGLISH_WORDS: Record<string, string> = {
  // Articles & Demonstratives
  'the': 'ᚦᛖ',
  'a': 'ᚪ',
  'an': 'ᚪᚾ',
  'this': 'ᚦᛁᛊ',
  'that': 'ᚦᚪᛏ',
  'these': 'ᚦᛁᛁᛉ',
  'those': 'ᚦᚩᛉ',

  // Conjunctions & Prepositions
  'and': 'ᚪᚾᛞ',
  'or': 'ᚩᚱ',
  'but': 'ᛒᚢᛏ',
  'if': 'ᛁᚠ',
  'because': 'ᛒᛁᚲᚩᛉ',
  'so': 'ᛊᚩ',
  'as': 'ᚪᛉ',
  'in': 'ᛁᚾ',
  'on': 'ᚩᚾ',
  'at': 'ᚪᛏ',
  'to': 'ᛏᚢ',
  'of': 'ᚩᚡ',
  'for': 'ᚠᚩᚱ',
  'from': 'ᚠᚱᚩᛗ',
  'with': 'ᚹᛁᚦ',
  'without': 'ᚹᛁᚦᚪᚢᛏ',
  'by': 'ᛒᚪᛁ',
  'into': 'ᛁᚾᛏᚢ',
  'over': 'ᚩᚡᛖᚱ',
  'under': 'ᚢᚾᛞᛖᚱ',
  'about': 'ᚪᛒᚪᚢᛏ',
  'after': 'ᚪᚠᛏᛖᚱ',
  'before': 'ᛒᛁᚠᚩᚱ',
  'between': 'ᛒᛁᛏᚹᛁᛁᚾ',
  'through': 'ᚦᚱᚢ',

  // Pronouns
  'i': 'ᚪᛁ',
  'me': 'ᛗᛁ',
  'my': 'ᛗᚪᛁ',
  'you': 'ᛃᚢ',
  'your': 'ᛃᚩᚱ',
  'he': 'ᚺᛁ',
  'him': 'ᚺᛁᛗ',
  'his': 'ᚺᛁᛉ',
  'she': 'ᛊᚺᛁ',
  'her': 'ᚺᚢᚱ',
  'it': 'ᛁᛏ',
  'its': 'ᛁᛏᛊ',
  'we': 'ᚹᛁ',
  'us': 'ᚢᛊ',
  'our': 'ᚪᚢᚱ',
  'they': 'ᚦᛖᛁ',
  'them': 'ᚦᛖᛗ',
  'their': 'ᚦᛖᚱ',

  // Auxiliary Verbs & State
  'is': 'ᛁᛉ',
  'am': 'ᚪᛗ',
  'are': 'ᚪᚱ',
  'was': 'ᚹᚩᛉ',
  'were': 'ᚹᛖᚱ',
  'be': 'ᛒᛁ',
  'been': 'ᛒᛁᚾ',
  'being': 'ᛒᛁᛁᛝ',
  'have': 'ᚺᚪᚡ',
  'has': 'ᚺᚪᛉ',
  'had': 'ᚺᚪᛞ',
  'do': 'ᛞᚢ',
  'does': 'ᛞᚢᛉ',
  'did': 'ᛞᛁᛞ',
  'done': 'ᛞᚢᚾ',
  'can': 'ᚲᚪᚾ',
  'could': 'ᚲᚢᛞ',
  'will': 'ᚹᛁᛚ',
  'would': 'ᚹᚢᛞ',
  'shall': 'ᛊᚺᚪᛚ',
  'should': 'ᛊᚺᚢᛞ',
  'may': 'ᛗᛖᛁ',
  'might': 'ᛗᚪᛁᛏ',
  'must': 'ᛗᚢᛊᛏ',

  // Common Verbs
  'say': 'ᛊᚪᛁ',
  'says': 'ᛊᛖᛉ',
  'said': 'ᛊᛖᛞ',
  'go': 'ᚷᚩ',
  'goes': 'ᚷᚩᛉ',
  'gone': 'ᚷᚩᚾ',
  'went': 'ᚹᛖᚾᛏ',
  'going': 'ᚷᚩᛁᛝ',
  'come': 'ᚲᚢᛗ',
  'comes': 'ᚲᚢᛗᛉ',
  'came': 'ᚲᛖᛁᛗ',
  'coming': 'ᚲᚢᛗᛁᛝ',
  'make': 'ᛗᛖᛁᚲ',
  'makes': 'ᛗᛖᛁᚲᛊ',
  'made': 'ᛗᛖᛁᛞ',
  'making': 'ᛗᛖᛁᚲᛁᛝ',
  'take': 'ᛏᛖᛁᚲ',
  'takes': 'ᛏᛖᛁᚲᛊ',
  'took': 'ᛏᚢᚲ',
  'get': 'ᚷᛖᛏ',
  'gets': 'ᚷᛖᛏᛊ',
  'got': 'ᚷᚩᛏ',
  'know': 'ᚾᚩ',
  'knows': 'ᚾᚩᛉ',
  'knew': 'ᚾᛃᚢ',
  'see': 'ᛊᛁᛁ',
  'sees': 'ᛊᛁᛁᛉ',
  'saw': 'ᛊᚩ',
  'seen': 'ᛊᛁᚾ',
  'seeing': 'ᛊᛁᛁᛁᛝ',
  'look': 'ᛚᚢᚲ',
  'looks': 'ᛚᚢᚲᛊ',
  'looking': 'ᛚᚢᚲᛁᛝ',
  'think': 'ᚦᛁᛝᚲ',
  'give': 'ᚷᛁᚡ',
  'gives': 'ᚷᛁᚡᛉ',
  'gave': 'ᚷᛖᛁᚡ',
  'given': 'ᚷᛁᚡᛖᚾ',
  'help': 'ᚺᛖᛚᛈ',
  'helps': 'ᚺᛖᛚᛈᛊ',
  'want': 'ᚹᚩᚾᛏ',
  'wants': 'ᚹᚩᚾᛏᛊ',
  'need': 'ᚾᛁᛁᛞ',
  'needs': 'ᚾᛁᛁᛞᛉ',
  'feel': 'ᚠᛁᛁᛚ',
  'feels': 'ᚠᛁᛁᛚᛉ',
  'hear': 'ᚺᛁᚱ',
  'hears': 'ᚺᛁᚱᛉ',
  'heard': 'ᚺᚢᚱᛞ',
  'hearing': 'ᚺᛁᚱᛁᛝ',
  'listen': 'ᛚᛁᛊᛖᚾ',
  'listening': 'ᛚᛁᛊᛖᚾᛁᛝ',
  'talk': 'ᛏᚩᚲ',
  'talking': 'ᛏᚩᚲᛁᛝ',
  'speak': 'ᛊᛈᛁᛁᚲ',
  'speaking': 'ᛊᛈᛁᛁᚲᛁᛝ',
  'tell': 'ᛏᛖᛚ',
  'smell': 'ᛊᛗᛖᛚ',
  'smells': 'ᛊᛗᛖᛚᛉ',
  'love': 'ᛚᚢᚡ',
  'loves': 'ᛚᚢᚡᛉ',
  'loved': 'ᛚᚢᚡᛞ',
  'like': 'ᛚᚪᛁᚲ',
  'likes': 'ᛚᚪᛁᚲᛊ',
  'liked': 'ᛚᚪᛁᚲᛏ',
  'play': 'ᛈᛚᚪᛁ',
  'plays': 'ᛈᛚᚪᛁᛉ',
  'playing': 'ᛈᛚᚪᛁᛁᛝ',
  'played': 'ᛈᛚᚪᛁᛞ',
  'run': 'ᚱᚢᚾ',
  'runs': 'ᚱᚢᚾᛉ',
  'running': 'ᚱᚢᚾᛁᛝ',
  'walk': 'ᚹᚪᚲ',
  'walks': 'ᚹᚪᚲᛊ',
  'walking': 'ᚹᚪᚲᛁᛝ',
  'sleep': 'ᛊᛚᛁᛁᛈ',
  'sleeps': 'ᛊᛚᛁᛁᛈᛊ',
  'sleeping': 'ᛊᛚᛁᛁᛈᛁᛝ',
  'eat': 'ᛁᛁᛏ',
  'eating': 'ᛁᛁᛏᛁᛝ',
  'drink': 'ᛞᚱᛁᛝᚲ',
  'drinking': 'ᛞᚱᛁᛝᚲᛁᛝ',
  'type': 'ᛏᚪᛁᛈ',
  'typed': 'ᛏᚪᛁᛈᛏ',
  'typing': 'ᛏᚪᛁᛈᛁᛝ',
  'translate': 'ᛏᚱᚪᚾᛊᛚᛖᛁᛏ',
  'translated': 'ᛏᚱᚪᚾᛊᛚᛖᛁᛏᛖᛞ',
  'translating': 'ᛏᚱᚪᚾᛊᛚᛖᛁᛏᛁᛝ',

  // Animals & Pets
  'cat': 'ᚲᚪᛏ',
  'cats': 'ᚲᚪᛏᛊ',
  'dog': 'ᛞᚩᚷ',
  'dogs': 'ᛞᚩᚷᛊ',
  'puppy': 'ᛈᚢᛈᛁ',
  'puppies': 'ᛈᚢᛈᛁᛉ',
  'kitten': 'ᚲᛁᛏᛖᚾ',
  'kittens': 'ᚲᛁᛏᛖᚾᛉ',
  'pet': 'ᛈᛖᛏ',
  'pets': 'ᛈᛖᛏᛊ',
  'animal': 'ᚪᚾᛁᛗᚪᛚ',
  'animals': 'ᚪᚾᛁᛗᚪᛚᛉ',
  'human': 'ᚺᛃᚢᛗᚪᚾ',
  'humans': 'ᚺᛃᚢᛗᚪᚾᛉ',
  'friend': 'ᚠᚱᛖᚾᛞ',
  'friends': 'ᚠᚱᛖᚾᛞᛊ',
  'family': 'ᚠᚪᛗᛁᛚᛁ',
  'pack': 'ᛈᚪᚲ',

  // Body & Anatomy
  'paw': 'ᛈᚩ',
  'paws': 'ᛈᚩᛉ',
  'pawscript': 'ᛈᚩᛊᚲᚱᛁᛈᛏ',
  'tail': 'ᛏᚪᛁᛚ',
  'tails': 'ᛏᚪᛁᛚᛉ',
  'ear': 'ᛁᚱ',
  'ears': 'ᛁᚱᛉ',
  'eye': 'ᚪᛁ',
  'eyes': 'ᚪᛁᛉ',
  'nose': 'ᚾᚩᛉ',
  'mouth': 'ᛗᚪᚢᚦ',
  'fur': 'ᚠᚢᚱ',
  'voice': 'ᚡᚩᛁᛊ',
  'voices': 'ᚡᚩᛁᛊᛖᛉ',
  'sound': 'ᛊᚪᚢᚾᛞ',
  'sounds': 'ᛊᚪᚢᚾᛞᛊ',
  'language': 'ᛚᚪᛝᚷᚹᛁᛞᛊ',
  'phonetic': 'ᚠᚩᚾᛖᛏᛁᚲ',
  'phonetics': 'ᚠᚩᚾᛖᛏᛁᚲᛊ',
  'notation': 'ᚾᚩᛏᛖᛁᛊᚺᚢᚾ',
  'section': 'ᛊᛖᚲᛊᚺᚢᚾ',
  'translator': 'ᛏᚱᚪᚾᛊᛚᛖᛁᛏᚩᚱ',

  // Environment & Objects
  'park': 'ᛈᚪᚱᚲ',
  'ball': 'ᛒᚩᛚ',
  'balls': 'ᛒᚩᛚᛉ',
  'treat': 'ᛏᚱᛁᛁᛏ',
  'treats': 'ᛏᚱᛁᛁᛏᛊ',
  'food': 'ᚠᚢᚢᛞ',
  'water': 'ᚹᚪᛏᛖᚱ',
  'bone': 'ᛒᚩᚾ',
  'bones': 'ᛒᚩᚾᛉ',
  'fish': 'ᚠᛁᛊᚺ',
  'window': 'ᚹᛁᚾᛞᚩ',
  'home': 'ᚺᚩᛗ',
  'house': 'ᚺᚪᚢᛊ',
  'room': 'ᚱᚢᚢᛗ',
  'bed': 'ᛒᛖᛞ',
  'sun': 'ᛊᚢᚾ',
  'day': 'ᛞᚪᛁ',
  'days': 'ᛞᚪᛁᛉ',
  'night': 'ᚾᚪᛁᛏ',
  'morning': 'ᛗᚩᚱᚾᛁᛝ',
  'evening': 'ᛁᛁᚡᚾᛁᛝ',
  'world': 'ᚹᚢᚱᛚᛞ',
  'life': 'ᛚᚪᛁᚠ',
  'time': 'ᛏᚪᛁᛗ',

  // Adjectives & Modifiers
  'good': 'ᚷᚢᛞ',
  'bad': 'ᛒᚪᛞ',
  'happy': 'ᚺᚪᛈᛁ',
  'sad': 'ᛊᚪᛞ',
  'big': 'ᛒᛁᚷ',
  'small': 'ᛊᛗᚩᛚ',
  'little': 'ᛚᛁᛏᛚ',
  'tiny': 'ᛏᚪᛁᚾᛁ',
  'huge': 'ᚺᛃᚢᛞᛊ',
  'loud': 'ᛚᚪᚢᛞ',
  'quiet': 'ᚲᚹᚪᛁᛖᛏ',
  'soft': 'ᛊᚩᚠᛏ',
  'warm': 'ᚹᚩᚱᛗ',
  'cold': 'ᚲᚩᛚᛞ',
  'fast': 'ᚠᚪᛊᛏ',
  'slow': 'ᛊᛚᚩ',
  'great': 'ᚷᚱᛖᛁᛏ',
  'best': 'ᛒᛖᛊᛏ',
  'very': 'ᚡᛖᚱᛁ',
  'much': 'ᛗᚢᛏᛊ',
  'many': 'ᛗᛖᚾᛁ',
  'more': 'ᛗᚩᚱ',
  'all': 'ᚩᛚ',
  'every': 'ᛖᚡᚱᛁ',
  'everything': 'ᛖᚡᚱᛁᚦᛁᛝ',
  'everyone': 'ᛖᚡᚱᛁᚹᚢᚾ',
  'some': 'ᛊᚢᛗ',
  'something': 'ᛊᚢᛗᚦᛁᛝ',
  'someone': 'ᛊᚢᛗᚹᚢᚾ',
  'no': 'ᚾᚩ',
  'not': 'ᚾᚩᛏ',
  'nothing': 'ᚾᚢᚦᛁᛝ',
  'other': 'ᚢᚦᛖᚱ',
  'others': 'ᚢᚦᛖᚱᛉ',
  'only': 'ᚩᚾᛚᛁ',
  'just': 'ᛞᛊᚢᛊᛏ',
  'whatever': 'ᚹᚪᛏᛖᚡᛖᚱ',
  'whenever': 'ᚹᛖᚾᛖᚡᛖᚱ',
  'wherever': 'ᚹᛖᚱᛖᚡᛖᚱ',
  'always': 'ᚩᛚᚹᛖᛁᛉ',
  'never': 'ᚾᛖᚡᛖᚱ',
  'often': 'ᚩᚠᛖᚾ',
  'sometimes': 'ᛊᚢᛗᛏᚪᛁᛗᛉ',
  'now': 'ᚾᚪᚢ',
  'here': 'ᚺᛁᚱ',
  'there': 'ᚦᛖᚱ',
  'today': 'ᛏᚢᛞᚪᛁ',
  'tonight': 'ᛏᚢᚾᚪᛁᛏ',
  'tomorrow': 'ᛏᚢᛗᚩᚱᚩ',
  'yesterday': 'ᛃᛖᛊᛏᛖᚱᛞᚪᛁ',
  'again': 'ᚪᚷᛖᚾ',
  'soon': 'ᛊᚢᚢᚾ',

  // Conversational
  'hello': 'ᚺᛖᛚᚩ',
  'hi': 'ᚺᚪᛁ',
  'hey': 'ᚺᛖᛃ',
  'yes': 'ᛃᛖᛊ',
  'yeah': 'ᛃᛖᚪ',
  'please': 'ᛈᛚᛁᛁᛉ',
  'thank': 'ᚦᚪᛝᚲ',
  'thanks': 'ᚦᚪᛝᚲᛊ',
  'welcome': 'ᚹᛖᛚᚲᚢᛗ',
  'bye': 'ᛒᚪᛁ',
  'goodbye': 'ᚷᚢᛞᛒᚪᛁ',

  // Contractions
  "don't": 'ᛞᚩᚾᛏ',
  "can't": 'ᚲᚪᚾᛏ',
  "won't": 'ᚹᚩᚾᛏ',
  "i'm": 'ᚪᛁᛗ',
  "you're": 'ᛃᚩᚱ',
  "it's": 'ᛁᛏᛊ',
  "we're": 'ᚹᛁᚱ',
  "they're": 'ᚦᛖᛁᚱ',
  "that's": 'ᚦᚪᛏᛊ',
  "what's": 'ᚹᚪᛏᛊ',
  "there's": 'ᚦᛖᚱᛉ',
  "let's": 'ᛚᛖᛏᛊ',
  'dont': 'ᛞᚩᚾᛏ',
  'cant': 'ᚲᚪᚾᛏ',
  'wont': 'ᚹᚩᚾᛏ',
  'im': 'ᚪᛁᛗ',
  'youre': 'ᛃᚩᚱ',
  'theyre': 'ᚦᛖᛁᚱ',
  'thats': 'ᚦᚪᛏᛊ',
  'whats': 'ᚹᚪᛏᛊ',
  'theres': 'ᚦᛖᚱᛉ',
  'lets': 'ᛚᛖᛏᛊ',
};

// 3. Phonetic Clusters (Longest Matching Greedy Graphemes)
const PHONETIC_CLUSTERS: [string, string][] = [
  // 4-letter clusters
  ['tion', 'ᛊᚺᚢᚾ'],
  ['sion', 'ᛊᚺᚢᚾ'],
  ['ough', 'ᚪᚢ'],
  ['ight', 'ᚪᛁᛏ'],
  ['eigh', 'ᛖᛁ'],

  // 3-letter clusters
  ['tch', 'ᛏᛊ'],
  ['igh', 'ᚪᛁ'],
  ['ing', 'ᛁᛝ'],
  ['all', 'ᚩᛚ'],
  ['alk', 'ᚩᚲ'],
  ['air', 'ᛖᚱ'],
  ['ear', 'ᛁᚱ'],
  ['ore', 'ᚩᚱ'],
  ['ure', 'ᛃᚢᚱ'],

  // 2-letter digraphs
  ['ch', 'ᛏᛊ'],
  ['sh', 'ᛊᚺ'],
  ['th', 'ᚦ'],
  ['ph', 'ᚠ'],
  ['wh', 'ᚹ'],
  ['ck', 'ᚲ'],
  ['ng', 'ᛝ'],
  ['nk', 'ᛝᚲ'],
  ['qu', 'ᚲᚹ'],
  ['ea', 'ᛁᛁ'],
  ['ee', 'ᛁᛁ'],
  ['oo', 'ᚢᚢ'],
  ['ou', 'ᚪᚢ'],
  ['ow', 'ᚪᚢ'],
  ['ai', 'ᚪᛁ'],
  ['ay', 'ᚪᛁ'],
  ['ei', 'ᛖᛁ'],
  ['ey', 'ᛁ'],
  ['oi', 'ᚩᛁ'],
  ['oy', 'ᚩᛁ'],
  ['au', 'ᚪᚢ'],
  ['aw', 'ᚪᚢ'],
  ['er', 'ᛖᚱ'],
  ['ar', 'ᚪᚱ'],
  ['or', 'ᚩᚱ'],
  ['ur', 'ᚢᚱ'],
  ['ir', 'ᚢᚱ'],
];

// 4. Individual Phonetic Letters & Numbers
const PHONETIC_LETTERS: Record<string, string> = {
  'a': 'ᚪ',
  'b': 'ᛒ',
  'c': 'ᚲ',
  'd': 'ᛞ',
  'e': 'ᛖ',
  'f': 'ᚠ',
  'g': 'ᚷ',
  'h': 'ᚺ',
  'i': 'ᛁ',
  'j': 'ᛞᛊ',
  'k': 'ᚲ',
  'l': 'ᛚ',
  'm': 'ᛗ',
  'n': 'ᚾ',
  'o': 'ᚩ',
  'p': 'ᛈ',
  'q': 'ᚲ',
  'r': 'ᚱ',
  's': 'ᛊ',
  't': 'ᛏ',
  'u': 'ᚢ',
  'v': 'ᚡ',
  'w': 'ᚹ',
  'x': 'ᚲᛊ',
  'y': 'ᛃ',
  'z': 'ᛉ',
  '0': 'ᛉᛁᚱᚩ',
  '1': 'ᚹᚢᚾ',
  '2': 'ᛏᚢ',
  '3': 'ᚦᚱᛁ',
  '4': 'ᚠᚩᚱ',
  '5': 'ᚠᚪᛁᚡ',
  '6': 'ᛊᛁᚲᛊ',
  '7': 'ᛊᛖᚡᛖᚾ',
  '8': 'ᛖᛁᛏ',
  '9': 'ᚾᚪᛁᚾ',
};

/**
 * Phonetically translate any single arbitrary English word into PawScript runes
 */
export function phoneticallyTranslateWord(word: string): string {
  const lower = word.toLowerCase();

  // 1. Check sound word map
  if (SOUND_WORD_MAP[lower]) {
    return SOUND_WORD_MAP[lower];
  }

  // 2. Check common English words
  if (COMMON_ENGLISH_WORDS[lower]) {
    return COMMON_ENGLISH_WORDS[lower];
  }

  // 3. Universal Grapheme-to-Rune decomposition
  let result = '';
  let i = 0;
  while (i < lower.length) {
    let matched = false;

    // Check digraphs & clusters
    for (const [cluster, rune] of PHONETIC_CLUSTERS) {
      if (lower.startsWith(cluster, i)) {
        result += rune;
        i += cluster.length;
        matched = true;
        break;
      }
    }

    if (matched) continue;

    const char = lower[i];
    if (PHONETIC_LETTERS[char]) {
      // Soft c before e, i, y
      if (char === 'c' && i + 1 < lower.length && ['e', 'i', 'y'].includes(lower[i + 1])) {
        result += 'ᛊ';
      }
      // Word-ending y sounds like ee [i]
      else if (char === 'y' && i === lower.length - 1 && lower.length > 1) {
        result += 'ᛁ';
      }
      // Silent e at end of word after consonant
      else if (char === 'e' && i === lower.length - 1 && lower.length > 2) {
        // e is usually silent in English (e.g. bite, make, hate)
      } else {
        result += PHONETIC_LETTERS[char];
      }
      i += 1;
    } else {
      // Preserve symbols like apostrophe, hyphen, etc.
      result += char;
      i += 1;
    }
  }

  return result || word;
}

// Build Reverse lookup table: PawScript symbols → English
const PAWSCRIPT_REVERSE_MAP: Record<string, string> = {};
// Add sound words first
Object.entries(SOUND_WORD_MAP).forEach(([eng, ps]) => {
  if (!PAWSCRIPT_REVERSE_MAP[ps]) {
    PAWSCRIPT_REVERSE_MAP[ps] = eng;
  }
});
// Add common English words
Object.entries(COMMON_ENGLISH_WORDS).forEach(([eng, ps]) => {
  if (!PAWSCRIPT_REVERSE_MAP[ps]) {
    PAWSCRIPT_REVERSE_MAP[ps] = eng;
  }
});

/**
 * Translate English text into PawScript phonetic notation.
 * Every word, sound, and syllable is completely translated into PawScript runes.
 */
export function translateToPawScript(text: string): string {
  if (!text) return '';

  // 1. Replace multi-word sound phrases first
  let processed = text;
  const multiWordSoundKeys = Object.keys(SOUND_WORD_MAP)
    .filter((k) => k.includes(' '))
    .sort((a, b) => b.length - a.length);

  for (const phrase of multiWordSoundKeys) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    processed = processed.replace(regex, SOUND_WORD_MAP[phrase]);
  }

  // 2. Tokenize by words and punctuation/whitespace
  const tokens = processed.split(/(\s+|[.,!?;:'"()[\]{}—–\-_/\\<>@#$%^&*+=~`|])/g);

  return tokens
    .map((tok) => {
      if (!tok) return '';
      // Preserve whitespace and punctuation as-is
      if (/^[\s.,!?;:'"()[\]{}—–\-_/\\<>@#$%^&*+=~`|]+$/.test(tok)) {
        return tok;
      }
      // If token already has PawScript runic glyphs from phrase replacement
      if (/[\u16A0-\u16FF]/.test(tok)) {
        return tok;
      }
      // Phonetically translate the English word
      return phoneticallyTranslateWord(tok);
    })
    .join('');
}

/**
 * Translate PawScript notation back to English sound descriptors
 */
export function translateFromPawScript(text: string): string {
  if (!text) return '';
  let result = text;
  const sortedRunes = Object.keys(PAWSCRIPT_REVERSE_MAP).sort((a, b) => b.length - a.length);

  for (const ps of sortedRunes) {
    result = result.split(ps).join(PAWSCRIPT_REVERSE_MAP[ps]);
  }
  return result;
}

/**
 * Apply stress modifier to a PawScript symbol
 */
export function applyStress(symbol: string, level: StressLevel): string {
  const stress = STRESS_MODIFIERS.find((s) => s.level === level);
  if (!stress) return symbol;
  return symbol + stress.symbol;
}

/**
 * Apply duration modifier to a PawScript symbol
 */
export function applyDuration(symbol: string, level: DurationLevel): string {
  const duration = DURATION_MODIFIERS.find((d) => d.level === level);
  if (!duration) return symbol;
  return symbol + duration.symbol;
}

/**
 * Get animal emoji icon for species
 */
export function getAnimalEmoji(species: string): string {
  const emojiMap: Record<string, string> = {
    'Cat': '🐱',
    'Dog': '🐕',
    'Human': '👤',
  };
  return emojiMap[species] || '🐾';
}

/**
 * Get reaction emoji
 */
export function getReactionEmoji(type: string): string {
  const reactionMap: Record<string, string> = {
    'paw': '🐾',
    'bone': '🦴',
    'fish': '🐟',
    'feather': '🪶',
    'zoomies': '💨',
    'laugh': '😹',
  };
  return reactionMap[type] || '🐾';
}

/**
 * Get characters by animal species
 */
export function getCharactersByAnimal(animal: string): PawScriptCharacter[] {
  return PAWSCRIPT_ALPHABET.filter((c) => c.animal.toLowerCase() === animal.toLowerCase());
}

/**
 * Get characters by life stage
 */
export function getCharactersByLifeStage(stage: LifeStage): PawScriptCharacter[] {
  return PAWSCRIPT_ALPHABET.filter((c) => c.lifeStage === stage || c.lifeStage === 'All Life Stages');
}

/**
 * Get characters by situation
 */
export function getCharactersBySituation(situation: VocalSituation): PawScriptCharacter[] {
  return PAWSCRIPT_ALPHABET.filter((c) => c.situation === situation);
}

/**
 * Look up character by its symbol
 */
export function getCharacterBySymbol(symbol: string): PawScriptCharacter | undefined {
  return PAWSCRIPT_ALPHABET.find((c) => c.symbol === symbol);
}
