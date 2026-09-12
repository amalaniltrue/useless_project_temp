'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Image as ImageIcon,
  Film,
  ArrowLeft,
  Send,
  Sparkles,
  Check,
  Volume2,
  Tag,
  Upload,
} from 'lucide-react';
import { translateToPawScript } from '@/lib/pawscript';
import { playTapTone } from '@/lib/sounds';
import { IPadFrame } from '@/components/ui/IPadFrame';
import Link from 'next/link';

interface PetUser {
  id: string;
  name: string;
  handle: string;
  species: string;
  breed: string;
  avatar: string;
  isAvatarImage?: boolean;
  emoji: string;
}

const PRESET_PHOTOS = [
  { label: 'Benjamin (Professor Glasses)', url: '/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp', species: 'Dog' },
  { label: 'Kalyani (Zero-G Acrobat)', url: '/pictures/cat/CWbUskSKeMT-png__700.webp', species: 'Cat' },
  { label: 'Ramesh (King Selfie 4K)', url: '/pictures/cat/cat-taking-a-selfie.webp', species: 'Cat' },
  { label: 'Samsung (Clover Field Scout)', url: '/pictures/dog/springer.webp', species: 'Dog' },
  { label: 'Emotional Damage (Vacuum Alert)', url: '/pictures/cat/portrait-of-a-scared-cat.webp', species: 'Cat' },
  { label: 'Missile (Frenchie Sofa Rocket)', url: '/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp', species: 'Dog' },
  { label: 'Microwave (Naughty Water Glass)', url: '/pictures/cat/naughty.webp', species: 'Cat' },
  { label: 'Lady Dimitrescu (Majestic Maine Coon)', url: '/pictures/cat/CQRCz9RppTd-png__700.webp', species: 'Cat' },
  { label: 'Asbestos (Stoic Refrigerator Peak)', url: '/pictures/cat/random-weird-cat-pics-68999d4c7cf5a__700.webp', species: 'Cat' },
  { label: 'Bombastic Lady (Runway Poodle)', url: '/pictures/dog/funny-dog-picture-jr72rp2jqjo57wxv.webp', species: 'Dog' },
  { label: 'Shantha (Gentle Golden Therapy)', url: '/pictures/dog/funny-dog-pics-19-10-24-2024.webp', species: 'Dog' },
  { label: 'Big Mom (Loving Fluffy Drool)', url: '/pictures/dog/funny-dumb-pictures-f0sbo1li5pvc91oj.webp', species: 'Dog' },
];

const PRESET_REELS = [
  { label: 'Ramesh Persian Punch', url: '/reels/reel-persian-punch.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_purr.mp3' },
  { label: 'Casper Roundhouse MMA', url: '/reels/reel-casper-mma.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_trill_short.mp3' },
  { label: 'Kalyani Pole Vault Record', url: '/reels/reel-pole-vault-cat.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_trill_sweet.wav' },
  { label: 'Microwave 3AM Salsa', url: '/reels/reel-dancing-cat.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_meow_continuous.mp3' },
  { label: 'Royal Aristocratic Cackle', url: '/reels/reel-laughing-cats.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_purr.mp3' },
  { label: 'Naked Speedster Drift', url: '/reels/reel-naked-speedster.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_meow_expressive.mp3' },
  { label: 'Bombastic Lady Runway', url: '/reels/reel-vacation-mode.mp4', species: 'Dog', sound: '/sounds/animals/dog/dog_pant_active.mp3' },
  { label: 'Missile Frenchie Warrior', url: '/reels/reel-warrior-training.mp4', species: 'Dog', sound: '/sounds/animals/dog/dog_bark_greeting.mp3' },
  { label: 'Big Mom Raw Power Reps', url: '/reels/reel-raw-canine-power.mp4', species: 'Dog', sound: '/sounds/animals/dog/dog_pant_breath.mp3' },
  { label: 'Benjamin 5am Morning Walk', url: '/reels/reel-morning-walk.mp4', species: 'Dog', sound: '/sounds/animals/dog/dog_bark_play.mp3' },
  { label: 'Shantha Partner In Crime', url: '/reels/reel-partner-in-crime.mp4', species: 'Dog', sound: '/sounds/animals/dog/dog_pant_active.mp3' },
  { label: 'Samsung Hamster UFC', url: '/reels/reel-hamster-ufc.mp4', species: 'Dog', sound: '/sounds/animals/dog/dog_bark_greeting.mp3' },
  { label: 'Peace Treaty Summit', url: '/reels/reel-viral-cat-dog.mp4', species: 'Cat', sound: '/sounds/animals/cat/cat_purr.mp3' },
];

