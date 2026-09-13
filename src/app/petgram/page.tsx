'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  Share2,
  Bookmark,
  Plus,
  Volume2,
  VolumeX,
  Play,
  ChevronUp,
  ChevronDown,
  Disc,
  UserPlus,
  X,
  Sparkles,
  Film,
  Camera,
  Check,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateToPawScript, getReactionEmoji, getAnimalEmoji } from '@/lib/pawscript';
import { playTapTone } from '@/lib/sounds';
import { IPadFrame } from '@/components/ui/IPadFrame';
import Link from 'next/link';

// ==========================================
// Types
// ==========================================

export interface PetUser {
  id: string;
  name: string;
  handle: string;
  species: string;
  breed: string;
  avatar: string;
  isAvatarImage?: boolean;
  emoji: string;
  bio?: string;
  followers?: number;
  following?: number;
}

export interface PostComment {
  id: string;
  author: string;
  authorHandle?: string;
  authorAvatar?: string;
  text: string;
  textPS?: string;
  timeAgo: string;
}

export interface PetPost {
  id: string;
  author: PetUser;
  imageUrl: string;
  caption: string;
  reactions: { type: string; count: number }[];
  comments: PostComment[];
  timeAgo: string;
  tags?: string[];
  audioTrack?: {
    title: string;
    artist: string;
    url: string;
  };
}

export interface PetReel {
  id: string;
  author: PetUser;
  mediaUrl: string;
  caption: string;
  tags: string[];
  audioTrack: {
    title: string;
    artist: string;
    url: string;
  };
  reactions: { type: string; count: number }[];
  comments: PostComment[];
  sharesCount: number;
}

// ==========================================
// Preset Profiles using Uploaded Pictures
// ==========================================

const INITIAL_USERS: PetUser[] = [
  {
    id: 'user_kalyani',
    name: 'Kalyani',
    handle: '@kalyani_acrobat',
    species: 'Cat',
    breed: 'Calico Acrobat',
    avatar: '/pictures/cat/CWbUskSKeMT-png__700.webp',
    isAvatarImage: true,
    emoji: '🐱',
    bio: 'Auntie Kalyani: professional acrobat & high-altitude gravity inspector ☀️🐾',
    followers: 24500,
    following: 180,
  },
  {
    id: 'user_benjamin',
    name: 'Benjamin',
    handle: '@benjamin_phd',
    species: 'Dog',
    breed: 'Golden Retriever Scholar',
    avatar: '/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp',
    isAvatarImage: true,
    emoji: '🐕',
    bio: 'PhD in Ballistics & Stick Geometry. 47 fetches a day 🎾🤓',
    followers: 38900,
    following: 220,
  },
  {
    id: 'user_samsung',
    name: 'Samsung',
    handle: '@samsung_scout',
    species: 'Dog',
    breed: 'Clover Field Scout',
    avatar: '/pictures/dog/springer.webp',
    isAvatarImage: true,
    emoji: '🐶',
    bio: 'Snapdragon 120Hz clover scout. Olfactory radar locked! 👅🛰️',
    followers: 19200,
    following: 340,
  },
  {
    id: 'user_emotional_damage',
    name: 'Emotional Damage',
    handle: '@emotional_damage',
    species: 'Cat',
    breed: 'Scottish Fold',
    avatar: '/pictures/cat/portrait-of-a-scared-cat.webp',
    isAvatarImage: true,
    emoji: '😼',
    bio: 'Robot vacuum watcher. Delivering 100% emotional damage with one unblinking stare 🤖🚨',
    followers: 31000,
    following: 95,
  },
  {
    id: 'user_microwave',
    name: 'Microwave',
    handle: '@microwave_chaos',
    species: 'Cat',
    breed: 'Ginger Tabby Chaos',
    avatar: '/pictures/cat/COaEeSIpWQW-png__700.webp',
    isAvatarImage: true,
    emoji: '🐱',
    bio: 'Spun in 14 Amazon cardboard boxes today. 1 orange brain cell at 800 RPM! 📦💥',
    followers: 45200,
    following: 120,
  },
  {
    id: 'user_ramesh',
    name: 'Ramesh',
    handle: '@ramesh_selfie',
    species: 'Cat',
    breed: 'Selfie King Persian',
    avatar: '/pictures/cat/cat-taking-a-selfie.webp',
    isAvatarImage: true,
    emoji: '🐱',
    bio: 'Selfie King Persian. Sunbeam alignment & gourmet salmon connoisseur 👑📸',
    followers: 52100,
    following: 85,
  },
  {
    id: 'user_asbestos',
    name: 'Asbestos',
    handle: '@asbestos_stoic',
    species: 'Cat',
    breed: 'British Shorthair Stoic',
    avatar: '/pictures/cat/random-weird-cat-pics-68999d4c7cf5a__700.webp',
    isAvatarImage: true,
    emoji: '🐈',
    bio: 'Perched motionless on the refrigerator for 6 hours. Observing the cosmos 🧊',
    followers: 28400,
    following: 40,
  },
  {
    id: 'user_lady_dimitrescu',
    name: 'Lady Dimitrescu',
    handle: '@lady_dimitrescu',
    species: 'Cat',
    breed: 'Majestic Maine Coon',
    avatar: '/pictures/cat/CQRCz9RppTd-png__700.webp',
    isAvatarImage: true,
    emoji: '👑',
    bio: 'Empress of the High Perch. Bow before my 40-inch fluffy tail and royal aura 👑✨',
    followers: 67800,
    following: 15,
  },
  {
    id: 'user_missile',
    name: 'Missile',
    handle: '@missile_rocket',
    species: 'Dog',
    breed: 'French Bulldog Rocket',
    avatar: '/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp',
    isAvatarImage: true,
    emoji: '🐶',
    bio: 'Heat-seeking Frenchie sofa missile. Snappy bowtie, high-velocity cuddles! 🚀🎀',
    followers: 33500,
    following: 210,
  },
  {
    id: 'user_shantha',
    name: 'Shantha',
    handle: '@shantha_golden',
    species: 'Dog',
    breed: 'Gentle Golden Soul',
    avatar: '/pictures/dog/funny-dog-pics-19-10-24-2024.webp',
    isAvatarImage: true,
    emoji: '🐕',
    bio: 'Gentle therapy pup. Resting my chin on your knee and bringing you peace 💛🐾',
    followers: 29800,
    following: 190,
  },
  {
    id: 'user_bombastic_lady',
    name: 'Bombastic Lady',
    handle: '@bombastic_lady',
    species: 'Dog',
    breed: 'Glamour Poodle Diva',
    avatar: '/pictures/dog/funny-dog-picture-jr72rp2jqjo57wxv.webp',
    isAvatarImage: true,
    emoji: '🐩',
    bio: 'High-fashion runway superstar with fluffy pink boots. Darling, fabulous! 🐩💅✨',
    followers: 41200,
    following: 310,
  },
  {
    id: 'user_big_mom',
    name: 'Big Mom',
    handle: '@big_mom_hug',
    species: 'Dog',
    breed: 'Saint Bernard Matriarch',
    avatar: '/pictures/dog/funny-dumb-pictures-f0sbo1li5pvc91oj.webp',
    isAvatarImage: true,
    emoji: '🐶',
    bio: '90kg gentle giant matriarch. Warm fluffy bear hugs and loving drool for all ❤️🐾',
    followers: 48900,
    following: 140,
  },
];

// ==========================================
// Preset Feed Posts (Using Uploaded Cat & Dog Photos)
// ==========================================

