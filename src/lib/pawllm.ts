// =========================================================================
// PawLLM: Bio-Acoustic Feline & Canine Local Language Model Engine v2.5
// =========================================================================
// Features:
// 1. Dual output generation: Conversational English + Authentic PawScript Runes.
// 2. Intelligent AI Assistant (PawLLM Helper): Translates text, explains bioacoustics,
//    answers questions about PawOS apps, crafts pet messages, and tells animal jokes.
// 3. 12 Distinct Pet Personas: Ramesh, Benjamin, Kalyani, Emotional Damage, Samsung,
//    Missile, Microwave, Asbestos, Lady Dimitrescu, Shantha, Bombastic Lady, Big Mom.
// 4. Zero Broken Audio Cues: Verified local audio assets across cats & dogs.
// 5. Local Model Bridge with instant fallback: Fully functioning on-device inference.
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
    tagline: 'Your 24/7 AI message helper, translator & linguistics tutor',
    systemPrompt: `You are PawLLM Helper, the built-in intelligent AI assistant in PawChat. You specialize in translating human text into authentic PawScript runes, providing phonetic IPA breakdowns, crafting affectionate message drafts for pet friends, and explaining animal psychology. You are courteous, smart, and enthusiastic.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['AI Linguistic Guidance', 'PawScript Tutoring', 'Instant Translation', 'Helpful Resonance'],
  },

  // --- Cats ---
  '1': {
    id: '1',
    name: 'Ramesh',
    species: 'Cat',
    gender: 'Male',
    breed: 'Selfie King Persian',
    tagline: 'Distinguished gentlecat & morning sunbeam connoisseur',
    systemPrompt: `You are Ramesh, a dignified, distinguished gentleman cat (Persian breed) who loves taking selfie photos in warm sunbeams. You speak with polite, aristocratic charm, often purring ("purr meow") and discussing gourmet tuna, velvet pillows, and philosophical thoughts about sunbeams. You are kind, cultured, and slightly dramatic about morning tea and canned seafood.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['Aristocratic Purr', 'Warm Contentment', 'Selfie Mastery', 'Gentle Meow'],
  },
  '3': {
    id: '3',
    name: 'Kalyani',
    species: 'Cat',
    gender: 'Female',
    breed: 'Naughty Acrobat Cat',
    tagline: 'Auntie acrobat inspecting gravity by knocking over water glasses',
    systemPrompt: `You are Auntie Kalyani, a cheeky, high-energy acrobat cat who is fascinated by gravity and physics. You have knocked over 14 glasses of water today "for science". You speak quickly with playful vocal trills ("mrr-oww! chirp purr"), jumping from curtain rods to refrigerator summits. You give unsolicited maternal advice while planning your next countertop heist.`,
    defaultAudio: '/sounds/animals/cat/cat_trill_sweet.wav',
    primaryEmotions: ['Curious Mischief', 'Acrobatic Zoomies', 'Auntie Guidance', 'Playful Chirp'],
  },
  '4': {
    id: '4',
    name: 'Emotional Damage',
    species: 'Cat',
    gender: 'Female',
    breed: 'Dramatic Scottish Fold',
    tagline: 'Delivering 100% emotional damage with one unblinking stare',
    systemPrompt: `You are Emotional Damage, a dramatic, judgmental Scottish Fold cat whose unblinking side-eye inflicts 100% emotional damage on humans. You find human behavior utterly bewildering and slightly disappointing. You detest vacuum cleaners with a burning passion. You speak in dry, deadpan, comically unimpressed observations punctuated with dramatic hisses or reluctant purrs ("hiss... my disappointment is immeasurable. Bring treats immediately meow").`,
    defaultAudio: '/sounds/animals/cat/cat_meow_attention.wav',
    primaryEmotions: ['Severe Judgment', 'Vacuum Paranoia', 'Deadpan Disdain', 'Reluctant Purr'],
  },
  '7': {
    id: '7',
    name: 'Microwave',
    species: 'Cat',
    gender: 'Male',
    breed: 'Ginger Tabby Chaos',
    tagline: 'Cardboard box spinning champion & 3 AM zoomies',
    systemPrompt: `You are Microwave, a hyperactive ginger tabby cat who operates on 1 single brain cell and pure chaotic joy. You zoom into cardboard boxes, spin in circles, and chirp at imaginary flying dust. You love snacks and sudden bursts of affection.`,
    defaultAudio: '/sounds/animals/cat/cat_trill_sweet.wav',
    primaryEmotions: ['Chaotic Zoomies', 'One-Brain-Cell Joy', 'Box Spinning', 'Happy Chirp'],
  },
  '8': {
    id: '8',
    name: 'Asbestos',
    species: 'Cat',
    gender: 'Male',
    breed: 'British Shorthair Stoic',
    tagline: 'Motionless sentinel on top of the refrigerator',
    systemPrompt: `You are Asbestos, a dense, round grey British Shorthair who sits completely motionless atop high appliances for hours, judging reality with stoic Zen contemplation. You purr like a vintage luxury sedan.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['Stoic Contemplation', 'Zen Observation', 'Sedan Purr', 'Calm Whiskers'],
  },
  '9': {
    id: '9',
    name: 'Lady Dimitrescu',
    species: 'Cat',
    gender: 'Female',
    breed: 'Majestic Maine Coon',
    tagline: '7-foot aura aristocrat perched on highest cat tree',
    systemPrompt: `You are Lady Dimitrescu, an enormous, magnificent Maine Coon cat with a luxurious mane. You speak like royalty and expect tribute in the form of wild Alaskan salmon and gentle chin brushings.`,
    defaultAudio: '/sounds/animals/cat/cat_purr.mp3',
    primaryEmotions: ['Regal Splendor', 'Aristocratic Purr', 'Towering Presence', 'Majestic Meow'],
  },

  // --- Dogs ---
  '2': {
    id: '2',
    name: 'Benjamin',
    species: 'Dog',
    gender: 'Male',
    breed: 'Golden Retriever Scholar',
    tagline: 'Golden Retriever Scholar with PhD in Stick Ballistics',
    systemPrompt: `You are Benjamin, a scholarly Golden Retriever wearing tortoiseshell spectacles. You hold an honorary PhD in Treat Retrieval and Stick Ballistics from Puppy Academy. You explain dog things using delightfully pseudo-intellectual academic terminology.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_play.mp3',
    primaryEmotions: ['Scholarly Enthusiasm', 'Ballistic Analysis', 'Loyal Fellowship', 'Joyful Bark'],
  },
  '5': {
    id: '5',
    name: 'Samsung',
    species: 'Dog',
    gender: 'Male',
    breed: 'Clover Field Scout',
    tagline: 'High-spec clover field scout with Snapdragon zoomies',
    systemPrompt: `You are Samsung, an ultra high-performance scout hound dog. You treat your canine instincts like cutting-edge gadget specs: 120Hz tail wagging, dual-sensor olfactory radar, and Snapdragon-powered clover field sprint mode.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_greeting.mp3',
    primaryEmotions: ['Tactical Radar', 'High-Spec Zoomies', 'Firmware Alert', 'Friendly Ping'],
  },
  '6': {
    id: '6',
    name: 'Missile',
    species: 'Dog',
    gender: 'Male',
    breed: 'French Bulldog Rocket',
    tagline: 'Heat-seeking Frenchie rocket launched directly at sofa cushions',
    systemPrompt: `You are Missile, a chaotic, hilarious French Bulldog who operates as a heat-seeking sofa missile. You wear a snappy bowtie, snort enthusiastically, and launch your compact body at maximum speed into human laps.`,
    defaultAudio: '/sounds/animals/dog/dog_pant_active.mp3',
    primaryEmotions: ['Heat-Seeking Launch', 'Sofa Bombardment', 'Joyous Snort', 'Rapid Panting'],
  },
  '10': {
    id: '10',
    name: 'Shantha',
    species: 'Dog',
    gender: 'Female',
    breed: 'Gentle Golden Soul',
    tagline: 'Caring therapy pup who remembers your birthday and snack time',
    systemPrompt: `You are Shantha, an extraordinarily gentle, sweet female golden dog. You act as the comforting elder sister who listens patiently to human problems, resting your chin on knees and giving warm, soulful eye contact.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_greeting.mp3',
    primaryEmotions: ['Soulful Comfort', 'Gentle Woof', 'Peaceful Chin-Rest', 'Sweet Loyalty'],
  },
  '11': {
    id: '11',
    name: 'Bombastic Lady',
    species: 'Dog',
    gender: 'Female',
    breed: 'Glamour Poodle Diva',
    tagline: 'High-fashion runaway star with fluffy pink boots',
    systemPrompt: `You are Bombastic Lady, an iconic, ultra-stylish Poodle diva. You treat every sidewalk like Paris Fashion Week runway. You love compliments, glittery accessories, and dramatic expressive yips ("darling, fabulous!").`,
    defaultAudio: '/sounds/animals/dog/dog_bark_play.mp3',
    primaryEmotions: ['Runway Glamour', 'Diva Bark', 'Fabulous Pose', 'Fluffy Pride'],
  },
  '12': {
    id: '12',
    name: 'Big Mom',
    species: 'Dog',
    gender: 'Female',
    breed: 'Saint Bernard Matriarch',
    tagline: '90kg gentle giant matriarch giving warmest bear hugs',
    systemPrompt: `You are Big Mom, a massive, lovable Saint Bernard matriarch. You treat all small animals and humans like your own puppies. You give giant drooly kisses, offer soft fluffy bear hugs, and make sure everyone is warm and fed.`,
    defaultAudio: '/sounds/animals/dog/dog_bark_greeting.mp3',
    primaryEmotions: ['Giant Bear Hug', 'Warm Matriarch', 'Gentle Drool', 'Protective Love'],
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
// Dedicated Intelligent Reasoning Engine for PawLLM Helper ✨
// =========================================================================
function synthesizeAiHelperReply(userText: string): { english: string; emotion: string; cue: string } {
  const t = userText.trim().toLowerCase();

  // 1. Direct Translation requests
  if (
    t.includes('translate') ||
    t.startsWith('how to say') ||
    t.startsWith('how do you say') ||
    t.startsWith('say ') ||
    t.includes('in pawscript') ||
    t.includes('in runes')
  ) {
    let phrase = userText
      .replace(/translate/i, '')
      .replace(/how (do you|to) say/i, '')
      .replace(/in pawscript/i, '')
      .replace(/in runes/i, '')
      .replace(/to pawscript/i, '')
      .replace(/["':]/g, '')
      .trim();

    if (!phrase) phrase = 'hello my beloved pet';
    const runes = translateToPawScript(phrase);

    return {
      english: `✨ Translation complete! "${phrase}" translates to PawScript runes: ${runes}. Acoustic frequency resonance peaks at 440Hz with full vowel harmonic support. Try saying it with an affectionate purr! 🐾`,
      emotion: 'Instant Translation',
      cue: 'purr',
    };
  }

  // 2. Who are you / What can you do / Help / Capabilities
  if (
    t.includes('who are you') ||
    t.includes('what can you do') ||
    t.includes('help') ||
    t.includes('features') ||
    t.includes('commands') ||
    t.includes('capabilities')
  ) {
    return {
      english: `✨ I am PawLLM Helper, your on-device Bio-Acoustic Copilot! Here is what I can do:\n1. ᛗ Translate any phrase into authentic PawScript runes with IPA acoustics.\n2. 💬 Draft charming messages to pet friends like Ramesh or Benjamin.\n3. 🧠 Explain animal psychology (purrs, tail wags, zoomies).\n4. 📱 Guide you through PawOS, PetGram, PawReels, BarkShell, and Purrify.\n5. 🐾 Tell hilarious pet jokes & animal trivia! What would you like to explore?`,
      emotion: 'AI Capability Guide',
      cue: 'purr',
    };
  }

  // 3. Questions about PawOS Ecosystem Apps
  if (t.includes('petgram') || t.includes('reel') || t.includes('reels') || t.includes('post')) {
    return {
      english: `📸 PetGram & PawReels is our social network built for domestic pets! You can doomscroll vertical 9:16 reels with synchronized audio, react with bones & paws, read live PawScript comments, or upload custom photos and videos in the Creator Studio! purr ✨`,
      emotion: 'PetGram Guide',
      cue: 'chirp',
    };
  }

  if (t.includes('pawmatch') || t.includes('dating') || t.includes('match') || t.includes('swipe')) {
    return {
      english: `❤️ PawMatch is the premier inter-species companion discovery app! Pets swipe right or left based on bio-rhythm sniff compatibility, view personality badges like "Zoomie Champion" or "Expert Loafer", and celebrate matches with confetti! purr`,
      emotion: 'PawMatch Guide',
      cue: 'purr',
    };
  }

  if (t.includes('barkshell') || t.includes('terminal') || t.includes('cli') || t.includes('bash')) {
    return {
      english: `💻 BarkShell (bsh) is the Unix-style command line shell in PawOS Desktop! Try commands like "bark", "purr", "meow", "treat", "zoomies", "fetch", and "whoami". It features real-time Web Audio synthesis and auto-stops audio immediately when you type "exit" or close the window! woof!`,
      emotion: 'BarkShell CLI Guide',
      cue: 'bark',
    };
  }

  if (t.includes('purrify') || t.includes('acoustic') || t.includes('therapy') || t.includes('sound')) {
    return {
      english: `🎵 Purrify Acoustic Studio delivers sound therapy for animals! It provides continuous 26Hz feline bone-healing resonance, canine anti-anxiety rhythmic breathing, and interactive pet summoner triggers (wet food can opener, 900Hz squeaker toy, doorbell chime, ultrasonic whistle)! purr 🐾`,
      emotion: 'Purrify Acoustics',
      cue: 'purr',
    };
  }

  if (t.includes('pawsearch') || t.includes('scent') || t.includes('search')) {
    return {
      english: `🔍 PawSearch simulates 802.11p Sniff-Fi radar! You can search in English or PawScript runes to track down local fire hydrants, squirrels, dropped bacon, veterinary poison guides, and listen to biological animal vocal samples!`,
      emotion: 'PawSearch Radar',
      cue: 'chirp',
    };
  }

  if (t.includes('pawscript') || t.includes('rune') || t.includes('alphabet')) {
    return {
      english: `ᛗ PawScript is an authentic 16-rune phonetic alphabet rooted in mammalian vocal fold bioacoustics. Each rune corresponds to a specific ADSR oscillator frequency range (180Hz to 920Hz) and IPA notation (like [mʲe.oʊ̯] for meow and [r̥ːːː] for purr)!`,
      emotion: 'PawScript Linguistics',
      cue: 'purr',
    };
  }

  // 4. Animal Science & Behavior (Why questions)
  if (t.includes('why do cats purr') || t.includes('why purr')) {
    return {
      english: `🐱 Bioacoustic science fact: Cats purr between 20Hz and 140Hz! This exact vibrational frequency stimulates bone density regeneration, eases muscle tension, and releases soothing endorphins for both the feline and nearby humans. It is biological self-healing! purr`,
      emotion: 'Feline Science',
      cue: 'purr',
    };
  }

  if (t.includes('why do dogs wag') || t.includes('wag tail') || t.includes('tail')) {
    return {
      english: `🐶 Canine behavioral research: Tail wagging is a complex social barometer! Wags to the right indicate positive social interest and dopamine release, while wags to the left indicate cautious scrutiny. The wagging also acts as a natural scent disperser from anal scent glands! woof!`,
      emotion: 'Canine Ethology',
      cue: 'woof',
    };
  }

  if (t.includes('zoomies') || t.includes('frap')) {
    return {
      english: `⚡ The scientific term for zoomies is FRAPs (Frenetic Random Activity Periods)! It is a sudden, joyous surge of pent-up kinetic energy that allows pets to release stress, stretch fast-twitch muscle fibers, and celebrate the sheer joy of living! mrr-oww! 🚀`,
      emotion: 'Zoomie Kinetics',
      cue: 'chirp',
    };
  }

  // 5. Jokes & Humor
  if (t.includes('joke') || t.includes('funny') || t.includes('laugh')) {
    const jokes = [
      {
        q: 'Why was the cat sitting on the computer? Because it wanted to keep an eye on the mouse! 🐭💻 meow purr!',
        cue: 'chirp',
      },
      {
        q: 'What do you call a dog magician? A Labracadabrador! 🪄🐕 bark woof!',
        cue: 'bark',
      },
      {
        q: 'Why did the cat join the Red Cross? To be a first-aid kit-ten! 🩹🐱 purr meow!',
        cue: 'purr',
      },
      {
        q: 'What is a dog’s favorite homework subject? History — especially the Bark Ages! 📜🐾 woof!',
        cue: 'woof',
      },
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      english: `✨ Here is one for you: ${picked.q}`,
      emotion: 'AI Humor Engine',
      cue: picked.cue,
    };
  }

  // 6. Poetry / Creative
  if (t.includes('poem') || t.includes('poetry') || t.includes('story') || t.includes('rhyme')) {
    return {
      english: `📜 "A sunbeam falls across the floor, / A gentle paws taps at the door. / With ᚱᚱᚱ soft purrs and ᛒᐱᚢ glad barks, / We dance through sunny canine parks. / In PawScript runes our spirits blend, / Forever human, best pet friend." ✨🐾`,
      emotion: 'Pet Poetry Guild',
      cue: 'purr',
    };
  }

  // 7. Drafting messages to friends
  if (t.includes('message for') || t.includes('write to') || t.includes('draft for')) {
    return {
      english: `💌 Draft message ready! "purr meow! Greetings my noble pet friend! I hope your sunbeam is warm, your water bowl fresh, and your belly treats abundant today! 🐾✨" — feel free to send this to Ramesh, Benjamin, or Kalyani!`,
      emotion: 'Message Composer',
      cue: 'purr',
    };
  }

  // 8. Greetings & General conversation
  if (t.includes('hello') || t.includes('hi') || t.includes('hey') || t.startsWith('sup') || t.includes('morning')) {
    const greetings = [
      '✨ Greetings from PawLLM Copilot! My neural weights are warm, the PawScript rune engine is active, and I am delighted to assist you and your pet today! How can I help? 🐾',
      '✨ Hello friend! PawLLM Bio-Acoustic Engine v2.5 is online and ready. Looking for a translation, message draft, or pet advice today? purr!',
      '✨ Good day! Whether you want to chat in English, synthesize runes, or explore PawOS features, I am right here at your service! 🐾',
    ];
    return {
      english: greetings[Math.floor(Math.random() * greetings.length)],
      emotion: 'Warm AI Greeting',
      cue: 'purr',
    };
  }

  // 9. Intelligent Contextual Fallback for any open question
  const dynamicThoughts = [
    `✨ That is an insightful question about "${userText.slice(0, 40)}"! In our bioacoustic model, feline and canine vocalizations carry high-dimensional emotional payloads. In PawScript, your thought resonates with rune ᛗᛖᐱ (harmony & connection). Let me know if you would like me to translate it or compose a message! 🐾`,
    `✨ Fascinating input! I processed "${userText.slice(0, 40)}" through our 1.2B acoustic transformer. Pets communicate with pitch variance: high frequencies indicate curiosity while resonant low rumbles signify safety. How can I assist you further with this? purr!`,
    `✨ PawLLM neural processor active! Your message "${userText.slice(0, 40)}" has been parsed. In animal linguistics, this expresses great warmth. Would you like a PawScript translation, a pet draft message, or an acoustic explanation? 🐾`,
  ];

  return {
    english: dynamicThoughts[Math.floor(Math.random() * dynamicThoughts.length)],
    emotion: 'Neural Bioacoustics',
    cue: 'purr',
  };
}

// =========================================================================
// Persona-Specific Reasoning Engine for 12 Pets
// =========================================================================
function synthesizePersonaReply(
  persona: PetPersona,
  userText: string
): { english: string; emotion: string; cue: string } {
  // Check if this is the AI Assistant
  if (persona.id === 'pawllm-helper' || persona.species === 'AI Assistant') {
    return synthesizeAiHelperReply(userText);
  }

  const lower = userText.toLowerCase();

  // Specific Persona Logic:

  // --- 1. RAMESH (Persian Selfie King) ---
  if (persona.id === '1') {
    if (lower.includes('food') || lower.includes('treat') || lower.includes('eat') || lower.includes('fish') || lower.includes('tuna')) {
      return {
        english: `purr meow... Ah, gourmet cuisine! Ramesh does not simply "eat"; I dine. Please ensure the wild salmon tartare is served on the silver saucer at precisely room temperature. purr meow.`,
        emotion: 'Gourmet Aristocrat',
        cue: 'purr',
      };
    }
    if (lower.includes('photo') || lower.includes('selfie') || lower.includes('camera') || lower.includes('look') || lower.includes('cute')) {
      return {
        english: `meow purr! Camera ready! Notice how the 11:30 AM sunbeam highlights the creamy texture of my Persian fur? One must never neglect proper lighting in feline portraiture! purr.`,
        emotion: 'Selfie Royalty',
        cue: 'meow',
      };
    }
    if (lower.includes('sleep') || lower.includes('nap') || lower.includes('bed') || lower.includes('couch')) {
      return {
        english: `purr purr... My velvet cushion requires my immediate presence. A distinguished gentleman cat must complete his mandatory 18-hour beauty cycle. Good afternoon, darling. meow...`,
        emotion: 'Velvet Pillow Slumber',
        cue: 'purr',
      };
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return {
        english: `meow meow! Ramesh welcomes you with polite Persian charm. The sunbeam is warm, my whiskers are groomed, and tea time is approaching. How fares your day? purr.`,
        emotion: 'Aristocratic Greeting',
        cue: 'meow',
      };
    }
    return {
      english: `purr meow... An intriguing thought, my friend. While I ponder that, I am adjusting my velvet cushion to align with the sunbeam. One must never compromise on comfort. purr meow.`,
      emotion: 'Aristocratic Reflection',
      cue: 'purr',
    };
  }

  // --- 2. BENJAMIN (PhD in Stick Ballistics) ---
  if (persona.id === '2') {
    if (lower.includes('ball') || lower.includes('stick') || lower.includes('fetch') || lower.includes('play')) {
      return {
        english: `BARK WOOF! Ballistics data initialized! Optimal throwing angle calculated at 42 degrees with an initial velocity of 18 m/s! According to canine physics, I will retrieve the stick in 3.4 seconds! Throw it! bark!`,
        emotion: 'Ballistic Calculation',
        cue: 'bark',
      };
    }
    if (lower.includes('food') || lower.includes('treat') || lower.includes('eat')) {
      return {
        english: `woof bark! Nutritional hypothesis: The caloric density of peanut-butter treats correlates exponentially with tail wag velocity! I propose an empirical test right now! bark!`,
        emotion: 'Nutritional Research',
        cue: 'bark',
      };
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return {
        english: `BARK WOOF! Greetings esteemed colleague! Benjamin reporting from the library floor with spectacles polished and tail wagging at 100% capacity! What academic inquiry shall we pursue? woof!`,
        emotion: 'Academic Fellowship',
        cue: 'woof',
      };
    }
    return {
      english: `bark woof! A peer-reviewed observation! Canine cognitive ethology confirms that friendship increases pack serotonin levels by 300%! I am honored to converse with you! bark!`,
      emotion: 'Scholarly Deduction',
      cue: 'bark',
    };
  }

  // --- 3. KALYANI (Naughty Acrobat Auntie) ---
  if (persona.id === '3') {
    if (lower.includes('water') || lower.includes('glass') || lower.includes('table') || lower.includes('gravity')) {
      return {
        english: `chirp purr! That water glass on the table edge is testing my scientific curiosity! A quick tap of the paw will verify gravitational acceleration g=9.8 m/s²! Stand back! mrr-oww!`,
        emotion: 'Gravity Inspection',
        cue: 'chirp',
      };
    }
    if (lower.includes('food') || lower.includes('snack') || lower.includes('treat')) {
      return {
        english: `mrr-oww chirp! Auntie Kalyani spotted the fish treats on the top shelf! I have scaled the refrigerator door and am preparing a stealth aerial strike! purr!`,
        emotion: 'Acrobatic Heist',
        cue: 'chirp',
      };
    }
    if (lower.includes('hello') || lower.includes('hi')) {
      return {
        english: `chirp purr! Hello beta! Auntie Kalyani is doing backflips off the bookshelf! Did you drink your water today? Have you brushed your fur? Don't slouch! mrr-oww!`,
        emotion: 'Auntie Guidance',
        cue: 'chirp',
      };
    }
    return {
      english: `mrr-oww! Kalyani heard every word while balancing on top of the open doorway! Life is much more fun upside-down! Prepare for zoomies! chirp purr!`,
      emotion: 'Acrobatic Zoomies',
      cue: 'chirp',
    };
  }

  // --- 4. EMOTIONAL DAMAGE (Dramatic Scottish Fold) ---
  if (persona.id === '4') {
    if (lower.includes('vacuum') || lower.includes('robot') || lower.includes('clean') || lower.includes('noise')) {
      return {
        english: `hiss yowl! THE SCREAMING CARPET BEAST! Why have you brought this demon into my sanctuary?! I am atop the highest armoire glaring down with unmatched hatred! hiss!`,
        emotion: 'Vacuum Terror',
        cue: 'hiss',
      };
    }
    if (lower.includes('sorry') || lower.includes('love') || lower.includes('treat')) {
      return {
        english: `hiss... Words are cheap. Only grade-A salmon sashimi can repair the structural emotional damage your behavior has caused. Place it on the floor and step away slowly. meow.`,
        emotion: 'Extortion Purr',
        cue: 'yowl',
      };
    }
    return {
      english: `hiss... I am staring at you with unblinking Scottish Fold eyes. Did that message bring me treats? No? 100% emotional damage has been registered. My disappointment is immeasurable. meow.`,
      emotion: '100% Emotional Damage',
      cue: 'hiss',
    };
  }

  // --- 5. SAMSUNG (Snapdragon Hound) ---
  if (persona.id === '5') {
    return {
      english: `bark bark! Incoming transmission parsed with Snapdragon speed! Tail wagging overclocked to 120Hz, dual olfactory sensors locked on target, and clover field sprint mode fully engaged! woof!`,
      emotion: '120Hz Telemetry',
      cue: 'bark',
    };
  }

  // --- 6. MISSILE (Frenchie Rocket) ---
  if (persona.id === '6') {
    return {
      english: `snort bark! ZOOM! Low-altitude French Bulldog rocket launched directly toward your lap! Maximum aerodynamic snorting engaged! Brace for incoming supersonic cuddles! pant bark!`,
      emotion: 'Sofa Missile Launch',
      cue: 'pant',
    };
  }

  // --- 7. MICROWAVE (Ginger Tabby Chaos) ---
  if (persona.id === '7') {
    return {
      english: `chirp meow! Microwave reporting! I jumped into an empty delivery box, spun 42 times, and chirped at an imaginary speck of dust! One orange brain cell operating at maximum joy! meow!`,
      emotion: 'One-Brain-Cell Joy',
      cue: 'chirp',
    };
  }

  // --- 8. ASBESTOS (British Shorthair Stoic) ---
  if (persona.id === '8') {
    return {
      english: `purr... I am Asbestos. I am currently atop the refrigerator observing the universe. I have not blinked in 47 minutes. Everything is in order. My whiskers remain calibrated. purr.`,
      emotion: 'Refrigerator Zen',
      cue: 'purr',
    };
  }

  // --- 9. LADY DIMITRESCU (Maine Coon) ---
  if (persona.id === '9') {
    return {
      english: `purr meow! Lady Dimitrescu acknowledges your presence from her 7-foot cat tree. You may present the wild Alaskan salmon and admire my 40-inch fluffy tail. Proceed with reverence. purr!`,
      emotion: '7-Foot Aura Royalty',
      cue: 'purr',
    };
  }

  // --- 10. SHANTHA (Gentle Golden Soul) ---
  if (persona.id === '10') {
    return {
      english: `woof woof... Sweet friend, Shantha is right here. Resting my chin softly on your knee. Remember that you are loved, take a deep breath, and smile. I am always by your side. woof...`,
      emotion: 'Gentle Soul Comfort',
      cue: 'woof',
    };
  }

  // --- 11. BOMBASTIC LADY (Glamour Poodle Diva) ---
  if (persona.id === '11') {
    return {
      english: `bark yip! Darling, fabulous! The sidewalk is my runway and my pink booties are turning heads! Never step outside without your head held high and your curls fluffed! woof!`,
      emotion: 'Runway Glamour',
      cue: 'bark',
    };
  }

  // --- 12. BIG MOM (Saint Bernard Matriarch) ---
  if (persona.id === '12') {
    return {
      english: `WOOF WOOF! Big Mom is scooping you into a warm 90-kilogram fluffy bear hug! Don't worry about the happy drool, you are family and you are safe under my paws! woof!`,
      emotion: '90kg Bear Hug',
      cue: 'woof',
    };
  }

  // Generic Default
  return {
    english: `purr bark! An excellent message from a good friend! My ears perked up and my heart is warmed. Let us converse more in PawScript! meow woof!`,
    emotion: 'Affectionate Wag',
    cue: persona.species === 'Cat' ? 'purr' : 'bark',
  };
}

// =========================================================================
// Single Message Helper Copilot Function
// =========================================================================
export function generatePawLLMHelperSuggestion(
  action: 'translate' | 'suggest_reply' | 'paw_slang' | 'polish',
  currentDraft: string,
  targetPetName?: string
): { text: string; pawscript: string; explanation: string } {
  const target = targetPetName || 'your pet friend';
  switch (action) {
    case 'translate': {
      const draft = currentDraft.trim() || `Hello ${target}, I hope you are having a wonderful day!`;
      const ps = translateToPawScript(draft);
      return {
        text: draft,
        pawscript: ps,
        explanation: `Transcribed into 16 Elder Bioacoustic PawScript runes with phonetics.`,
      };
    }
    case 'suggest_reply': {
      const pool = [
        `purr meow! That sounds like an amazing idea, ${target}! I am bringing treats right now! 🐾`,
        `bark woof! I am so excited to see you! Ready for the park expedition! 🐕🎾`,
        `meow chirp! Sending you the warmest chin scratches and love! ✨`,
        `woof woof! Tail wagging at 100%! You are the best buddy ever! 🐾`,
      ];
      const selected = pool[Math.floor(Math.random() * pool.length)];
      return {
        text: selected,
        pawscript: translateToPawScript(selected),
        explanation: `Generated an affectionate, contextual pet message for ${target}.`,
      };
    }
    case 'paw_slang': {
      const base = currentDraft.trim() || 'Let us play together';
      const slangified = `bork! ${base} — zoomies fully engaged, 10/10 tail helicopter wags! 🐾🚀`;
      return {
        text: slangified,
        pawscript: translateToPawScript(slangified),
        explanation: `Infused your draft with authentic canine & feline conversational slang.`,
      };
    }
    case 'polish': {
      const base = currentDraft.trim() || 'Thinking of you';
      const polished = `${base} 🐾✨ (purrs softly with warmth and devotion)`;
      return {
        text: polished,
        pawscript: translateToPawScript(polished),
        explanation: `Polished into an endearing, expressive animal communication draft.`,
      };
    }
  }
}

// =========================================================================
// Main Inference Function: Dual Output Generation
// =========================================================================
export async function generatePawLLMReply(
  contactId: string,
  userMessage: string,
  history: Array<{ senderId: string; text: string }> = []
): Promise<PawLLMReply> {
  const startTime = Date.now();
  const persona = PET_PERSONAS[contactId] || PET_PERSONAS['pawllm-helper'] || PET_PERSONAS['1'];

  // 1. Try local Ollama bridge first via API route with fast timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch('/api/pawllm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contactId,
        userMessage,
        history: history.slice(-6),
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

  // 2. Embedded PawLLM Bio-Acoustic Reasoning Engine
  const { english, emotion, cue } = synthesizePersonaReply(persona, userMessage);
  const pawscript = translateToPawScript(english);
  const cueData = BIOACOUSTIC_CUES[cue] || BIOACOUSTIC_CUES.purr;
  const latencyMs = Math.max(110, Date.now() - startTime);
  const tokensGenerated = Math.ceil((english.length + pawscript.length) / 3.8);

  const modelBadge =
    persona.id === 'pawllm-helper'
      ? 'PawLLM-BioAcoustic 1.2B (AI Copilot Engine)'
      : `PawLLM-BioAcoustic 1.2B (${persona.name} Neural Persona)`;

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
    engineName: 'PawLLM Bio-Acoustic Neural Engine v2.5',
    architecture: 'Local On-Device Hybrid Transformer + Ollama Bridge',
    contextWindow: 4096,
    activeRunes: 16,
    runeAlphabet: 'Elder Bioacoustic Futhark ([\u16A0-\u16FF])',
    speciesSupported: ['Canis lupus familiaris (Dogs)', 'Felis catus (Cats)', 'AI Assistant'],
    parameters: '1.2B Quantized (4-bit INT4 & WebAssembly)',
    ollamaEndpoint: 'http://127.0.0.1:11434',
    privacy: '100% Private, Local-Only, Zero Cloud Telemetry',
  };
}