const AUDIO_TRACKS = [
  { title: 'Purring Cat Resonance', url: '/sounds/animals/cat/cat_purr.mp3', species: 'Cat' },
  { title: 'Cat Attention Meow', url: '/sounds/animals/cat/cat_meow_attention.wav', species: 'Cat' },
  { title: 'Sweet Morning Trills', url: '/sounds/animals/cat/cat_trill_sweet.wav', species: 'Cat' },
  { title: 'Kitten Play Mew', url: '/sounds/animals/cat/cat_mew_kitten.wav', species: 'Cat' },
  { title: 'Canine Play Barking', url: '/sounds/animals/dog/dog_bark_play.mp3', species: 'Dog' },
  { title: 'Active Dog Panting & Joy', url: '/sounds/animals/dog/dog_pant_active.mp3', species: 'Dog' },
  { title: 'Pack Echo Howl Solo', url: '/sounds/animals/dog/dog_howl_pack.mp3', species: 'Dog' },
  { title: 'Happy Playful Bark', url: '/sounds/animals/dog/dog_bark_greeting.mp3', species: 'Dog' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [postType, setPostType] = useState<'photo' | 'reel'>('photo');
  const [caption, setCaption] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [mediaPreview, setMediaPreview] = useState<string>(PRESET_PHOTOS[0].url);
  const [selectedAudio, setSelectedAudio] = useState(AUDIO_TRACKS[0].url);
  const [posted, setPosted] = useState(false);

  const [currentUser, setCurrentUser] = useState<PetUser>({
    id: 'user_kalyani',
    name: 'Kalyani',
    handle: '@kalyani_acrobat',
    species: 'Cat',
    breed: 'Calico Acrobat',
    avatar: '/pictures/cat/CWbUskSKeMT-png__700.webp',
    isAvatarImage: true,
    emoji: '🐱',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedUser = localStorage.getItem('pawlingo_current_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
      } catch {}
      try {
        const saved = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (saved === 'dark' || saved === 'light') setMode(saved);
      } catch {}
    });

    const readMode = () => {
      try {
        const saved = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (saved === 'dark' || saved === 'light') setMode(saved);
      } catch {}
    };
    window.addEventListener('pawpad_mode_change', readMode);
    return () => window.removeEventListener('pawpad_mode_change', readMode);
  }, []);

  const isVideoMedia = (url: string) => {
    return (
      url.startsWith('data:video') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.includes('reel-') ||
      url.startsWith('blob:')
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideoFile =
        file.type.startsWith('video') ||
        file.name.toLowerCase().endsWith('.mp4') ||
        file.name.toLowerCase().endsWith('.mov') ||
        file.name.toLowerCase().endsWith('.webm');

      if (isVideoFile) {
        setPostType('reel');
      } else {
        setPostType('photo');
      }

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === 'string') {
          setMediaPreview(loadEvt.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaPreview) return;
    playTapTone();

    const trackObj = AUDIO_TRACKS.find((t) => t.url === selectedAudio);

    if (postType === 'photo' && !isVideoMedia(mediaPreview)) {
      const newPost = {
        id: `custom_post_${Date.now()}`,
        author: currentUser,
        imageUrl: mediaPreview,
        caption: caption || 'Living my best pet life! 🐾✨',
        tags: ['#PetGram', `#${species}Life`, '#PawPad'],
        reactions: [
          { type: 'paw', count: 1 },
          { type: species === 'Cat' ? 'fish' : 'bone', count: 1 },
        ],
        comments: [],
        timeAgo: 'Just now',
        audioTrack: trackObj
          ? {
              title: trackObj.title,
              artist: currentUser.name,
              url: trackObj.url,
            }
          : undefined,
      };

      try {
        const saved = localStorage.getItem('pawlingo_custom_posts');
        const list = saved ? JSON.parse(saved) : [];
        localStorage.setItem('pawlingo_custom_posts', JSON.stringify([newPost, ...list]));
      } catch {}
    } else {
      const newReel = {
        id: `custom_reel_${Date.now()}`,
        author: currentUser,
        mediaUrl: mediaPreview,
        caption: caption || 'Watch this high-speed pet maneuver! 🏃‍♂️💨',
        tags: ['#PawReels', `#${species}Shorts`, '#FastPaws'],
        audioTrack: {
          title: trackObj?.title || 'Animal Soundtrack',
          artist: currentUser.name,
          url: selectedAudio,
        },
        reactions: [{ type: 'paw', count: 1 }],
        comments: [],
        sharesCount: 0,
      };

      try {
        const saved = localStorage.getItem('pawlingo_custom_reels');
        const list = saved ? JSON.parse(saved) : [];
        localStorage.setItem('pawlingo_custom_reels', JSON.stringify([newReel, ...list]));
      } catch {}
    }

    setPosted(true);
    setTimeout(() => {
      router.push('/petgram');
    }, 1200);
  };

  const cardBg = mode === 'dark' ? 'bg-[#121216] border-white/10 text-white' : 'bg-white border-neutral-200 text-neutral-900';
  const subBg = mode === 'dark' ? 'bg-[#1a1a22] border-white/10' : 'bg-neutral-50 border-neutral-200';

  return (
    <IPadFrame
      appName="PetGram Post & Reel Studio"
      appEmoji="📸"
      appColor="from-pink-500 via-rose-500 to-amber-500"
      backHref="/petgram"
      rightActions={
        <Link
          href="/petgram"
          onClick={() => playTapTone()}
          className="text-xs text-neutral-400 hover:text-white font-bold flex items-center gap-1"
        >
          <ArrowLeft size={13} />
          <span>Back to Feed</span>
        </Link>
      }
    >
      <div className={`flex-1 flex flex-col overflow-y-auto ${mode === 'dark' ? 'bg-[#09090b] text-white' : 'bg-[#f8f9fa] text-neutral-900'} transition-colors duration-300 pb-24`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <span>Create Pet Post or Reel</span>
                <span className="text-pink-500">📸</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Share photos or upload high-velocity video reels with PawScript captions and sound effects.
              </p>
            </div>

            {/* Post Type Switcher */}
            <div className={`flex p-1 rounded-2xl border ${subBg}`}>
              <button
                type="button"
                onClick={() => {
                  playTapTone();
                  setPostType('photo');
                  setMediaPreview(PRESET_PHOTOS[0].url);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  postType === 'photo'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon size={14} />
                <span>Photo Post</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapTone();
                  setPostType('reel');
                  setMediaPreview(PRESET_REELS[0].url);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  postType === 'reel'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film size={14} />
                <span>Vertical Reel 🎬</span>
              </button>
            </div>
          </div>

          {/* Creation Form */}
          <form onSubmit={handlePublish} className="space-y-6">
            {/* Media Selector Grid */}
            <div className={`rounded-3xl p-5 border ${cardBg} shadow-lg space-y-4`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Camera size={14} className="text-pink-500" />
                  <span>Choose Media (Presets or Upload Custom Photo/Video)</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      playTapTone();
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = 'image/*';
                        fileInputRef.current.click();
                      }
                    }}
                    className="text-xs bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all border border-pink-500/30 active:scale-95"
                  >
                    <Upload size={12} />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTapTone();
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = 'video/mp4,video/*,.mp4,.mov,.webm';
                        fileInputRef.current.click();
                      }
                    }}
                    className="text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all border border-purple-500/30 active:scale-95"
                  >
                    <Film size={12} />
                    <span>Upload Video / Reel</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/*,.mp4,.mov,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Active Media Live Preview */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center space-y-2">
                <div className={`relative w-full max-w-xs ${postType === 'reel' ? 'h-80' : 'h-64'} rounded-2xl overflow-hidden bg-black border border-white/20 shadow-xl flex items-center justify-center`}>
                  {isVideoMedia(mediaPreview) ? (
                    <video
                      key={mediaPreview}
                      src={mediaPreview}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={mediaPreview}
                      alt="Post Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md">
                    {isVideoMedia(mediaPreview) ? (
                      <>
                        <Film size={12} className="text-purple-400" />
                        <span>Active Video Reel Preview</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={12} className="text-pink-400" />
                        <span>Active Photo Post Preview</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {isVideoMedia(mediaPreview)
                    ? '🎬 High-velocity video reel ready for PawReels'
                    : '📸 Crisp photo ready for PetGram feed'}
                </p>
              </div>

              {/* Preset Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                {(postType === 'photo' ? PRESET_PHOTOS : PRESET_REELS).map((preset) => {
                  const isSelected = mediaPreview === preset.url;
                  return (
                    <div
                      key={preset.url}
                      onClick={() => {
                        playTapTone();
                        setMediaPreview(preset.url);
                        setSpecies(preset.species);
                      }}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        postType === 'reel' ? 'aspect-[9/16]' : 'aspect-square'
                      } ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-500/50 scale-[1.02]'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      {preset.url.endsWith('.mp4') ? (
                        <video
                          src={preset.url}
                          className="w-full h-full object-cover pointer-events-none"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-1.5 inset-x-1.5 text-[10px] text-white font-bold leading-tight truncate">
                        {preset.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audio Track Selector */}
            <div className={`rounded-3xl p-5 border ${cardBg} shadow-lg space-y-3`}>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Volume2 size={14} className="text-amber-400" />
                <span>Background Audio Track (BGM &amp; Sound Effect)</span>
              </span>

              <div className="grid sm:grid-cols-2 gap-2">
                {AUDIO_TRACKS.map((t) => {
                  const isSelected = selectedAudio === t.url;
                  return (
                    <div
                      key={t.url}
                      onClick={() => {
                        playTapTone();
                        setSelectedAudio(t.url);
                        const a = new Audio(t.url);
                        a.play().catch(() => {});
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-1 ring-amber-500'
                          : `${subBg} hover:border-white/20 text-neutral-300`
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{t.species === 'Cat' ? '🐱' : '🐶'}</span>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">{t.title}</div>
                          <span className="text-[10px] text-neutral-400">{t.species} Audio</span>
                        </div>
                      </div>
                      {isSelected ? (
                        <Check size={14} className="text-amber-400 flex-shrink-0" />
                      ) : (
                        <Volume2 size={13} className="text-neutral-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Caption & PawScript Live Preview */}
            <div className={`rounded-3xl p-5 border ${cardBg} shadow-lg space-y-3`}>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Tag size={14} className="text-pink-400" />
                <span>Caption &amp; PawScript Translation</span>
              </label>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Write your pet caption (e.g. 'Enjoying an afternoon nap in the warm sunbeam, purr meow')..."
                className={`w-full p-3.5 rounded-2xl border ${subBg} focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-xs sm:text-sm`}
              />

              {caption && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles size={11} /> Auto-Translated PawScript:
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-300 break-words">
                    {translateToPawScript(caption)}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={posted}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                posted
                  ? 'bg-emerald-600'
                  : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.01] active:scale-95'
              }`}
            >
              {posted ? (
                <>
                  <Check size={18} />
                  <span>Published to PetGram Feed! 🐾</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Publish to PetGram</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </IPadFrame>
  );
}