const INITIAL_POSTS: PetPost[] = [
  {
    id: 'post_1',
    author: INITIAL_USERS[5], // Ramesh
    imageUrl: '/pictures/cat/cat-taking-a-selfie.webp',
    caption: 'Snapped this front-camera portrait in optimal sunbeam lighting! Persian whisker alignment in 4K resolution! purr meow 🐱📸✨',
    tags: ['#CatSelfie', '#RameshPersian', '#FelineModel', '#PawGram'],
    reactions: [
      { type: 'paw', count: 642 },
      { type: 'fish', count: 310 },
      { type: 'laugh', count: 184 },
    ],
    comments: [
      {
        id: 'c1',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'Angle and lighting calculated to perfection. 10/10 composition bark bark',
        textPS: translateToPawScript('Angle and lighting calculated to perfection. 10/10 composition bark bark'),
        timeAgo: '1h ago',
      },
      {
        id: 'c2',
        author: 'Microwave',
        authorHandle: '@microwave_chaos',
        text: 'Did you knock the phone off the table afterwards? purr',
        textPS: translateToPawScript('Did you knock the phone off the table afterwards? purr'),
        timeAgo: '35m ago',
      },
    ],
    timeAgo: '2 hours ago',
    audioTrack: {
      title: 'Purring Cat Resonance',
      artist: 'Ramesh',
      url: '/sounds/animals/cat/cat_purr.mp3',
    },
  },
  {
    id: 'post_2',
    author: INITIAL_USERS[1], // Benjamin
    imageUrl: '/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp',
    caption: 'Graded the mid-term exams at Puppy Academy. All students successfully differentiated between stick and tennis ball! bark woof 🎓🐶',
    tags: ['#ProfessorDog', '#Barkology', '#PuppyAcademy', '#GoodBoys'],
    reactions: [
      { type: 'paw', count: 980 },
      { type: 'bone', count: 540 },
      { type: 'zoomies', count: 420 },
    ],
    comments: [
      {
        id: 'c3',
        author: 'Samsung',
        authorHandle: '@samsung_scout',
        text: 'Professor I ate my homework because it smelled like bacon bark!',
        textPS: translateToPawScript('Professor I ate my homework because it smelled like bacon bark!'),
        timeAgo: '2h ago',
      },
      {
        id: 'c4',
        author: 'Kalyani',
        authorHandle: '@kalyani_acrobat',
        text: 'Dogs with glasses are undeniably sophisticated meow',
        textPS: translateToPawScript('Dogs with glasses are undeniably sophisticated meow'),
        timeAgo: '1h ago',
      },
    ],
    timeAgo: '4 hours ago',
    audioTrack: {
      title: 'Happy Playful Bark',
      artist: 'Benjamin',
      url: '/sounds/animals/dog/dog_bark_greeting.mp3',
    },
  },
  {
    id: 'post_3',
    author: INITIAL_USERS[0], // Kalyani
    imageUrl: '/pictures/cat/CWbUskSKeMT-png__700.webp',
    caption: 'High-altitude windowsill balance routine complete. Auntie Kalyani defying gravity as usual! meow purr 🎪🐾',
    tags: ['#KalyaniAcrobat', '#BalanceQueen', '#ZeroGravity', '#CalicoPower'],
    reactions: [
      { type: 'paw', count: 1240 },
      { type: 'fish', count: 580 },
      { type: 'zoomies', count: 390 },
    ],
    comments: [
      {
        id: 'c5_k',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'Center of gravity impeccably maintained, Auntie! 📚🐕',
        textPS: translateToPawScript('Center of gravity impeccably maintained, Auntie! 📚🐕'),
        timeAgo: '2h ago',
      },
    ],
    timeAgo: '5 hours ago',
    audioTrack: {
      title: 'Sweet Morning Trills',
      artist: 'Kalyani',
      url: '/sounds/animals/cat/cat_trill_sweet.wav',
    },
  },
  {
    id: 'post_4',
    author: INITIAL_USERS[2], // Samsung
    imageUrl: '/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp',
    caption: 'THE SACRED PHRASE WAS UTTERED: W-A-L-K! Leash secured, sneakers tied, park squirrels beware! pant pant woof 🏃‍♂️🎾',
    tags: ['#WalkTime', '#DerpSmile', '#ZoomiesIncoming', '#CloverScout'],
    reactions: [
      { type: 'paw', count: 1450 },
      { type: 'bone', count: 820 },
      { type: 'zoomies', count: 910 },
    ],
    comments: [
      {
        id: 'c6',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'Cardiovascular exercise is essential for canine vitality! bark!',
        textPS: translateToPawScript('Cardiovascular exercise is essential for canine vitality! bark!'),
        timeAgo: '5h ago',
      },
    ],
    timeAgo: '7 hours ago',
    audioTrack: {
      title: 'Active Dog Panting & Joy',
      artist: 'Samsung',
      url: '/sounds/animals/dog/dog_pant_active.mp3',
    },
  },
  {
    id: 'post_5',
    author: INITIAL_USERS[3], // Emotional Damage
    imageUrl: '/pictures/cat/portrait-of-a-scared-cat.webp',
    caption: 'EMERGENCY: The circular floor monster with the whirring sound invaded the hallway. I retreated to the refrigerator summit! hiss yowl 🤖🚨',
    tags: ['#VacuumMonster', '#HallwayPatrol', '#Spooked', '#HighGround'],
    reactions: [
      { type: 'paw', count: 890 },
      { type: 'fish', count: 240 },
      { type: 'laugh', count: 520 },
    ],
    comments: [
      {
        id: 'c7',
        author: 'Kalyani',
        authorHandle: '@kalyani_acrobat',
        text: 'Stay on the fridge until it goes back to its dock! purr',
        textPS: translateToPawScript('Stay on the fridge until it goes back to its dock! purr'),
        timeAgo: '6h ago',
      },
    ],
    timeAgo: '9 hours ago',
    audioTrack: {
      title: 'Cat Attention Meow',
      artist: 'Emotional Damage',
      url: '/sounds/animals/cat/cat_meow_attention.wav',
    },
  },
  {
    id: 'post_6',
    author: INITIAL_USERS[8], // Missile
    imageUrl: '/pictures/dog/funny-dog-pics-6-10-24-2024.webp',
    caption: 'Running full throttle across the sunny meadow! Wind in the ears, paws in the clover! bark bark woof 🌾🏃‍♂️',
    tags: ['#FieldGallop', '#SunnyDays', '#RocketFrenchie', '#PureJoy'],
    reactions: [
      { type: 'paw', count: 1820 },
      { type: 'bone', count: 940 },
      { type: 'zoomies', count: 760 },
    ],
    comments: [
      {
        id: 'c8',
        author: 'Samsung',
        authorHandle: '@samsung_scout',
        text: 'Save some clover for the rest of us! woof!',
        textPS: translateToPawScript('Save some clover for the rest of us! woof!'),
        timeAgo: '8h ago',
      },
    ],
    timeAgo: '11 hours ago',
    audioTrack: {
      title: 'Canine Play Barking',
      artist: 'Missile',
      url: '/sounds/animals/dog/dog_bark_play.mp3',
    },
  },
  {
    id: 'post_7',
    author: INITIAL_USERS[4], // Microwave
    imageUrl: '/pictures/cat/naughty.webp',
    caption: 'Gravity verification test #47: pushed the water glass to the precipice. Law of acceleration confirmed! meow 🥛😼💥',
    tags: ['#GravityExpert', '#WaterGlass', '#ZeroRegrets', '#CatPhysics'],
    reactions: [
      { type: 'paw', count: 1640 },
      { type: 'fish', count: 620 },
      { type: 'laugh', count: 890 },
    ],
    comments: [
      {
        id: 'c7_m',
        author: 'Emotional Damage',
        authorHandle: '@emotional_damage',
        text: 'The wet paws aftermath is dangerous! yowl',
        textPS: translateToPawScript('The wet paws aftermath is dangerous! yowl'),
        timeAgo: '10h ago',
      },
    ],
    timeAgo: '13 hours ago',
    audioTrack: {
      title: 'Playful Kitten Mew',
      artist: 'Microwave',
      url: '/sounds/animals/cat/cat_mew_cute.mp3',
    },
  },
  {
    id: 'post_8',
    author: INITIAL_USERS[7], // Lady Dimitrescu
    imageUrl: '/pictures/cat/CQRCz9RppTd-png__700.webp',
    caption: 'The Empress reclines upon the velvet cushion. The household subjects may now present the daily salmon feast. 👑✨🐟',
    tags: ['#LadyDimitrescu', '#RoyalMaineCoon', '#AristocraticAura', '#HighPerch'],
    reactions: [
      { type: 'paw', count: 2310 },
      { type: 'fish', count: 1140 },
      { type: 'laugh', count: 420 },
    ],
    comments: [
      {
        id: 'c8_d',
        author: 'Ramesh',
        authorHandle: '@ramesh_selfie',
        text: 'The fluff volume is majestic Your Highness 👑😸',
        textPS: translateToPawScript('The fluff volume is majestic Your Highness 👑😸'),
        timeAgo: '12h ago',
      },
    ],
    timeAgo: '15 hours ago',
    audioTrack: {
      title: 'Purring Cat Resonance',
      artist: 'Lady Dimitrescu',
      url: '/sounds/animals/cat/cat_purr.mp3',
    },
  },
  {
    id: 'post_9',
    author: INITIAL_USERS[6], // Asbestos
    imageUrl: '/pictures/cat/random-weird-cat-pics-68999d4c7cf5a__700.webp',
    caption: 'Stationary atop the refrigerator for 7 consecutive hours. Observing the kitchen cosmos in absolute stillness. 🧊🐈',
    tags: ['#AsbestosStoic', '#RefrigeratorSummit', '#MotionlessMastery'],
    reactions: [
      { type: 'paw', count: 1420 },
      { type: 'fish', count: 530 },
      { type: 'laugh', count: 780 },
    ],
    comments: [
      {
        id: 'c9_a',
        author: 'Kalyani',
        authorHandle: '@kalyani_acrobat',
        text: 'A masterclass in meditative balance meow 🧘',
        textPS: translateToPawScript('A masterclass in meditative balance meow 🧘'),
        timeAgo: '14h ago',
      },
    ],
    timeAgo: '17 hours ago',
    audioTrack: {
      title: 'Sweet Morning Trills',
      artist: 'Asbestos',
      url: '/sounds/animals/cat/cat_trill_sweet.wav',
    },
  },
  {
    id: 'post_10',
    author: INITIAL_USERS[10], // Bombastic Lady
    imageUrl: '/pictures/dog/funny-dog-picture-jr72rp2jqjo57wxv.webp',
    caption: 'Runway season is officially open, darling! Fluffy pink boots on, strutting through the living room! 🐩💅✨',
    tags: ['#BombasticLady', '#GlamourPoodle', '#RunwayReady', '#PawFashion'],
    reactions: [
      { type: 'paw', count: 1980 },
      { type: 'bone', count: 870 },
      { type: 'zoomies', count: 620 },
    ],
    comments: [
      {
        id: 'c10_b',
        author: 'Shantha',
        authorHandle: '@shantha_golden',
        text: 'You look so fabulous Lady! 🐩💛',
        textPS: translateToPawScript('You look so fabulous Lady! 🐩💛'),
        timeAgo: '16h ago',
      },
    ],
    timeAgo: '19 hours ago',
    audioTrack: {
      title: 'Active Dog Panting & Joy',
      artist: 'Bombastic Lady',
      url: '/sounds/animals/dog/dog_pant_active.mp3',
    },
  },
  {
    id: 'post_11',
    author: INITIAL_USERS[9], // Shantha
    imageUrl: '/pictures/dog/funny-dog-pics-19-10-24-2024.webp',
    caption: 'Resting my chin on human knee. Whatever happened today, everything is going to be wonderful! Gentle golden hugs 💛🐾',
    tags: ['#ShanthaGolden', '#TherapyPup', '#GoldenRetrieverLove', '#GentleSoul'],
    reactions: [
      { type: 'paw', count: 2890 },
      { type: 'bone', count: 1420 },
      { type: 'zoomies', count: 480 },
    ],
    comments: [
      {
        id: 'c11_s',
        author: 'Big Mom',
        authorHandle: '@big_mom_hug',
        text: 'The sweetest heart in the world ❤️🐕',
        textPS: translateToPawScript('The sweetest heart in the world ❤️🐕'),
        timeAgo: '18h ago',
      },
    ],
    timeAgo: '21 hours ago',
    audioTrack: {
      title: 'Canine Play Barking',
      artist: 'Shantha',
      url: '/sounds/animals/dog/dog_bark_greeting.mp3',
    },
  },
  {
    id: 'post_12',
    author: INITIAL_USERS[11], // Big Mom
    imageUrl: '/pictures/dog/funny-dumb-pictures-f0sbo1li5pvc91oj.webp',
    caption: '90kg of pure maternal warmth! Giant fluffy bear hugs and loving drool for every pup and kitten! ❤️🐶🐾',
    tags: ['#BigMomHug', '#SaintBernardMatriarch', '#GentleGiant', '#BearHugs'],
    reactions: [
      { type: 'paw', count: 3120 },
      { type: 'bone', count: 1890 },
      { type: 'zoomies', count: 540 },
    ],
    comments: [
      {
        id: 'c12_bm',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'Calculated hug radius: maximum comfort! 📚🐶',
        textPS: translateToPawScript('Calculated hug radius: maximum comfort! 📚🐶'),
        timeAgo: '20h ago',
      },
    ],
    timeAgo: '1 day ago',
    audioTrack: {
      title: 'Active Dog Panting & Joy',
      artist: 'Big Mom',
      url: '/sounds/animals/dog/dog_pant_active.mp3',
    },
  },
];

