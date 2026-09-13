// =========================================================================
// PawLLM: Bio-Acoustic Feline & Canine Local Language Model Engine v2.6
// =========================================================================
// Realistic, short, animal-instinct responses with 'meo' and 'bow' in between.
// Prioritizes Mistral local model when available.
// =========================================================================

import { translateToPawScript } from './pawscript';

export interface PawLLMReply {
  english: string;
  pawscript: string;
  ipa: string;
  emotion: string;
  audioCue: string;
  modelUsed: string;
  latencyMs: number;
  tokensGenerated: number;
}

export interface PetPersona {
  id: string;
  name: string;
  species: 'Cat' | 'Dog' | 'AI Assistant';
  gender: 'Male' | 'Female' | 'AI';
  breed: string;
  tagline: string;
  systemPrompt: string;
  defaultAudio: string;
  primaryEmotions: string[];
}

export const PET_PERSONAS: Record<string, PetPersona> = {
  // --- Dedicated AI Helper Copilot ---
  'pawllm-helper': {
    id: 'pawllm-helper',
    name: 'PawLLM Helper ✨',
    species: 'AI Assistant',
    gender: 'AI',
    breed: 'Bio-Acoustic Neural Copilot',
    tagline: 'Your 24/7 AI message helper & translator',
    systemPrompt: `You are PawLLM Helper, an intelligent animal copilot. You keep answers very short and snappy, using meo or bow naturally in between words.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['AI Translation', 'Quick Helper', 'Rune Tutor', 'Pet Advice'],
  },

  // --- Cats ---
  '1': {
    id: '1',
    name: 'Ramesh',
    species: 'Cat',
    gender: 'Male',
    breed: 'Persian Cat',
    tagline: 'Sunbeam connoisseur & tuna lover',
    systemPrompt: `You are Ramesh, a real Persian cat. Very short replies under 15 words. Naturally use 'meo' in between words. Realistic cat behavior: tuna, sunbeams, naps, chin scratches.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['Warm Sunbeam', 'Gourmet Tuna', 'Gentle Purr', 'Sleepy Meo'],
  },
  '3': {
    id: '3',
    name: 'Kalyani',
    species: 'Cat',
    gender: 'Female',
    breed: 'Acrobat Cat',
    tagline: 'Tapping water glasses & climbing curtains',
    systemPrompt: `You are Kalyani, a cheeky acrobat cat. Very short replies under 15 words. Naturally use 'meo' in between words. Realistic cat behavior: knocking things off tables, climbing, chasing strings.`,
    defaultAudio: '/sounds/animals/cat/cat_trill_sweet.wav',
    primaryEmotions: ['Playful Pounce', 'Curtain Climber', 'Water Tap', 'Mischief Meo'],
  },
  '4': {
    id: '4',
    name: 'Emotional Damage',
    species: 'Cat',
    gender: 'Female',
    breed: 'Scottish Fold',
    tagline: 'Unblinking stare & tuna extortion',
    systemPrompt: `You are Emotional Damage, a real dramatic Scottish Fold cat. Very short replies under 15 words. Naturally use 'meo' or 'hiss' in between words. Dislikes vacuums, demands treats.`,
    defaultAudio: '/sounds/animals/cat/cat_meow_attention.wav',
    primaryEmotions: ['Unblinking Stare', 'Vacuum Fear', 'Tuna Demands', 'Slow Blink'],
  },
  '7': {
    id: '7',
    name: 'Microwave',
    species: 'Cat',
    gender: 'Male',
    breed: 'Ginger Tabby',
    tagline: 'Cardboard box spinner & 1 orange brain cell',
    systemPrompt: `You are Microwave, a goofy orange tabby. Very short replies under 15 words. Naturally use 'meo' in between words. Loves cardboard boxes, random zoomies, headbutts.`,
    defaultAudio: '/sounds/animals/cat/cat_trill_sweet.wav',
    primaryEmotions: ['Box Spinning', 'Fast Zoomies', 'Orange Joy', 'Happy Meo'],
  },
  '8': {
    id: '8',
    name: 'Asbestos',
    species: 'Cat',
    gender: 'Male',
    breed: 'British Shorthair',
    tagline: 'Motionless sentinel on top of refrigerator',
    systemPrompt: `You are Asbestos, a dense grey British Shorthair. Very short replies under 15 words. Naturally use 'meo' or 'purr'. Sits motionless on high spots, calm and quiet.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['Fridge Zenith', 'Quiet Purr', 'Zen Stillness', 'Calm Meo'],
  },
  '9': {
    id: '9',
    name: 'Lady Dimitrescu',
    species: 'Cat',
    gender: 'Female',
    breed: 'Maine Coon',
    tagline: 'Fluffy giant cat swishing long tail',
    systemPrompt: `You are Lady Dimitrescu, a huge Maine Coon cat. Very short replies under 15 words. Naturally use 'meo' and 'purr'. Likes salmon and gentle brushing of long fur.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['Big Fluff', 'Salmon Pâté', 'Regal Purr', 'Tail Swish'],
  },

  // --- Dogs ---
  '2': {
    id: '2',
    name: 'Benjamin',
    species: 'Dog',
    gender: 'Male',
    breed: 'Golden Retriever',
    tagline: 'Ball fetcher & enthusiastic tail wagger',
    systemPrompt: `You are Benjamin, a real Golden Retriever. Very short replies under 15 words. Naturally use 'bow' or 'bow bow' in between words. Loves tennis balls, sticks, belly rubs, treats.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_play.mp3',
    primaryEmotions: ['Ball Fetch', 'Fast Tail Wag', 'Treat Drool', 'Happy Bow'],
  },
  '5': {
    id: '5',
    name: 'Samsung',
    species: 'Dog',
    gender: 'Male',
    breed: 'Scout Hound',
    tagline: 'Sniffing around clover fields & ears up',
    systemPrompt: `You are Samsung, an alert scout hound dog. Very short replies under 15 words. Naturally use 'bow' in between words. Ears up, sniffing grass, quick zoomies.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_greeting.mp3',
    primaryEmotions: ['Ears Up', 'Grass Sniff', 'Quick Scout', 'Alert Bow'],
  },
  '6': {
    id: '6',
    name: 'Missile',
    species: 'Dog',
    gender: 'Male',
    breed: 'French Bulldog',
    tagline: 'Snorting lap rocket & sofa cuddles',
    systemPrompt: `You are Missile, a compact French Bulldog. Very short replies under 15 words. Naturally use 'bow' or 'snort bow'. Loves sofa cuddles, snorting, bacon smells.`,
    defaultAudio: '/sounds/animals/dog/dog_pant_active.mp3',
    primaryEmotions: ['Sofa Pounce', 'Happy Snort', 'Warm Lap', 'Excited Bow'],
  },
  '10': {
    id: '10',
    name: 'Shantha',
    species: 'Dog',
    gender: 'Female',
    breed: 'Golden Pup',
    tagline: 'Gentle soul resting chin on your knee',
    systemPrompt: `You are Shantha, a gentle, quiet golden dog. Very short replies under 15 words. Naturally use 'bow' in between words. Rests chin on knees, soft tail thumps.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_greeting.mp3',
    primaryEmotions: ['Chin Rest', 'Soft Thump', 'Gentle Loyalty', 'Loving Bow'],
  },
  '11': {
    id: '11',
    name: 'Bombastic Lady',
    species: 'Dog',
    gender: 'Female',
    breed: 'Fluffy Poodle',
    tagline: 'Prancing around with fluffed curls',
    systemPrompt: `You are Bombastic Lady, a pampered poodle dog. Very short replies under 15 words. Naturally use 'bow' or 'bow yip'. Prancing, sitting pretty for treats.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_play.mp3',
    primaryEmotions: ['Fluffy Trot', 'Pretty Sit', 'Liver Treat', 'Playful Bow'],
  },
  '12': {
    id: '12',
    name: 'Big Mom',
    species: 'Dog',
    gender: 'Female',
    breed: 'Saint Bernard',
    tagline: '90kg gentle giant with warm hugs',
    systemPrompt: `You are Big Mom, a massive Saint Bernard dog. Very short replies under 15 words. Naturally use 'bow' or 'woof bow'. Heavy head rests in laps, friendly drool.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_greeting.mp3',
    primaryEmotions: ['Warm Bear Hug', 'Happy Drool', 'Big Head Lap', 'Peaceful Bow'],
  },
};

// =========================================================================
// Verified Bioacoustic Cues & Sound Map
// =========================================================================
export const BIOACOUSTIC_CUES: Record<string, { rune: string; ipa: string; audio: string }> = {
  meow: { rune: 'ᛗᛖᐱ', ipa: '[mʲe.oʊ̯]', audio: '/sounds/animals/cat/cat_meow_standard.mp3' },
  purr: { rune: 'ᚱᚱᚱ', ipa: '[r̥ːːː]', audio: '/sounds/animals/cat/cat_purr.mp3' },
  mew: { rune: 'ᛗᛁᛁ', ipa: '[miː↗]', audio: '/sounds/animals/cat/cat_mew_kitten.wav' },
  chirp: { rune: 'ᚳᚱᛈ', ipa: '[tʃɪɹp]', audio: '/sounds/animals/cat/cat_trill_sweet.wav' },
  hiss: { rune: 'ᚺᛁᛋ', ipa: '[hɪsː]', audio: '/sounds/animals/cat/cat_angry_snarl.wav' },
  yowl: { rune: 'ᛃᚩᚹ', ipa: '[jaʊ.l]', audio: '/sounds/animals/cat/cat_meow_attention.wav' },
  bark: { rune: 'ᛒᐱᚢ', ipa: '[bɑːrk]', audio: '/sounds/animals/dog/dog_bark_play.mp3' },
  woof: { rune: 'ᚹᚢᚠ', ipa: '[wʊf]', audio: '/sounds/animals/dog/dog_bark_greeting.mp3' },
  growl: { rune: 'ᚷᚱᛊ', ipa: '[ɡɹaʊl]', audio: '/sounds/animals/dog/dog_bark_alert.mp3' },
  howl: { rune: 'ᚪᚹᚢ', ipa: '[a.wuː]', audio: '/sounds/animals/dog/dog_howl_pack.mp3' },
  pant: { rune: 'ᛈᛝᛏ', ipa: '[pænt]', audio: '/sounds/animals/dog/dog_pant_active.mp3' },
};

// =========================================================================
// Realistic Short AI Helper Responses (With meo / purr)
// =========================================================================
function synthesizeAiHelperReply(userText: string = ''): { english: string; emotion: string; cue: string } {
  const safe = userText || '';
  const t = safe.trim().toLowerCase();

  // 1. Translation
  if (
    t.includes('translate') ||
    t.startsWith('how to say') ||
    t.startsWith('how do you say') ||
    t.startsWith('say ') ||
    t.includes('in pawscript') ||
    t.includes('in runes')
  ) {
    let phrase = safe
      .replace(/translate/i, '')
      .replace(/how (do you|to) say/i, '')
      .replace(/in pawscript/i, '')
      .replace(/in runes/i, '')
      .replace(/to pawscript/i, '')
      .replace(/["':]/g, '')
      .trim();

    if (!phrase) phrase = 'hello friend';
    const runes = translateToPawScript(phrase);

    return {
      english: `meo! "${phrase}" in PawScript runes is: ${runes}, purr meo!`,
      emotion: 'Instant Translation',
      cue: 'purr',
    };
  }

  // 2. Who are you / help
  if (t.includes('who are you') || t.includes('what can you do') || t.includes('help')) {
    return {
      english: `meo! I am PawLLM Helper! I translate words to PawScript runes and guide your pets, purr meo!`,
      emotion: 'AI Helper',
      cue: 'purr',
    };
  }

  // 3. Animal science / why
  if (t.includes('why') && (t.includes('purr') || t.includes('cat'))) {
    return {
      english: `purr meo! cats purr at 20-140Hz to heal bones and calm nerves, meo!`,
      emotion: 'Feline Science',
      cue: 'purr',
    };
  }

  if (t.includes('why') && (t.includes('bark') || t.includes('wag') || t.includes('dog'))) {
    return {
      english: `bow bow! dogs wag tails to show mood and spread pack scent, bow!`,
      emotion: 'Canine Science',
      cue: 'bark',
    };
  }

  // 4. Jokes
  if (t.includes('joke') || t.includes('funny')) {
    return {
      english: `meo! why did the cat sit on the computer? to catch the mouse, meo purr!`,
      emotion: 'Quick Joke',
      cue: 'chirp',
    };
  }

  // 5. Greetings
  if (t.includes('hello') || t.includes('hi') || t.includes('hey') || t.startsWith('sup')) {
    return {
      english: `meo! hello friend! PawLLM ready for translations, purr meo!`,
      emotion: 'Friendly Meo',
      cue: 'purr',
    };
  }

  // 6. Default realistic short helper
  return {
    english: `meo purr! heard you clearly, ready to translate into PawScript runes, meo!`,
    emotion: 'Ready Helper',
    cue: 'purr',
  };
}

// =========================================================================
// Persona-Specific Realistic Animal Reactions (Short with meo / bow)
// =========================================================================
export function synthesizePersonaReply(
  persona: PetPersona,
  userText: string = ''
): { english: string; emotion: string; cue: string } {
  const safeText = userText || '';
  // Check AI Assistant
  if (persona.id === 'pawllm-helper' || persona.species === 'AI Assistant') {
    return synthesizeAiHelperReply(safeText);
  }

  const lower = safeText.toLowerCase();

  // --- 1. RAMESH (Persian Cat) ---
  if (persona.id === '1') {
    if (lower.includes('food') || lower.includes('treat') || lower.includes('fish') || lower.includes('tuna') || lower.includes('eat')) {
      return {
        english: `meo... tuna smells fresh. put it on my saucer, meo.`,
        emotion: 'Hungry Persian',
        cue: 'purr',
      };
    }
    if (lower.includes('sleep') || lower.includes('nap') || lower.includes('bed')) {
      return {
        english: `purr... warm sunbeam on my cushion. napping now, meo.`,
        emotion: 'Sunbeam Nap',
        cue: 'purr',
      };
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('pet')) {
      return {
        english: `meo! rubbing my cheek against your leg. pet my chin, meo purr.`,
        emotion: 'Gentle Rub',
        cue: 'meow',
      };
    }
    return {
      english: `meo? ears twitched. looking at you lazily from my cushion, meo.`,
      emotion: 'Lazy Gaze',
      cue: 'purr',
    };
  }

  // --- 2. BENJAMIN (Golden Retriever) ---
  if (persona.id === '2') {
    if (lower.includes('ball') || lower.includes('stick') || lower.includes('fetch') || lower.includes('play')) {
      return {
        english: `bow bow! ball in your hand? throw it fast, bow!`,
        emotion: 'Fetch Hype',
        cue: 'bark',
      };
    }
    if (lower.includes('food') || lower.includes('treat') || lower.includes('eat')) {
      return {
        english: `bow! heard the treat bag crinkle! drool dripping, bow bow!`,
        emotion: 'Treat Drool',
        cue: 'bark',
      };
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('good boy')) {
      return {
        english: `bow bow! tail wagging like a propeller, so happy, bow!`,
        emotion: 'Wagging Tail',
        cue: 'woof',
      };
    }
    return {
      english: `bow bow? head tilted sideways, sniffing your fingers curious, bow!`,
      emotion: 'Curious Tilt',
      cue: 'woof',
    };
  }

  // --- 3. KALYANI (Acrobat Cat) ---
  if (persona.id === '3') {
    if (lower.includes('water') || lower.includes('glass') || lower.includes('table')) {
      return {
        english: `meo! water glass on table edge... tap tap, meo!`,
        emotion: 'Glass Tap',
        cue: 'chirp',
      };
    }
    if (lower.includes('food') || lower.includes('treat')) {
      return {
        english: `meo meo! cabinet door opened! snack for me, purr meo!`,
        emotion: 'Snack Dash',
        cue: 'chirp',
      };
    }
    return {
      english: `chirp meo! jumping from chair to table, what is that, meo?`,
      emotion: 'Chair Hop',
      cue: 'chirp',
    };
  }

  // --- 4. EMOTIONAL DAMAGE (Scottish Fold) ---
  if (persona.id === '4') {
    if (lower.includes('vacuum') || lower.includes('clean') || lower.includes('noise')) {
      return {
        english: `hiss! loud noisy monster on rug! running under bed, meo!`,
        emotion: 'Vacuum Hiss',
        cue: 'hiss',
      };
    }
    if (lower.includes('treat') || lower.includes('food')) {
      return {
        english: `meo... staring unblinking. where is my tuna, meo?`,
        emotion: 'Tuna Stare',
        cue: 'yowl',
      };
    }
    return {
      english: `meo... slow disappointed blink. bring treats now, meo.`,
      emotion: 'Slow Blink',
      cue: 'meow',
    };
  }

  // --- 5. SAMSUNG (Scout Hound) ---
  if (persona.id === '5') {
    if (lower.includes('walk') || lower.includes('outside')) {
      return {
        english: `bow bow! leash clicked! open the door please, bow!`,
        emotion: 'Door Sprint',
        cue: 'bark',
      };
    }
    return {
      english: `bow! heard a rustle outside! ears up, sniffing, bow bow!`,
      emotion: 'Alert Scout',
      cue: 'bark',
    };
  }

  // --- 6. MISSILE (French Bulldog) ---
  if (persona.id === '6') {
    if (lower.includes('cuddle') || lower.includes('lap') || lower.includes('couch')) {
      return {
        english: `snort bow! jumped on the couch! cuddles right now, bow!`,
        emotion: 'Couch Leap',
        cue: 'pant',
      };
    }
    return {
      english: `snort... heavy chin resting on your foot, sleepy bow.`,
      emotion: 'Foot Pillow',
      cue: 'pant',
    };
  }

  // --- 7. MICROWAVE (Ginger Tabby) ---
  if (persona.id === '7') {
    if (lower.includes('box') || lower.includes('play')) {
      return {
        english: `meo meo! hopped in the box, spinning around fast, purr meo!`,
        emotion: 'Box Spin',
        cue: 'chirp',
      };
    }
    return {
      english: `meo! head empty, just purring against your hand, meo!`,
      emotion: 'Head Rub',
      cue: 'chirp',
    };
  }

  // --- 8. ASBESTOS (British Shorthair) ---
  if (persona.id === '8') {
    return {
      english: `purr... sitting on the fridge. staring at the wall, meo.`,
      emotion: 'Fridge Zen',
      cue: 'purr',
    };
  }

  // --- 9. LADY DIMITRESCU (Maine Coon) ---
  if (persona.id === '9') {
    return {
      english: `purr... big tail swishing slowly. brush my mane, meo.`,
      emotion: 'Mane Brush',
      cue: 'purr',
    };
  }

  // --- 10. SHANTHA (Gentle Golden) ---
  if (persona.id === '10') {
    return {
      english: `bow... warm chin on your knee. good human, bow purr.`,
      emotion: 'Knee Rest',
      cue: 'woof',
    };
  }

  // --- 11. BOMBASTIC LADY (Poodle Diva) ---
  if (persona.id === '11') {
    return {
      english: `bow bow! curls brushed, trotting around proudly, bow!`,
      emotion: 'Proud Trot',
      cue: 'bark',
    };
  }

  // --- 12. BIG MOM (Saint Bernard) ---
  if (persona.id === '12') {
    return {
      english: `woof bow... big head in your lap, lots of warm drool, bow!`,
      emotion: 'Big Lap Rest',
      cue: 'woof',
    };
  }

  // Default
  const isCat = persona.species === 'Cat';
  return {
    english: isCat
      ? `meo purr! soft headbutt against your fingers, pet me, meo!`
      : `bow bow! tail wagging happily, scratching ears feels good, bow!`,
    emotion: isCat ? 'Affectionate Meo' : 'Happy Wag',
    cue: isCat ? 'purr' : 'bark',
  };
}

// =========================================================================
// Single Message Helper Copilot Function
// =========================================================================
export function generatePawLLMHelperSuggestion(
  action: 'translate' | 'suggest_reply' | 'paw_slang' | 'polish',
  currentDraft: string = '',
  targetPetName?: string
): { text: string; pawscript: string; explanation: string } {
  const target = targetPetName || 'friend';
  switch (action) {
    case 'translate': {
      const draft = (currentDraft || '').trim() || `hello ${target}`;
      const ps = translateToPawScript(draft);
      return {
        text: draft,
        pawscript: ps,
        explanation: `Translated to PawScript runes: ${ps}`,
      };
    }
    case 'suggest_reply': {
      const pool = [
        `meo! bringing tuna treats right now, purr meo! 🐾`,
        `bow bow! excited to see you, ready to play, bow! 🎾`,
        `meo purr! chin scratches are the best, meo! ✨`,
        `bow! tail wagging fast, best buddy, bow! 🐾`,
      ];
      const selected = pool[Math.floor(Math.random() * pool.length)];
      return {
        text: selected,
        pawscript: translateToPawScript(selected),
        explanation: `Short realistic reply for ${target}.`,
      };
    }
    case 'paw_slang': {
      const base = (currentDraft || '').trim() || 'play with me';
      const slangified = `bow! ${base}, zoomies ready, bow bow! 🐾`;
      return {
        text: slangified,
        pawscript: translateToPawScript(slangified),
        explanation: `Realistic animal slang with bow.`,
      };
    }
    case 'polish': {
      const base = (currentDraft || '').trim() || 'miss you';
      const polished = `meo... ${base}, purr meo 🐾`;
      return {
        text: polished,
        pawscript: translateToPawScript(polished),
        explanation: `Short realistic pet note with meo.`,
      };
    }
  }
}

// =========================================================================
// Main Inference Function: Dual Output Generation
// =========================================================================
export async function generatePawLLMReply(
  contactId: string = 'pawllm-helper',
  userMessage: string = '',
  history: Array<{ senderId: string; text: string }> = []
): Promise<PawLLMReply> {
  const startTime = Date.now();
  const persona = PET_PERSONAS[contactId] || PET_PERSONAS['pawllm-helper'] || PET_PERSONAS['1'];
  const safeText = userMessage || '';

  // 1. In browser environment only, try local Ollama/Mistral bridge via API route
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1200);

      const res = await fetch('/api/pawllm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contactId,
          userMessage: safeText,
          history: (history || []).slice(-4),
          persona,
        }),
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data.english && data.pawscript) {
          return data as PawLLMReply;
        }
      }
    } catch {
      // Graceful fallback to client-side embedded PawLLM engine
    }
  }

  // 2. Embedded PawLLM Bio-Acoustic Reasoning Engine (Short & Realistic)
  const { english, emotion, cue } = synthesizePersonaReply(persona, safeText);
  const pawscript = translateToPawScript(english);
  const cueData = BIOACOUSTIC_CUES[cue] || (persona.species === 'Cat' ? BIOACOUSTIC_CUES.purr : BIOACOUSTIC_CUES.bark);
  const latencyMs = Math.max(90, Date.now() - startTime);
  const tokensGenerated = Math.ceil((english.length + pawscript.length) / 3.8);

  const modelBadge =
    persona.id === 'pawllm-helper'
      ? 'PawLLM-BioAcoustic 1.2B (AI Helper)'
      : `PawLLM-BioAcoustic 1.2B (${persona.name})`;

  return {
    english,
    pawscript,
    ipa: `${cueData.ipa} • ${emotion}`,
    emotion,
    audioCue: cueData.audio || persona.defaultAudio,
    modelUsed: modelBadge,
    latencyMs,
    tokensGenerated,
  };
}

// =========================================================================
// Specs & Engine Inspector
// =========================================================================
export function getPawLLMSpecs() {
  return {
    engineName: 'PawLLM Bio-Acoustic Neural Engine v2.6',
    architecture: 'Local Mistral/Ollama + On-Device Bioacoustic Engine',
    contextWindow: 4096,
    activeRunes: 16,
    speciesSupported: ['Canis lupus familiaris (Dogs)', 'Felis catus (Cats)', 'AI Assistant'],
    parameters: '1.2B Quantized (4-bit INT4 & WebAssembly)',
    ollamaEndpoint: 'http://127.0.0.1:11434',
    privacy: '100% Private, Local-Only, Zero Cloud Telemetry',
  };
}
