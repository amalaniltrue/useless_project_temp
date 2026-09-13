import { NextResponse } from 'next/server';
import {
  translateFromPawScript,
  translateToPawScript,
  PAWSCRIPT_ALPHABET,
} from '@/lib/pawscript';

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

// Built-in Knowledge Base for Animal Kingdom & Veterinary Ethology
const PET_KNOWLEDGE_BASE: Array<{
  keywords: string[];
  panel: KnowledgePanelData;
  results: SearchResultItem[];
}> = [
  {
    keywords: ['golden retriever', 'retriever', 'golden', 'canis lupus familiaris'],
    panel: {
      title: 'Golden Retriever',
      subtitle: 'Canis lupus familiaris • Gun Dog Breed',
      species: 'Dog',
      description: 'The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name. Known for their gentle temperament, intelligence, and intense devotion.',
      imageUrl: '/images/animals/golden_retriever.jpg',
      audioSample: '/sounds/animals/dog/dog_bark_play.mp3',
      soundTitle: 'Joyful Play Bark (450Hz - 900Hz)',
      pawscriptGlyphs: 'ᛒᐱᚢ ᚹᚢᚠ',
      ipaNotation: 'bɑːrk wʊf',
      attributes: {
        'Temperament': 'Intelligent, Friendly, Devoted, Playful',
        'Life Expectancy': '10–12 years',
        'Weight': '25–34 kg (55–75 lbs)',
        'Origin': 'Scotland (Guisachan, 1868)',
        'Bite Force': '190 PSI',
      },
      quickFacts: [
        'Recognized for exceptional mouth gentleness ("soft mouth" instinct).',
        'Second most popular dog breed in the world for family companions.',
        'High aptitude for search-and-rescue, therapy, and guide work.',
      ],
      googleKnowledgeUrl: 'https://www.google.com/search?q=golden+retriever',
    },
    results: [
      {
        id: 'k_gr_1',
        title: 'Golden Retriever Guide: Temperament, Care & Training (2026)',
        url: 'https://www.akc.org/dog-breeds/golden-retriever/',
        displayUrl: 'akc.org › dog-breeds › golden-retriever',
        snippet: 'Complete overview of Golden Retrievers: exercise requirements (minimum 60 mins/day), soft mouth hunting heritage, and optimal low-inflammation nutritional needs.',
        pawscriptSnippet: 'ᛒᐱᚢ ᚹᚢᚠ ... High energy canine seeking regular swimming & fetch.',
        category: 'Health',
        source: 'paw-knowledge',
        speciesTarget: 'Dog',
        rating: 4.9,
        badge: 'Official Breed Standard',
        audioSample: '/sounds/animals/dog/dog_bark_play.mp3',
        publishDate: 'Updated 2 days ago',
      },
      {
        id: 'k_gr_2',
        title: 'Central Canine Meadow — Golden Retriever Swimming Pond',
        url: 'https://maps.google.com/search/canine-meadow-dog-park',
        displayUrl: 'maps.google.com › places › canine-meadow',
        snippet: 'Off-leash agility trails, freshwater swimming dock, dedicated tennis ball dispensers, and separate shaded rest groves.',
        pawscriptSnippet: 'ᛒᐱᚢ ... Freshwater swimming zone with high canine scent traffic.',
        category: 'Places',
        source: 'places-maps',
        speciesTarget: 'Dog',
        rating: 4.8,
        distance: '1.2 km away',
        openStatus: 'Open now • Closes 8:00 PM',
        badge: 'Top Rated Park',
      },
    ],
  },
  {
    keywords: ['husky', 'siberian husky', 'howl', 'awoo', 'snow dog', 'arctic'],
    panel: {
      title: 'Siberian Husky',
      subtitle: 'Canis lupus familiaris • Arctic Working Sled Dog',
      species: 'Dog',
      description: 'The Siberian Husky is an ancient working sled dog breed originating in Northeast Asia. Renowned for incredible endurance, distinctive double coat, erect triangular ears, and expressive pack vocalizations.',
      imageUrl: '/images/animals/husky_snow.jpg',
      audioSample: '/sounds/animals/dog/dog_howl_pack.mp3',
      soundTitle: 'Alpine Pack Chorus Howl (320Hz - 680Hz)',
      pawscriptGlyphs: 'ᚺᐱᚢᛚ ᚪᚹᚢ',
      ipaNotation: 'haʊl aːwuː',
      attributes: {
        'Temperament': 'Vocal, Friendly, Outgoing, Loyal, Independent',
        'Life Expectancy': '12–14 years',
        'Origin': 'Siberia (Chukchi Peninsula)',
        'Vocal Style': 'Harmonic Howling (Rarely Barks)',
        'Cold Resistance': 'Down to -60°C (-76°F)',
      },
      quickFacts: [
        'Huskies prefer melodic howling and vocal "talking" over territorial barking.',
        'They can alter their metabolic rate to burn energy without depleting glycogen stores.',
        'Famous for the 1925 Serum Run to Nome led by Gunnar Kaasen, Balto, and Togo.',
      ],
      googleKnowledgeUrl: 'https://www.google.com/search?q=siberian+husky',
    },
    results: [
      {
        id: 'k_hk_1',
        title: 'Why Do Siberian Huskies Howl Instead of Bark? Ethology Study',
        url: 'https://animalbehavior.org/canine-acoustics/husky-howling',
        displayUrl: 'animalbehavior.org › canine-acoustics › husky-howling',
        snippet: 'Acoustic resonance analysis reveals Siberian Huskies maintain ancestral wolf howl mechanics to coordinate pack positioning across Arctic winds exceeding 50 mph.',
        pawscriptSnippet: 'ᚺᐱᚢᛚ ... Low frequency long-distance acoustic beacon across terrain.',
        category: 'PawScript',
        source: 'paw-knowledge',
        speciesTarget: 'Dog',
        rating: 4.9,
        badge: 'Peer Reviewed',
        audioSample: '/sounds/animals/dog/dog_howl_pack.mp3',
        publishDate: 'September 2026',
      },
    ],
  },
  {
    keywords: ['purr', 'cat purr', 'purring', 'vibration', 'felis catus'],
    panel: {
      title: 'Feline Purr Acoustics & Healing',
      subtitle: 'Low-Frequency Resonant Murmur (25Hz – 150Hz)',
      species: 'Cat',
      description: 'The cat purr is produced through rapid contraction and relaxation of the laryngeal muscles within the larynx, vibrating the vocal folds during both inhalation and exhalation at therapeutic frequencies.',
      imageUrl: '/images/animals/persian_cat.jpg',
      audioSample: '/sounds/animals/cat/cat_purr.mp3',
      soundTitle: 'Deep Feline Resonant Purr (25Hz Steady Murmur)',
      pawscriptGlyphs: 'ᚱᚱᚱ ᛈᚱᚱ',
      ipaNotation: 'rːː pɜːr',
      attributes: {
        'Frequency Band': '20 – 140 Hz (Bone Regeneration Frequency)',
        'Mechanic': 'Laryngeal neural oscillator (both breathing phases)',
        'Situations': 'Nursing, contentment, pain relief, self-soothing',
        'Decibels': '25 – 67 dB',
      },
      quickFacts: [
        'Sound frequencies between 25-50 Hz are scientifically documented to improve bone density.',
        'Kittens learn to purr when only a few days old to signal safety to their mother while nursing.',
        'Big cats that roar (lions, tigers) cannot purr continuously due to an incomplete hyoid apparatus.',
      ],
      googleKnowledgeUrl: 'https://www.google.com/search?q=cat+purr+frequency+healing',
    },
    results: [
      {
        id: 'k_purr_1',
        title: 'The Biomechanical Function of Cat Purring in Cellular Healing',
        url: 'https://veterinarymedicine.vet/feline-biomechanics/purr-healing',
        displayUrl: 'veterinarymedicine.vet › feline-biomechanics',
        snippet: 'Clinical data on 25Hz - 50Hz vibrational frequencies: feline purrs stimulate osteoblast activity, tissue regeneration, and release of pain-relieving endorphins.',
        pawscriptSnippet: 'ᚱᚱᚱ ... Continuous closed-mouth respiratory oscillation at 25Hz.',
        category: 'Health',
        source: 'veterinary',
        speciesTarget: 'Cat',
        rating: 5.0,
        badge: 'Medical Science',
        audioSample: '/sounds/animals/cat/cat_purr.mp3',
        publishDate: 'Published 2026',
      },
    ],
  },
  {
    keywords: ['toxic foods', 'poisonous for dogs', 'toxic for cats', 'chocolate', 'onions', 'grapes', 'xylitol'],
    panel: {
      title: 'Pet Toxic Food & Poison Emergency Index',
      subtitle: 'Critical Veterinary Emergency Reference',
      species: 'All Animals',
      description: 'Immediate toxicity reference for dogs and cats. Substances like Theobromine (chocolate), Xylitol/Birch Bark, Allium compounds (onions/garlic), and Grapes/Raisins can cause severe organ failure.',
      imageUrl: '/images/animals/french_bulldog.jpg',
      pawscriptGlyphs: 'ᚷᚱᚱ ᚹᚪᚱᚾ',
      ipaNotation: 'wɔːrnɪŋ dʒeɪndʒər',
      attributes: {
        'Highest Risk Dogs': 'Xylitol (fatal hypoglycemia), Dark Chocolate, Grapes, Macadamia',
        'Highest Risk Cats': 'Lilies (fatal kidney failure in 36 hrs), Onions, Acetaminophen',
        'Emergency Action': 'Contact Pet Poison Helpline or 24/7 Vet Immediately',
        'ASPCA Hotline': '(888) 426-4435',
      },
      quickFacts: [
        'Xylitol causes massive insulin surge in dogs within 10–60 minutes.',
        'Even 1 or 2 grapes can trigger acute renal failure in certain dog breeds.',
        'True lilies (Lilium and Hemerocallis) are completely lethal to cats even via pollen.',
      ],
      googleKnowledgeUrl: 'https://www.google.com/search?q=toxic+foods+for+dogs+and+cats',
    },
    results: [
      {
        id: 'k_tox_1',
        title: 'Emergency Veterinary Toxic Food Protocol: 12 Deadly Substances',
        url: 'https://aspcapetinsurance.com/resources/what-dogs-cannot-eat/',
        displayUrl: 'aspca.org › pet-care › animal-poison-control',
        snippet: 'Crucial checklist of toxic pantry items: Cocoa theobromine mg/kg calculations, toxic garlic/onion alliin thresholds, and immediate veterinary first aid.',
        pawscriptSnippet: 'ᚹᚪᚱᚾ ... Immediate toxicity alert for canine and feline metabolism.',
        category: 'Health',
        source: 'veterinary',
        speciesTarget: 'All Animals',
        rating: 5.0,
        badge: 'Emergency Medical Alert',
        publishDate: 'Verified Vet 2026',
      },
    ],
  },
];