// ==========================================
// Preset Vertical Reels
// ==========================================

const INITIAL_REELS: PetReel[] = [
  {
    id: 'reel_1',
    author: INITIAL_USERS[5], // Ramesh
    mediaUrl: '/reels/reel-persian-punch.mp4',
    caption: 'That last Persian punch was strictly personal! 100% precision paw strike in the championship ring! 🥊😼💥',
    tags: ['#PersianPunch', '#PawUFC', '#RameshMMA', '#HeavyweightCat', '#PrecisionStrike'],
    audioTrack: {
      title: 'Ramesh Heavyweight Anthem',
      artist: 'Ramesh the Persian',
      url: '/sounds/animals/cat/cat_purr.mp3',
    },
    reactions: [
      { type: 'paw', count: 4820 },
      { type: 'fish', count: 2190 },
      { type: 'laugh', count: 1430 },
    ],
    comments: [
      {
        id: 'rc1_1',
        author: 'Emotional Damage',
        authorHandle: '@emotional_damage',
        text: 'The jawline follow-through was championship caliber meow! 😼',
        textPS: translateToPawScript('The jawline follow-through was championship caliber meow! 😼'),
        timeAgo: '1h ago',
      },
      {
        id: 'rc1_2',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'Newton third law verified by that hook! 📚🐶',
        textPS: translateToPawScript('Newton third law verified by that hook! 📚🐶'),
        timeAgo: '30m ago',
      },
    ],
    sharesCount: 1840,
  },
  {
    id: 'reel_2',
    author: INITIAL_USERS[3], // Emotional Damage
    mediaUrl: '/reels/reel-casper-mma.mp4',
    caption: 'Casper does it again! 🤯 Delivering 100% psychological and physical emotional damage with rapid-fire roundhouse paws! 🥋🔥',
    tags: ['#EmotionalDamage', '#CasperMMA', '#FelineStriker', '#RoundhousePaw', '#BlackBeltCat'],
    audioTrack: {
      title: 'Emotional Damage Strike Beat',
      artist: 'Emotional Damage',
      url: '/sounds/animals/cat/cat_trill_short.mp3',
    },
    reactions: [
      { type: 'paw', count: 5620 },
      { type: 'fish', count: 2890 },
      { type: 'laugh', count: 3200 },
    ],
    comments: [
      {
        id: 'rc2_1',
        author: 'Kalyani',
        authorHandle: '@kalyani_acrobat',
        text: 'Flawless hip rotation on that kick meow! 🐾',
        textPS: translateToPawScript('Flawless hip rotation on that kick meow! 🐾'),
        timeAgo: '2h ago',
      },
      {
        id: 'rc2_2',
        author: 'Samsung',
        authorHandle: '@samsung_scout',
        text: 'Faster than my 120Hz radar! Bark! 🐕⚡',
        textPS: translateToPawScript('Faster than my 120Hz radar! Bark! 🐕⚡'),
        timeAgo: '1h ago',
      },
    ],
    sharesCount: 2310,
  },
  {
    id: 'reel_3',
    author: INITIAL_USERS[0], // Kalyani
    mediaUrl: '/reels/reel-pole-vault-cat.mp4',
    caption: 'Oscar cleared that bar, but Auntie Kalyani just shattered the world feline pole-vault record! Defying gravity since day one! 😼🏆🎪',
    tags: ['#PoleVaultCat', '#KalyaniAcrobat', '#GravityWho', '#GoldMedalWhiskers', '#HighAltitudeCat'],
    audioTrack: {
      title: 'High Altitude Flight Melody',
      artist: 'Kalyani',
      url: '/sounds/animals/cat/cat_trill_sweet.wav',
    },
    reactions: [
      { type: 'paw', count: 6890 },
      { type: 'fish', count: 3410 },
      { type: 'zoomies', count: 2950 },
    ],
    comments: [
      {
        id: 'rc3_1',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'The parabolic arc equation checks out perfectly! 📏🐶',
        textPS: translateToPawScript('The parabolic arc equation checks out perfectly! 📏🐶'),
        timeAgo: '3h ago',
      },
      {
        id: 'rc3_2',
        author: 'Bombastic Lady',
        authorHandle: '@bombastic_lady',
        text: 'Graceful in mid-air, darling! Simply spectacular! 🐩✨',
        textPS: translateToPawScript('Graceful in mid-air, darling! Simply spectacular! 🐩✨'),
        timeAgo: '2h ago',
      },
    ],
    sharesCount: 3120,
  },
  {
    id: 'reel_4',
    author: INITIAL_USERS[4], // Microwave
    mediaUrl: '/reels/reel-dancing-cat.mp4',
    caption: 'Microwave at 3AM after drinking a thimble of tuna broth! Single orange braincell spinning at 800 RPM on the dance floor! 🤪💃🕺',
    tags: ['#MicrowaveDancing', '#OrangeCatEnergy', '#3AMZoomies', '#CatDanceParty', '#ViralDance'],
    audioTrack: {
      title: 'Chaotic 3AM Salsa',
      artist: 'Microwave',
      url: '/sounds/animals/cat/cat_meow_continuous.mp3',
    },
    reactions: [
      { type: 'paw', count: 8120 },
      { type: 'fish', count: 4210 },
      { type: 'laugh', count: 5890 },
    ],
    comments: [
      {
        id: 'rc4_1',
        author: 'Asbestos',
        authorHandle: '@asbestos_stoic',
        text: 'I watched this for 4 hours without blinking. 🧊',
        textPS: translateToPawScript('I watched this for 4 hours without blinking. 🧊'),
        timeAgo: '4h ago',
      },
      {
        id: 'rc4_2',
        author: 'Big Mom',
        authorHandle: '@big_mom_hug',
        text: 'Such joyful little foot taps! Big Mom is proud! ❤️🐶',
        textPS: translateToPawScript('Such joyful little foot taps! Big Mom is proud! ❤️🐶'),
        timeAgo: '2h ago',
      },
    ],
    sharesCount: 4560,
  },
  {
    id: 'reel_5',
    author: INITIAL_USERS[7], // Lady Dimitrescu
    mediaUrl: '/reels/reel-laughing-cats.mp4',
    caption: 'The royal court loses all aristocratic composure! Peak feline cackle after observing the canine peasants tumble! 😂👑🏰',
    tags: ['#LadyDimitrescu', '#RoyalCackle', '#MaineCoonRoyalty', '#AristocraticHumor', '#CatLaughs'],
    audioTrack: {
      title: 'Aristocratic Cackle Symphony',
      artist: 'Lady Dimitrescu',
      url: '/sounds/animals/cat/cat_purr.mp3',
    },
    reactions: [
      { type: 'paw', count: 9450 },
      { type: 'fish', count: 3910 },
      { type: 'laugh', count: 7890 },
    ],
    comments: [
      {
        id: 'rc5_1',
        author: 'Ramesh',
        authorHandle: '@ramesh_selfie',
        text: 'Even royalty cannot hold back genuine laughter! 👑😸',
        textPS: translateToPawScript('Even royalty cannot hold back genuine laughter! 👑😸'),
        timeAgo: '5h ago',
      },
    ],
    sharesCount: 5200,
  },
  {
    id: 'reel_6',
    author: INITIAL_USERS[6], // Asbestos
    mediaUrl: '/reels/reel-naked-speedster.mp4',
    caption: 'The Naked Speedster. Built wrong, drives right! Zero aerodynamic drag, full throttle living room drift around the coffee table! 🏎️💨😹',
    tags: ['#NakedSpeedster', '#AsbestosDrift', '#TokyoDriftPaws', '#ZeroDrag', '#LivingRoomGrandPrix'],
    audioTrack: {
      title: 'Sphynx Turbo Drift',
      artist: 'Asbestos',
      url: '/sounds/animals/cat/cat_meow_standard.mp3',
    },
    reactions: [
      { type: 'paw', count: 6120 },
      { type: 'zoomies', count: 4890 },
      { type: 'laugh', count: 3410 },
    ],
    comments: [
      {
        id: 'rc6_1',
        author: 'Missile',
        authorHandle: '@missile_rocket',
        text: 'Challenging you to a drag race down the hallway! 🚀🐾',
        textPS: translateToPawScript('Challenging you to a drag race down the hallway! 🚀🐾'),
        timeAgo: '1h ago',
      },
    ],
    sharesCount: 2890,
  },
  {
    id: 'reel_7',
    author: INITIAL_USERS[10], // Bombastic Lady
    mediaUrl: '/reels/reel-vacation-mode.mp4',
    caption: '🐒🕶️🥤 Vacation mode fully activated! Coconut water on ice, sunglasses on, do NOT disturb the runway Queen! 🐩💅✨',
    tags: ['#VacationMode', '#BombasticLady', '#GlamourPup', '#DoNotDisturb', '#PawFashionWeek'],
    audioTrack: {
      title: 'Runway Diva Chillout',
      artist: 'Bombastic Lady',
      url: '/sounds/animals/dog/dog_pant_active.mp3',
    },
    reactions: [
      { type: 'paw', count: 7340 },
      { type: 'bone', count: 3820 },
      { type: 'zoomies', count: 2190 },
    ],
    comments: [
      {
        id: 'rc7_1',
        author: 'Shantha',
        authorHandle: '@shantha_golden',
        text: 'So glamorous! Bring me back a seashell please! 🐚💛',
        textPS: translateToPawScript('So glamorous! Bring me back a seashell please! 🐚💛'),
        timeAgo: '3h ago',
      },
    ],
    sharesCount: 3740,
  },
  {
    id: 'reel_8',
    author: INITIAL_USERS[8], // Missile
    mediaUrl: '/reels/reel-warrior-training.mp4',
    caption: 'He trained for battle. Perfected fierce warrior moves. Showed up in full combat gear... then took a 4-hour tactical power nap! 🚀⚔️😴',
    tags: ['#MissileWarrior', '#FrenchieCombat', '#NapSpecialForces', '#RocketFrenchie', '#BowtieBrawler'],
    audioTrack: {
      title: 'Tactical Warrior Fanfare',
      artist: 'Missile',
      url: '/sounds/animals/dog/dog_bark_greeting.mp3',
    },
    reactions: [
      { type: 'paw', count: 8420 },
      { type: 'bone', count: 4910 },
      { type: 'laugh', count: 3950 },
    ],
    comments: [
      {
        id: 'rc8_1',
        author: 'Samsung',
        authorHandle: '@samsung_scout',
        text: 'The tactical nap is the most vital battle phase! Bark! 💤🐶',
        textPS: translateToPawScript('The tactical nap is the most vital battle phase! Bark! 💤🐶'),
        timeAgo: '2h ago',
      },
    ],
    sharesCount: 4120,
  },
  {
    id: 'reel_9',
    author: INITIAL_USERS[11], // Big Mom
    mediaUrl: '/reels/reel-raw-canine-power.mp4',
    caption: 'Raw canine power 💪🏼! Big Mom putting in the heavyweight reps! 90kg of pure maternal strength and fluffy bear hugs! 🐶🏋️❤️',
    tags: ['#RawCaninePower', '#BigMomFitness', '#SaintBernardGains', '#GentleGiant', '#PowerliftingPup'],
    audioTrack: {
      title: 'Heavyweight Paws Reps',
      artist: 'Big Mom',
      url: '/sounds/animals/dog/dog_pant_breath.mp3',
    },
    reactions: [
      { type: 'paw', count: 8750 },
      { type: 'bone', count: 5420 },
      { type: 'zoomies', count: 3180 },
    ],
    comments: [
      {
        id: 'rc9_1',
        author: 'Benjamin',
        authorHandle: '@benjamin_phd',
        text: 'Calculated force output: 450 Newtons of maternal power! 📚💪',
        textPS: translateToPawScript('Calculated force output: 450 Newtons of maternal power! 📚💪'),
        timeAgo: '1h ago',
      },
    ],
    sharesCount: 3980,
  },
  {
    id: 'reel_10',
    author: INITIAL_USERS[1], // Benjamin
    mediaUrl: '/reels/reel-morning-walk.mp4',
    caption: 'Good morning! It is strictly 5:00 AM! Scientific sunrise route inspection: aerodynamic sniffing & critical trail updates! 🦴🌅📚',
    tags: ['#5amWalk', '#BenjaminPhD', '#MorningInspection', '#ScholarDog', '#DachshundDiscipline'],
    audioTrack: {
      title: 'Dawn Patrol Scientific March',
      artist: 'Benjamin',
      url: '/sounds/animals/dog/dog_bark_play.mp3',
    },
    reactions: [
      { type: 'paw', count: 6540 },
      { type: 'bone', count: 4120 },
      { type: 'zoomies', count: 2890 },
    ],
    comments: [
      {
        id: 'rc10_1',
        author: 'Shantha',
        authorHandle: '@shantha_golden',
        text: 'The sunrise smelled wonderful today, Professor! 🌅💛',
        textPS: translateToPawScript('The sunrise smelled wonderful today, Professor! 🌅💛'),
        timeAgo: '4h ago',
      },
    ],
    sharesCount: 2650,
  },
  {
    id: 'reel_11',
    author: INITIAL_USERS[9], // Shantha
    mediaUrl: '/reels/reel-partner-in-crime.mp4',
    caption: 'Day 92 🐾: Life is infinitely more fun with a partner in crime... especially when neither of us knows what we are doing! 💛🐕🐾',
    tags: ['#PartnerInCrime', '#ShanthaGolden', '#GentleSoul', '#BestFriendsForever', '#GoldenRetrieverLife'],
    audioTrack: {
      title: 'Golden Friendship Melody',
      artist: 'Shantha',
      url: '/sounds/animals/dog/dog_pant_active.mp3',
    },
    reactions: [
      { type: 'paw', count: 9820 },
      { type: 'bone', count: 6120 },
      { type: 'zoomies', count: 4210 },
    ],
    comments: [
      {
        id: 'rc11_1',
        author: 'Big Mom',
        authorHandle: '@big_mom_hug',
        text: 'The purest friendship on PawGram! Sending big cuddles! ❤️🐾',
        textPS: translateToPawScript('The purest friendship on PawGram! Sending big cuddles! ❤️🐾'),
        timeAgo: '2h ago',
      },
    ],
    sharesCount: 4890,
  },
  {
    id: 'reel_12',
    author: INITIAL_USERS[2], // Samsung
    mediaUrl: '/reels/reel-hamster-ufc.mp4',
    caption: 'Hamster UFC vs Man! Samsung tracking high-frequency micro-movements on 120Hz radar! Tactical paws deployed! 🐶🥊⚡',
    tags: ['#HamsterUFC', '#SamsungScout', '#MicroCombat', '#OlfactoryRadar', '#120HzReflexes'],
    audioTrack: {
      title: 'Tactical Radar Ping',
      artist: 'Samsung',
      url: '/sounds/animals/dog/dog_bark_greeting.mp3',
    },
    reactions: [
      { type: 'paw', count: 7890 },
      { type: 'bone', count: 3950 },
      { type: 'laugh', count: 4820 },
    ],
    comments: [
      {
        id: 'rc12_1',
        author: 'Emotional Damage',
        authorHandle: '@emotional_damage',
        text: 'That hamster has better head movement than most contenders meow! 😼🥊',
        textPS: translateToPawScript('That hamster has better head movement than most contenders meow! 😼🥊'),
        timeAgo: '3h ago',
      },
    ],
    sharesCount: 3410,
  },
  {
    id: 'reel_13',
    author: INITIAL_USERS[5], // Ramesh (feat. Benjamin)
    mediaUrl: '/reels/reel-viral-cat-dog.mp4',
    caption: 'Historic Inter-Species Summit: Ramesh & Benjamin sign the eternal treaty of mutual respect and shared snack rations! 🤝🐱🐶',
    tags: ['#PeaceTreaty', '#CatDogAlliance', '#RameshAndBenjamin', '#ViralPaw', '#DiplomacyInAction'],
    audioTrack: {
      title: 'Cat & Dog Treaty Accord',
      artist: 'Ramesh & Benjamin',
      url: '/sounds/animals/cat/cat_purr.mp3',
    },
    reactions: [
      { type: 'paw', count: 12400 },
      { type: 'fish', count: 6890 },
      { type: 'bone', count: 7120 },
    ],
    comments: [
      {
        id: 'rc13_1',
        author: 'Lady Dimitrescu',
        authorHandle: '@lady_dimitrescu',
        text: 'A commendable diplomatic gesture. The court approves 👑✨',
        textPS: translateToPawScript('A commendable diplomatic gesture. The court approves 👑✨'),
        timeAgo: '1h ago',
      },
    ],
    sharesCount: 6890,
  },
  {
    id: 'reel_14',
    author: INITIAL_USERS[7], // Lady Dimitrescu
    mediaUrl: '/reels/reel-mythic-post.jpeg',
    caption: 'Mythic Post: Lady Dimitrescu ascends to celestial guardian status. Gaze upon 40 inches of celestial majesty and weep with joy! 🌟👑🐈',
    tags: ['#MythicPost', '#CelestialAscension', '#LadyDimitrescu', '#FelineGoddess', '#RoyalAura'],
    audioTrack: {
      title: 'Celestial High Perch',
      artist: 'Lady Dimitrescu',
      url: '/sounds/animals/cat/cat_purr.mp3',
    },
    reactions: [
      { type: 'paw', count: 14200 },
      { type: 'fish', count: 8900 },
      { type: 'zoomies', count: 5400 },
    ],
    comments: [
      {
        id: 'rc14_1',
        author: 'Kalyani',
        authorHandle: '@kalyani_acrobat',
        text: 'The ethereal lighting complements your high perch perfectly meow! 🌟',
        textPS: translateToPawScript('The ethereal lighting complements your high perch perfectly meow! 🌟'),
        timeAgo: '3h ago',
      },
    ],
    sharesCount: 7420,
  },
];