// Helper to query Wikipedia Search API
async function fetchWikipediaResults(searchTerm: string): Promise<SearchResultItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json`;
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PawSearchEngine/1.0 (https://pawlingo.org)' },
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    const items = data?.query?.search || [];

    return items.slice(0, 4).map((item: { title: string; snippet: string; pageid: number }, index: number) => {
      // Clean HTML tags from snippet
      const cleanSnippet = item.snippet.replace(/<[^>]*>?/gm, '');
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`;

      return {
        id: `wiki_${item.pageid}_${index}`,
        title: item.title,
        url: wikiUrl,
        displayUrl: `en.wikipedia.org › wiki › ${item.title.replace(/ /g, '_')}`,
        snippet: cleanSnippet,
        pawscriptSnippet: translateToPawScript(cleanSnippet.slice(0, 100)),
        category: 'All' as const,
        source: 'wikipedia' as const,
        rating: 4.8,
        badge: 'Wikipedia Live Web',
        publishDate: 'Encyclopedic Source',
      };
    });
  } catch {
    return [];
  }
}

// Helper to query DuckDuckGo Instant Answer API
async function fetchDuckDuckGoAnswer(searchTerm: string): Promise<SearchResultItem | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);

    const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchTerm)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PawSearchEngine/1.0' },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.AbstractText) return null;

    return {
      id: `ddg_abstract`,
      title: data.Heading || `${searchTerm} Overview`,
      url: data.AbstractURL || `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
      displayUrl: data.AbstractSource ? `${data.AbstractSource.toLowerCase()}.com` : 'web-knowledge.org',
      snippet: data.AbstractText,
      pawscriptSnippet: translateToPawScript(data.AbstractText.slice(0, 100)),
      category: 'All',
      source: 'google-web',
      rating: 4.9,
      badge: 'Live Web Answer',
      publishDate: 'Instant Web Fact',
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const rawQuery = (searchParams.get('q') || '').trim();
  const category = (searchParams.get('category') || 'All') as string;

  if (!rawQuery) {
    return NextResponse.json({
      originalQuery: '',
      englishQuery: '',
      isPawScript: false,
      pawScriptTranscription: '',
      googleUrl: 'https://www.google.com',
      googleImagesUrl: 'https://images.google.com',
      googleMapsUrl: 'https://maps.google.com',
      stats: { totalResults: 0, searchTimeMs: 0, source: 'paw-engine' },
      results: [],
    });
  }

  // 1. Detect if query contains PawScript runic glyphs ([\u16A0-\u16FF])
  const containsRunes = /[\u16A0-\u16FF]/.test(rawQuery);

  let englishQuery = rawQuery;
  let isPawScript = containsRunes;
  let pawScriptTranscription = '';

  if (containsRunes) {
    // Translate PawScript runes into English words
    const translated = translateFromPawScript(rawQuery).trim();
    if (translated && translated !== rawQuery) {
      englishQuery = translated;
    }
    pawScriptTranscription = rawQuery;
  } else {
    // Check if query is an animal phonetic sound in English (e.g. "purr", "meow", "bark", "howl")
    const lower = rawQuery.toLowerCase();
    const matchingChar = PAWSCRIPT_ALPHABET.find(
      (c) => c.sound.toLowerCase() === lower || lower.includes(c.sound.toLowerCase())
    );

    if (matchingChar) {
      isPawScript = true;
      pawScriptTranscription = matchingChar.symbol;
      // Enrich English query with full animal search intent
      englishQuery = `${matchingChar.animal} ${matchingChar.sound} ${matchingChar.meaning.replace(/"/g, '')}`;
    } else {
      pawScriptTranscription = translateToPawScript(rawQuery);
    }
  }

  // 2. Build Google Search Direct URLs
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(englishQuery)}`;
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(englishQuery)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(englishQuery + ' pet care near me')}`;

  // 3. Find Knowledge Panel from Pet Knowledge Base
  const lowerEnglish = englishQuery.toLowerCase();
  const matchedKnowledge = PET_KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((kw) => lowerEnglish.includes(kw))
  );

  // If no exact match, synthesize a knowledge panel if animal sound matched
  let knowledgePanel: KnowledgePanelData | undefined = matchedKnowledge?.panel;

  if (!knowledgePanel) {
    const soundMatch = PAWSCRIPT_ALPHABET.find(
      (c) =>
        lowerEnglish.includes(c.sound.toLowerCase()) ||
        lowerEnglish.includes(c.animal.toLowerCase())
    );
    if (soundMatch) {
      knowledgePanel = {
        title: `${soundMatch.animal} Sound: ${soundMatch.name}`,
        subtitle: `${soundMatch.animal} • ${soundMatch.lifeStage}`,
        species: soundMatch.animal,
        description: `${soundMatch.meaning} Vocal mechanic: ${soundMatch.mouthMechanic}. Emotion: ${soundMatch.primaryEmotion}.`,
        imageUrl: soundMatch.animal === 'Cat' ? '/images/animals/persian_cat.jpg' : '/images/animals/golden_retriever.jpg',
        audioSample: soundMatch.audioParams.realAudioFile || (soundMatch.animal === 'Cat' ? '/sounds/animals/cat/cat_purr.mp3' : '/sounds/animals/dog/dog_bark_play.mp3'),
        soundTitle: `${soundMatch.sound.toUpperCase()} — ${soundMatch.category}`,
        pawscriptGlyphs: soundMatch.symbol,
        ipaNotation: soundMatch.ipa,
        attributes: {
          'Intonation': soundMatch.intonation,
          'Mouth Mechanic': soundMatch.mouthMechanic,
          'Audience': soundMatch.targetAudience,
          'Category': soundMatch.category,
        },
        quickFacts: [
          soundMatch.description,
          `Pronounced phonetically as ${soundMatch.ipa}.`,
          `Animal species classification: ${soundMatch.animal}.`,
        ],
        googleKnowledgeUrl: `https://www.google.com/search?q=${encodeURIComponent(soundMatch.animal + ' ' + soundMatch.sound + ' vocalization')}`,
      };
    }
  }

  // 4. Fetch Live Web Results concurrently (Wikipedia + DuckDuckGo)
  const [wikiResults, ddgResult] = await Promise.all([
    fetchWikipediaResults(englishQuery),
    fetchDuckDuckGoAnswer(englishQuery),
  ]);

  // 5. Gather Domain-Specific Curated Results
  const domainResults: SearchResultItem[] = matchedKnowledge ? matchedKnowledge.results : [];

  // If search involves places/maps, inject verified pet places
  const placesResults: SearchResultItem[] = [];
  if (
    category === 'Places' ||
    category === 'All' ||
    lowerEnglish.includes('park') ||
    lowerEnglish.includes('near me') ||
    lowerEnglish.includes('vet') ||
    lowerEnglish.includes('spot')
  ) {
    placesResults.push(
      {
        id: 'place_1',
        title: 'Central Whisker & Hound Ecological Park',
        url: 'https://maps.google.com/search/pet-ecological-park',
        displayUrl: 'maps.google.com › places › whisker-hound-park',
        snippet: '40-acre pet paradise with agility obstacle courses, designated small dog & big dog meadows, and fenced feline sensory gardens.',
        pawscriptSnippet: 'ᛒᐱᚢ ᛗᛖᐱ ... Premier urban canine and feline recreation zone.',
        category: 'Places',
        source: 'places-maps',
        rating: 4.9,
        distance: '0.8 km away',
        openStatus: 'Open 24 Hours • Well Lit',
        badge: 'Top Rated Park',
      },
      {
        id: 'place_2',
        title: 'St. Francis 24/7 Animal Emergency Trauma Hospital',
        url: 'https://maps.google.com/search/24-7-emergency-vet-hospital',
        displayUrl: 'maps.google.com › medical › emergency-vet-hospital',
        snippet: 'Board-certified emergency veterinary critical care, toxicology antidote reserves, surgical suites, and dedicated feline quiet ward.',
        pawscriptSnippet: 'ᚹᚪᚱᚾ ... Emergency medical care facility open 24/7 with ICU.',
        category: 'Health',
        source: 'veterinary',
        rating: 4.9,
        distance: '2.3 km away',
        openStatus: 'Open 24/7 • Emergency Ready',
        badge: 'Verified 24/7 Emergency',
      }
    );
  }

  // Combine and sort results
  let combinedResults: SearchResultItem[] = [];

  if (ddgResult) {
    combinedResults.push(ddgResult);
  }

  combinedResults.push(...domainResults);
  combinedResults.push(...wikiResults);
  combinedResults.push(...placesResults);

  // Filter by category if requested
  if (category !== 'All') {
    combinedResults = combinedResults.filter((item) => item.category === category);
  }

  const searchTimeMs = Date.now() - startTime;

  return NextResponse.json({
    originalQuery: rawQuery,
    englishQuery,
    isPawScript,
    pawScriptTranscription,
    googleUrl,
    googleImagesUrl,
    googleMapsUrl,
    stats: {
      totalResults: Math.max(combinedResults.length * 1420, 1420),
      searchTimeMs,
      source: 'Google & Live Web Hybrid via PawLingo',
    },
    knowledgePanel,
    results: combinedResults,
  });
}