export default function PetGramPage() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<'feed' | 'reels'>('feed');

  // User State
  const [currentUser, setCurrentUser] = useState<PetUser>(INITIAL_USERS[0]);
  const [userList, setUserList] = useState<PetUser[]>(INITIAL_USERS);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'switch' | 'signup'>('switch');

  // New Pet Form
  const [newPetName, setNewPetName] = useState('');
  const [newPetHandle, setNewPetHandle] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState('Dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetBio, setNewPetBio] = useState('');

  // Posts & Reels (SSR-safe initial defaults, sync with localStorage in useEffect)
  const [posts, setPosts] = useState<PetPost[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<PetReel[]>(INITIAL_REELS);

  // Active Reel for Reels View
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [isPlayingReel, setIsPlayingReel] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Modals & Drawers
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [drawerCommentText, setDrawerCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastWheelTime = useRef<number>(0);

  useEffect(() => {
    queueMicrotask(() => {
      // 1. Restore mode
      try {
        const savedMode = localStorage.getItem('pawpad_mode') as 'dark' | 'light';
        if (savedMode === 'dark' || savedMode === 'light') setMode(savedMode);
      } catch {}

      // 2. Restore and deduplicate custom posts
      try {
        const savedCustomPosts = localStorage.getItem('pawlingo_custom_posts');
        if (savedCustomPosts) {
          const parsed = JSON.parse(savedCustomPosts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const seenUrls = new Set<string>(INITIAL_POSTS.map((p) => p.imageUrl));
            const uniqueCustom: PetPost[] = [];
            for (const p of parsed) {
              if (p && p.imageUrl && !seenUrls.has(p.imageUrl)) {
                seenUrls.add(p.imageUrl);
                uniqueCustom.push(p);
              }
            }
            if (uniqueCustom.length !== parsed.length) {
              localStorage.setItem('pawlingo_custom_posts', JSON.stringify(uniqueCustom));
            }
            if (uniqueCustom.length > 0) {
              setPosts([...uniqueCustom, ...INITIAL_POSTS]);
            }
          }
        }
      } catch {}

      // 3. Restore custom reels
      try {
        const savedCustomReels = localStorage.getItem('pawlingo_custom_reels');
        if (savedCustomReels) {
          const parsed = JSON.parse(savedCustomReels);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReels([...parsed, ...INITIAL_REELS]);
          }
        }
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

  // Handle reel audio & video playback
  useEffect(() => {
    const currentAudio = audioRef.current;
    const currentVideo = videoRef.current;

    if (viewMode !== 'reels') {
      if (currentAudio) currentAudio.pause();
      if (currentVideo) currentVideo.pause();
      return;
    }

    const reel = reels[activeReelIdx];
    if (!reel) return;

    const isVideo = reel.mediaUrl.endsWith('.mp4');

    if (isVideo) {
      if (currentAudio) currentAudio.pause();
      if (currentVideo) {
        currentVideo.muted = isMuted;
        if (isPlayingReel) {
          currentVideo.play().catch(() => {});
        } else {
          currentVideo.pause();
        }
      }
    } else {
      if (currentVideo) currentVideo.pause();
      if (reel.audioTrack) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.loop = true;
        }
        const audio = audioRef.current;
        if (!audio.src.endsWith(reel.audioTrack.url)) {
          audio.src = reel.audioTrack.url;
        }
        audio.muted = isMuted;

        if (isPlayingReel) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
    }

    return () => {
      if (currentAudio) currentAudio.pause();
      if (currentVideo) currentVideo.pause();
    };
  }, [viewMode, activeReelIdx, isPlayingReel, isMuted, reels]);

  // Sync mute state immediately to active video/audio element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Keyboard navigation for reels (ArrowUp / ArrowDown, Space to pause, M to mute)
  useEffect(() => {
    if (viewMode !== 'reels') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        playTapTone();
        setActiveReelIdx((prev) => (prev + 1) % reels.length);
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        playTapTone();
        setActiveReelIdx((prev) => (prev - 1 + reels.length) % reels.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        playTapTone();
        setIsPlayingReel((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        playTapTone();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, reels.length]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleReaction = (targetId: string, reactionType: string) => {
    playTapTone();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== targetId) return p;
        const exists = p.reactions.find((r) => r.type === reactionType);
        let updated;
        if (exists) {
          updated = p.reactions.map((r) =>
            r.type === reactionType ? { ...r, count: r.count + 1 } : r
          );
        } else {
          updated = [...p.reactions, { type: reactionType, count: 1 }];
        }
        return { ...p, reactions: updated };
      })
    );
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== targetId) return r;
        const exists = r.reactions.find((rx) => rx.type === reactionType);
        let updated;
        if (exists) {
          updated = r.reactions.map((rx) =>
            rx.type === reactionType ? { ...rx, count: rx.count + 1 } : rx
          );
        } else {
          updated = [...r.reactions, { type: reactionType, count: 1 }];
        }
        return { ...r, reactions: updated };
      })
    );
  };

  const handleToggleBookmark = (id: string) => {
    playTapTone();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        triggerToast('Removed from Saved Paws');
      } else {
        next.add(id);
        triggerToast('Saved to Saved Paws 🐾');
      }
      return next;
    });
  };

  const handleDeletePost = (postId: string) => {
    playTapTone();
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== postId);
      try {
        const saved = localStorage.getItem('pawlingo_custom_posts');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const updated = parsed.filter((p: PetPost) => p.id !== postId);
            localStorage.setItem('pawlingo_custom_posts', JSON.stringify(updated));
          }
        }
      } catch {}
      return next;
    });
    triggerToast('Post removed from feed 🗑️');
  };

  const handleAddComment = (targetId: string) => {
    if (!drawerCommentText.trim()) return;
    playTapTone();
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      author: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      text: drawerCommentText,
      textPS: translateToPawScript(drawerCommentText),
      timeAgo: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== targetId) return p;
        return { ...p, comments: [newComment, ...p.comments] };
      })
    );
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== targetId) return r;
        return { ...r, comments: [newComment, ...r.comments] };
      })
    );

    setDrawerCommentText('');
    triggerToast('Comment posted in PawScript & English! 🐾');
  };

  const cardBg = mode === 'dark' ? 'bg-[#121216] border-white/10 text-white' : 'bg-white border-neutral-200 text-neutral-900';

  return (
    <IPadFrame
      appName="PetGram"
      appEmoji="📸"
      appColor="from-pink-500 via-rose-500 to-amber-500"
      rightActions={
        <div className="flex items-center gap-2">
          {/* Create Post Link */}
          <Link
            href="/petgram/create"
            onClick={() => playTapTone()}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Create Post</span>
          </Link>

          {/* User Profile Switcher */}
          <button
            onClick={() => {
              playTapTone();
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-full text-xs transition-all"
            title="Switch User Account"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-400"
            />
            <span className="hidden md:inline font-bold">{currentUser.name}</span>
          </button>
        </div>
      }
    >
      <div className={`flex-1 flex flex-col overflow-hidden ${mode === 'dark' ? 'bg-[#09090b] text-white' : 'bg-[#f8f9fa] text-neutral-900'} transition-colors duration-300`}>
        {/* Navigation Bar (Feed vs Reels) */}
        <div className={`px-4 py-2 border-b flex items-center justify-between z-20 ${mode === 'dark' ? 'bg-[#121216]/90 border-white/10' : 'bg-white/90 border-neutral-200'} backdrop-blur-md`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTapTone();
                setViewMode('feed');
              }}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'feed'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Camera size={14} />
              <span>Photo Feed</span>
            </button>
            <button
              onClick={() => {
                playTapTone();
                setViewMode('reels');
              }}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'reels'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film size={14} />
              <span>PawReels 🎬</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/petgram/create"
              onClick={() => playTapTone()}
              className="text-xs text-pink-400 hover:underline font-bold flex items-center gap-1"
            >
              <Sparkles size={12} />
              <span>Studio</span>
            </Link>
          </div>
        </div>

        {/* ==================== FEED VIEW ==================== */}
        {viewMode === 'feed' && (
          <div className="flex-1 overflow-y-auto pb-24">
            {/* Top Stories Tray */}
            <div className={`px-4 py-3 border-b overflow-x-auto flex items-center gap-4 select-none ${mode === 'dark' ? 'bg-[#0f0f13] border-white/10' : 'bg-white border-neutral-200'}`}>
              {/* Add Story Button */}
              <Link
                href="/petgram/create"
                onClick={() => playTapTone()}
                className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer"
              >
                <div className="relative w-14 h-14 rounded-full p-0.5 bg-neutral-700 group-hover:scale-105 transition-transform flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-neutral-900">
                    +
                  </div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 truncate max-w-[60px]">Your Story</span>
              </Link>

              {/* Story Bubbles with Uploaded Photos */}
              {INITIAL_USERS.filter((user) => user.id !== currentUser.id).map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    playTapTone();
                    triggerToast(`Viewing ${user.name}'s story highlights! 🐾`);
                  }}
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-neutral-900"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-300 truncate max-w-[64px]">{user.name}</span>
                </div>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
              {posts.map((post) => {
                const isBookmarked = bookmarkedIds.has(post.id);
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-3xl border overflow-hidden shadow-xl ${cardBg}`}
                  >
                    {/* Author Header */}
                    <div className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500/40"
                        />
                        <div>
                          <h4 className="font-bold text-sm leading-tight flex items-center gap-1">
                            <span>{post.author.name}</span>
                            <span className="text-xs opacity-75">{post.author.emoji}</span>
                          </h4>
                          <span className="text-[11px] text-neutral-400">{post.author.handle} • {post.timeAgo}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.id.startsWith('custom_') && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-full hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                            title="Delete custom post"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        {post.audioTrack && (
                          <button
                            onClick={() => {
                              playTapTone();
                              const audio = new Audio(post.audioTrack?.url);
                              audio.play().catch(() => {});
                              triggerToast(`Playing "${post.audioTrack?.title}" 🎵`);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-[10px] text-pink-400 font-bold"
                            title="Listen to Post Sound"
                          >
                            <Volume2 size={12} />
                            <span className="hidden sm:inline">Audio</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Post Image (Real uploaded photos) */}
                    <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Reaction Actions */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        {/* Species Reactions Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {['paw', 'bone', 'fish', 'zoomies', 'laugh'].map((rType) => {
                            const count = post.reactions.find((r) => r.type === rType)?.count || 0;
                            return (
                              <button
                                key={rType}
                                onClick={() => handleReaction(post.id, rType)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-pink-500/20 border border-white/10 text-xs font-bold transition-all active:scale-90"
                              >
                                <span>{getReactionEmoji(rType)}</span>
                                <span className="text-[11px] text-neutral-300">{count}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Right: Comments, Bookmark, Share */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveCommentPostId(post.id)}
                            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 transition-colors"
                            title="Comments"
                          >
                            <MessageCircle size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setShowShareModal(true);
                              setDrawerCommentText(post.caption);
                            }}
                            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 transition-colors"
                            title="Share"
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleBookmark(post.id)}
                            className={`p-1.5 rounded-full transition-colors ${
                              isBookmarked ? 'text-amber-400 bg-amber-400/20' : 'text-neutral-300 hover:bg-white/10'
                            }`}
                            title="Save Post"
                          >
                            <Bookmark size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Caption & PawScript Dual Translation */}
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm leading-relaxed">
                          <strong className="mr-1.5 font-bold">{post.author.name}</strong>
                          <span>{post.caption}</span>
                        </p>
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 mb-0.5">
                            <Sparkles size={11} /> PawScript Audio-Phonetic Glyph Translation:
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 break-words">
                            {translateToPawScript(post.caption)}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-[11px] text-pink-400 font-semibold hover:underline cursor-pointer">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Comments Preview */}
                      {post.comments.length > 0 && (
                        <button
                          onClick={() => setActiveCommentPostId(post.id)}
                          className="text-xs text-neutral-400 hover:underline font-semibold block pt-1"
                        >
                          View all {post.comments.length} comments in PawScript...
                        </button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== REELS VIEW ==================== */}
        {viewMode === 'reels' && (
          <div
            className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden relative"
            onWheel={(e) => {
              const now = Date.now();
              if (now - lastWheelTime.current < 450) return;
              if (Math.abs(e.deltaY) > 30) {
                lastWheelTime.current = now;
                playTapTone();
                if (e.deltaY > 0) {
                  setActiveReelIdx((prev) => (prev + 1) % reels.length);
                } else {
                  setActiveReelIdx((prev) => (prev - 1 + reels.length) % reels.length);
                }
              }
            }}
          >
            {reels[activeReelIdx] && (
              <div className="relative w-full max-w-sm h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black flex items-center justify-center select-none">
                {/* Progress bar at top edge */}
                <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 transition-all duration-100 ease-linear"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                {/* Media Element (Video with native audio OR Image) */}
                {reels[activeReelIdx].mediaUrl.endsWith('.mp4') ? (
                  <video
                    ref={videoRef}
                    key={reels[activeReelIdx].mediaUrl}
                    src={reels[activeReelIdx].mediaUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (v.duration) {
                        setVideoProgress((v.currentTime / v.duration) * 100);
                      }
                    }}
                    onPlay={() => setIsPlayingReel(true)}
                    onPause={() => setIsPlayingReel(false)}
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.paused) {
                          videoRef.current.play().catch(() => {});
                        } else {
                          videoRef.current.pause();
                        }
                      }
                    }}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={reels[activeReelIdx].mediaUrl}
                    alt={reels[activeReelIdx].caption}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setIsPlayingReel(!isPlayingReel)}
                  />
                )}

                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

                {/* Top Controls: Reel Audio Title, Counter & Sound Toggle */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs text-white max-w-[55%]">
                    <Disc className="animate-spin [animation-duration:4s] text-pink-400 shrink-0" size={14} />
                    <span className="font-bold truncate">{reels[activeReelIdx].audioTrack.title}</span>
                  </div>

                  {/* Reel Counter Pill */}
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-300 font-bold">
                    {activeReelIdx + 1} / {reels.length}
                  </div>

                  <button
                    onClick={() => {
                      playTapTone();
                      setIsMuted(!isMuted);
                    }}
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

                {/* Center Play / Pause Indicator */}
                {!isPlayingReel && (
                  <button
                    onClick={() => {
                      if (reels[activeReelIdx].mediaUrl.endsWith('.mp4') && videoRef.current) {
                        videoRef.current.play().catch(() => {});
                      } else {
                        setIsPlayingReel(true);
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer bg-black/30 backdrop-blur-[2px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/30 shadow-2xl hover:scale-110 transition-transform">
                      <Play size={28} className="ml-1 fill-white" />
                    </div>
                  </button>
                )}

                {/* Right Floating Actions */}
                <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
                  {/* Paw reaction */}
                  <button
                    onClick={() => handleReaction(reels[activeReelIdx].id, 'paw')}
                    className="flex flex-col items-center gap-1 group"
                    title="Give Paw Reaction"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 active:scale-95 transition-transform">
                      🐾
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {reels[activeReelIdx].reactions.find((r) => r.type === 'paw')?.count || 0}
                    </span>
                  </button>

                  {/* Comments */}
                  <button
                    onClick={() => {
                      playTapTone();
                      setActiveCommentPostId(reels[activeReelIdx].id);
                    }}
                    className="flex flex-col items-center gap-1 group"
                    title="Comments"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 active:scale-95 transition-transform">
                      <MessageCircle size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {reels[activeReelIdx].comments.length}
                    </span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() => handleToggleBookmark(reels[activeReelIdx].id)}
                    className="flex flex-col items-center gap-1 group"
                    title="Bookmark Reel"
                  >
                    <div className={`w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 active:scale-95 transition-transform ${bookmarkedIds.has(reels[activeReelIdx].id) ? 'text-amber-400' : 'text-white'}`}>
                      <Bookmark size={20} className={bookmarkedIds.has(reels[activeReelIdx].id) ? 'fill-amber-400' : ''} />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {bookmarkedIds.has(reels[activeReelIdx].id) ? 'Saved' : 'Save'}
                    </span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => {
                      playTapTone();
                      setShowShareModal(true);
                    }}
                    className="flex flex-col items-center gap-1 group"
                    title="Share Reel"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 active:scale-95 transition-transform">
                      <Share2 size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {reels[activeReelIdx].sharesCount}
                    </span>
                  </button>
                </div>

                {/* Bottom Metadata & Caption */}
                <div className="absolute bottom-4 inset-x-4 z-20 pr-14 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reels[activeReelIdx].author.avatar}
                      alt={reels[activeReelIdx].author.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-500 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-white leading-tight">
                          {reels[activeReelIdx].author.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/30 text-pink-300 font-semibold">
                          {reels[activeReelIdx].author.species}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-300 font-mono">
                        {reels[activeReelIdx].author.handle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white/95 leading-snug line-clamp-2 drop-shadow">
                    {reels[activeReelIdx].caption}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {reels[activeReelIdx].tags?.map((tag) => (
                      <span key={tag} className="text-[10px] text-pink-300 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-300 shadow-md">
                    {translateToPawScript(reels[activeReelIdx].caption)}
                  </div>
                </div>

                {/* Next / Previous Reel Chevrons */}
                <div className="absolute top-1/2 left-2 -translate-y-1/2 z-30">
                  <button
                    onClick={() => {
                      playTapTone();
                      setActiveReelIdx((prev) => (prev - 1 + reels.length) % reels.length);
                    }}
                    title="Previous Reel (↑ or K)"
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <ChevronUp size={18} />
                  </button>
                </div>
                <div className="absolute top-1/2 right-2 -translate-y-1/2 z-30">
                  <button
                    onClick={() => {
                      playTapTone();
                      setActiveReelIdx((prev) => (prev + 1) % reels.length);
                    }}
                    title="Next Reel (↓ or J)"
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Subtle Keyboard & Gesture Tip */}
            <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-2">
              <span>Swipe / Wheel or Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono text-[10px] border border-white/10">↑ / ↓</kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono text-[10px] border border-white/10">Space</kbd>
              <span>to pause</span>
            </div>
          </div>
        )}

        {/* ==================== COMMENTS DRAWER ==================== */}
        <AnimatePresence>
          {activeCommentPostId && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-10 md:bottom-10 md:w-96 z-50 rounded-3xl border border-white/20 p-5 shadow-2xl backdrop-blur-2xl flex flex-col max-h-[70vh] bg-neutral-900/95 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <MessageCircle size={16} className="text-pink-400" />
                  <span>Comments &amp; PawScript Stream</span>
                </h3>
                <button
                  onClick={() => setActiveCommentPostId(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {(
                  posts.find((p) => p.id === activeCommentPostId)?.comments ||
                  reels.find((r) => r.id === activeCommentPostId)?.comments ||
                  []
                ).map((c) => (
                    <div key={c.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-pink-300">{c.author}</span>
                        <span className="text-[10px] text-neutral-400">{c.timeAgo}</span>
                      </div>
                      <p className="text-xs text-neutral-200">{c.text}</p>
                      {c.textPS && (
                        <div className="font-mono text-[11px] text-amber-300 pt-0.5">
                          {c.textPS}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Input composer */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={drawerCommentText}
                  onChange={(e) => setDrawerCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(activeCommentPostId);
                  }}
                  placeholder="Leave a comment (auto-translates to PawScript)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <button
                  onClick={() => handleAddComment(activeCommentPostId)}
                  className="p-2 rounded-xl bg-pink-500 text-white hover:bg-pink-400 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== SHARE MODAL ==================== */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-6 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-96 z-50 rounded-3xl border border-white/20 p-5 shadow-2xl backdrop-blur-2xl bg-neutral-900/95 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <Share2 size={16} className="text-pink-400" />
                  <span>Share PetGram Post</span>
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-neutral-300">
                  Share with friends in PawChat or copy the direct PawLink:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="catpad://petgram/post/share-2026"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-neutral-300"
                  />
                  <button
                    onClick={() => {
                      playTapTone();
                      navigator.clipboard.writeText('catpad://petgram/post/share-2026');
                      triggerToast('Link copied to clipboard! 🐾');
                      setShowShareModal(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== AUTH / SWITCH USER MODAL ==================== */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] z-50 rounded-3xl border border-white/20 p-6 shadow-2xl backdrop-blur-2xl bg-neutral-900/95 text-white flex flex-col max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-pink-400" />
                  <h3 className="font-bold text-base">Pet Profiles &amp; Accounts</h3>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 my-4">
                <button
                  onClick={() => setAuthTab('switch')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    authTab === 'switch' ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  Switch Account
                </button>
                <button
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    authTab === 'signup' ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  + Add New Pet
                </button>
              </div>

              {authTab === 'switch' && (
                <div className="space-y-2">
                  {userList.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        playTapTone();
                        setCurrentUser(u);
                        setShowAuthModal(false);
                        triggerToast(`Switched to ${u.name} (${u.handle})! 🐾`);
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        currentUser.id === u.id
                          ? 'bg-pink-500/20 border-pink-500/50 ring-1 ring-pink-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
                        />
                        <div>
                          <div className="font-bold text-sm flex items-center gap-1">
                            <span>{u.name}</span>
                            <span className="text-xs">{u.emoji}</span>
                          </div>
                          <span className="text-xs text-neutral-400">{u.handle} • {u.breed}</span>
                        </div>
                      </div>
                      {currentUser.id === u.id && <Check size={16} className="text-pink-400" />}
                    </div>
                  ))}
                </div>
              )}

              {authTab === 'signup' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPetName || !newPetHandle) return;
                    playTapTone();
                    const newUser: PetUser = {
                      id: `user_${Date.now()}`,
                      name: newPetName,
                      handle: newPetHandle.startsWith('@') ? newPetHandle : `@${newPetHandle}`,
                      species: newPetSpecies,
                      breed: newPetBreed || `${newPetSpecies} Companion`,
                      avatar: newPetSpecies === 'Cat' ? '/pictures/cat/cat-taking-a-selfie.webp' : '/pictures/dog/funny-dog-pics-6-10-24-2024.webp',
                      isAvatarImage: true,
                      emoji: getAnimalEmoji(newPetSpecies),
                      bio: newPetBio || 'Happy pet on PetGram! 🐾',
                      followers: 1,
                      following: 10,
                    };
                    setUserList([newUser, ...userList]);
                    setCurrentUser(newUser);
                    setShowAuthModal(false);
                    triggerToast(`Welcome to PetGram, ${newUser.name}! 🐾`);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-bold text-neutral-300 mb-1 block">Pet Name</label>
                    <input
                      type="text"
                      required
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      placeholder="e.g. Luna or Benjamin"
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 mb-1 block">Pet Handle</label>
                    <input
                      type="text"
                      required
                      value={newPetHandle}
                      onChange={(e) => setNewPetHandle(e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 mb-1 block">Species</label>
                      <select
                        value={newPetSpecies}
                        onChange={(e) => setNewPetSpecies(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                      >
                        <option value="Cat">Cat 🐱</option>
                        <option value="Dog">Dog 🐶</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-300 mb-1 block">Breed</label>
                      <input
                        type="text"
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        placeholder="e.g. Golden Retriever"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 mb-1 block">Bio</label>
                    <input
                      type="text"
                      value={newPetBio}
                      onChange={(e) => setNewPetBio(e.target.value)}
                      placeholder="e.g. Friendly pup who loves tennis balls 🎾"
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-lg mt-2 cursor-pointer hover:from-pink-400 hover:to-rose-400 transition-all"
                  >
                    Create Pet Profile
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </IPadFrame>
  );
}
