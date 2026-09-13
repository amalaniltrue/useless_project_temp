'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Filter,
  MapPin,
  Sparkles,
  MessageCircle,
  Calendar,
  Send,
  Check,
  Volume2,
  VolumeX,
  User,
  Award,
  SlidersHorizontal,
  Upload,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { translateToPawScript, getAnimalEmoji } from '@/lib/pawscript';
import { playTapTone, playAppLaunchTone } from '@/lib/sounds';
import { IPadFrame } from '@/components/ui/IPadFrame';
import Link from 'next/link';

// ==========================================
// Types
// ==========================================

export interface PetMatrimonyProfile {
  id: string;
  name: string;
  age: number;
  species: 'Dog' | 'Cat';
  breed: string;
  gender: 'Male' | 'Female';
  location: string;
  imageUrl: string;
  audioSample: string;
  soundTitle: string;
  guardianName: string;
  guardianNote: string;
  lookingFor: string;
  matrimonyIntent: 'Matrimony & Companion' | 'Pedigree Breeding' | 'Regular Playmate' | 'Pack Explorer';
  temperament: string[];
  interests: string[];
  pawSign: string;
  compatibilityScore: number;
  vaccinated: boolean;
  neutered: boolean;
  pedigreeCertified: boolean;
  diet: string;
  about: string;
}

export interface MatrimonyDate {
  id: string;
  petProfile: PetMatrimonyProfile;
  dateTheme: string;
  themeIcon: string;
  location: string;
  dateTime: string;
  guardianAttending: boolean;
  status: 'Confirmed' | 'Pending Response';
}

export interface LoveMessage {
  id: string;
  petId: string;
  petName: string;
  senderName: string;
  text: string;
  textPS: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pet';
  text: string;
  textPS: string;
  timestamp: string;
  isDateInvite?: boolean;
  dateDetails?: {
    theme: string;
    themeIcon: string;
    location: string;
    dateTime: string;
    guardianAttending: boolean;
  };
}

let idCounter = 1000;
function getUniqueId(prefix: string): string {
  idCounter += 1;
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${idCounter}_${randomPart}`;
}

// ==========================================
// Preset Animal Matrimony Profiles (Cats & Dogs Only)
// Populated with verified local uploaded pictures & audio
// ==========================================

const INITIAL_PET_PROFILES: PetMatrimonyProfile[] = [
  {
    id: 'pet_luna',
    name: 'bombastic lady',
    age: 3,
    species: 'Dog',
    breed: 'Bombastic Siberian Husky',
    gender: 'Female',
    location: 'Denver, CO (Also Shimla pack)',
    imageUrl: '/images/animals/husky_snow.jpg',
    audioSample: '/sounds/animals/dog/dog_howl_pack.mp3',
    soundTitle: 'Alpine Pack Echo Howl',
    guardianName: 'Arjun (Alpine Trail Guide)',
    guardianNote: 'Looking for an energetic, disciplined canine soulmate for snowy trail expeditions.',
    lookingFor: 'Life Matrimony & Adventure Buddy',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Vocal Soloist', 'Energetic', 'Loyal', 'Bombastic Diva'],
    interests: ['Snow Running', 'Mountain Echoes', 'Howling at Moon', 'High-Protein Treats'],
    pawSign: '♐ Sagittarius Arctic Soloist',
    compatibilityScore: 98,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: true,
    diet: 'Raw Salmon & Wild Bison Kibble',
    about: 'Singing soprano in the alpine snow! The most bombastic lady seeking a brave, high-energy partner who loves mountain treks and howling into the starry skies. awoo howl!',
  },
  {
    id: 'pet_whiskers',
    name: 'ramesh',
    age: 4,
    species: 'Cat',
    breed: 'Selfie King Persian',
    gender: 'Male',
    location: 'San Francisco, CA (Also Mumbai)',
    imageUrl: '/pictures/cat/cat-taking-a-selfie.webp',
    audioSample: '/sounds/animals/cat/cat_purr.mp3',
    soundTitle: 'Purring Resonance Chamber',
    guardianName: 'Dr. Priya (Feline Veterinarian)',
    guardianNote: 'Uncle Ramesh has royal pedigree and needs a gentle, elegant feline companion.',
    lookingFor: 'Cozy Sunbeam Matrimony',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Aristocratic', 'Gentle Purrer', 'Calm', 'Selfie Master'],
    interests: ['Window Sunbeams', 'Gourmet Tuna', 'Camera Selfies', 'Velvet Pillows'],
    pawSign: '♉ Taurus Blanket Connoisseur',
    compatibilityScore: 92,
    vaccinated: true,
    neutered: true,
    pedigreeCertified: true,
    diet: 'Whitefish Filet + Organic Cat Grass',
    about: 'Distinguished gentlecat ramesh taking selfies in the morning sun! Seeking an affectionate partner to share sunlit windowsills, fine seafood dinners, and synchronized deep purring sessions. purr meow.',
  },
  {
    id: 'pet_barnaby',
    name: 'benjamin',
    age: 3,
    species: 'Dog',
    breed: 'Golden Retriever Scholar',
    gender: 'Male',
    location: 'Seattle, WA (Also Bangalore)',
    imageUrl: '/pictures/dog/funny-dog-with-surprised-expression-wearing-glasses-yellow-background_1089554-30720.webp',
    audioSample: '/sounds/animals/dog/dog_bark_play.mp3',
    soundTitle: 'Joyful Ball Play Bark',
    guardianName: 'Vikram (Software Architect)',
    guardianNote: 'Benjamin holds a PhD in treat retrieval, loves swimming, and wears spectacles with dignity.',
    lookingFor: 'Playful Matrimony & Fetch Soulmate',
    matrimonyIntent: 'Regular Playmate',
    temperament: ['Joyful', 'Intellectual', 'Water Splasher', 'Gentle Heart'],
    interests: ['Tennis Balls', 'Lake Swimming', 'Spectacles', 'Park Zoomies'],
    pawSign: '♌ Leo Sunshine Scholar',
    compatibilityScore: 96,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: true,
    diet: 'Slow-Cooked Chicken & Pumpkin Medley',
    about: 'A distinguished golden boy named benjamin with spectacles looking for a loving companion to run wild at the dog park, dive into freshwater lakes, and cuddle through Sunday movies. bark woof!',
  },
  {
    id: 'pet_hachi',
    name: 'samsung',
    age: 3,
    species: 'Dog',
    breed: 'Clover Field Scout',
    gender: 'Male',
    location: 'Kyoto / Austin, TX',
    imageUrl: '/pictures/dog/709ec4b7dd271e8be4452c6619dacfd2.webp',
    audioSample: '/sounds/animals/dog/dog_bark_greeting.mp3',
    soundTitle: 'Honorary Greeting Bow Bark',
    guardianName: 'Kenji & Mei',
    guardianNote: 'Samsung is ultra high-tech, reliable, and loves running through clover fields.',
    lookingFor: 'Noble Pedigree Partnership',
    matrimonyIntent: 'Pedigree Breeding',
    temperament: ['Loyal', 'Noble', 'High-Spec', 'Field Scout'],
    interests: ['Clover Meadows', 'Duck Jerky', 'Sunbathing', 'Trail Escorts'],
    pawSign: '♑ Capricorn Stoic Guardian',
    compatibilityScore: 90,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: true,
    diet: 'Kobe-Cut Dehydrated Beef & Brown Rice',
    about: 'High-spec clover scout named samsung with championship posture and Snapdragon zoomies! Looking for a gracious partner who appreciates field races and courtyard sunbaths. wan bark!',
  },
  {
    id: 'pet_cleo',
    name: 'kalyani',
    age: 2,
    species: 'Cat',
    breed: 'Naughty Acrobat Cat',
    gender: 'Female',
    location: 'London / Pune Sanctuary',
    imageUrl: '/pictures/cat/naughty.webp',
    audioSample: '/sounds/animals/cat/cat_trill_short.mp3',
    soundTitle: 'Curious Bengal Vocal Trill',
    guardianName: 'Zara (Wildlife Photographer)',
    guardianNote: 'Auntie Kalyani has endless curiosity and occasionally tips over unattended water glasses for science.',
    lookingFor: 'Playful Agility & Life Companion',
    matrimonyIntent: 'Pack Explorer',
    temperament: ['Athletic', 'Curious', 'Mischievous', 'Intelligent'],
    interests: ['Table Edge Physics', 'Running on Cat Wheel', 'Catnip Mice', 'High Ledges'],
    pawSign: '♈ Aries Agile Explorer',
    compatibilityScore: 95,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: true,
    diet: 'Raw Turkey Necks & Quail Eggs',
    about: 'Sleek acrobat auntie kalyani with a penchant for high altitudes and enthusiastic vocal conversations. Seeking an active partner who won\'t back down from a climbing challenge! mrr-oww!',
  },
  {
    id: 'pet_winston',
    name: 'microwave',
    age: 5,
    species: 'Cat',
    breed: 'White Persian 900W',
    gender: 'Male',
    location: 'Oxford / Boston',
    imageUrl: '/images/animals/persian_cat.jpg',
    audioSample: '/sounds/animals/cat/dragon-studio-cute-cat-meow-472372.mp3',
    soundTitle: 'Gentle Royal Meow',
    guardianName: 'Arthur (Literature Professor)',
    guardianNote: 'Microwave spends his days humming softly beside warm electronics. Looking for a cozy feline companion.',
    lookingFor: 'Formal Feline Matrimony',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Calm', 'Warm Humming', 'Chunky Cheeks', 'Polite'],
    interests: ['Wool Blankets', 'Warm Laptop Keyboards', 'Salmon Pâté', 'High-Heat Napping'],
    pawSign: '♎ Libra Harmonious Purrer',
    compatibilityScore: 91,
    vaccinated: true,
    neutered: true,
    pedigreeCertified: true,
    diet: 'Organic Scottish Salmon Pate',
    about: 'Plush round cheeks humming on defrost mode. Microwave enjoys peaceful afternoons warming up blankets and soft classical music. Looking for his forever heating pad partner. purr meow.',
  },
  {
    id: 'pet_pierre',
    name: 'missile',
    age: 4,
    species: 'Dog',
    breed: 'French Bulldog',
    gender: 'Male',
    location: 'Paris / New York',
    imageUrl: '/images/animals/french_bulldog.jpg',
    audioSample: '/sounds/animals/dog/dog_bark_alert.mp3',
    soundTitle: 'Playful Frenchie Snort & Bark',
    guardianName: 'Camille (Fashion Stylist)',
    guardianNote: 'Missile is a certified heat-seeking cuddle missile and cafe patio socialite.',
    lookingFor: 'Cozy Sofa Matrimony',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Charismatic', 'Heat Seeking', 'Funny', 'Snuggly'],
    interests: ['Sidewalk Cafes', 'Squeaky Croissants', 'Target Locking on Pillows', 'Pillow Forts'],
    pawSign: '♋ Cancer Cozy Snuggler',
    compatibilityScore: 89,
    vaccinated: true,
    neutered: true,
    pedigreeCertified: true,
    diet: 'Grain-Free Venison & Sweet Potato',
    about: 'Heat-seeking missile dog in a bowtie! Launched directly at your lap for snuggle detonation. Seeking a sweet companion for brunch park walks and synchronized couch naps. snort bark!',
  },
  {
    id: 'pet_flash',
    name: 'shantha',
    age: 3,
    species: 'Dog',
    breed: 'High-Speed Zoomies Hound',
    gender: 'Female',
    location: 'Sydney / Bangalore',
    imageUrl: '/pictures/dog/funny-dog-pics-6-10-24-2024.webp',
    audioSample: '/sounds/animals/dog/dog_pant_active.mp3',
    soundTitle: 'Zoomies Rapid Panting & Bark',
    guardianName: 'Chloe (Veterinary Nurse)',
    guardianNote: 'Shantha runs at Mach 3 through the lawn and manages household discipline with a huge smile.',
    lookingFor: 'Agility Champion Marriage',
    matrimonyIntent: 'Pedigree Breeding',
    temperament: ['Brilliant', 'High Energy', 'Disciplined', 'Contagious Smile'],
    interests: ['Frisbee Catching', 'Weave Poles', 'Inspection Walks', 'Herding Balls'],
    pawSign: '♊ Gemini Quick Thinker',
    compatibilityScore: 94,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: true,
    diet: 'High-Calorie Kangaroo & Sweet Potato Formula',
    about: 'Auntie shantha the zoomies champion! Keeps everyone in line with high-speed patrols and warm tail wags. Looking for a smart, spirited mate to build a champion pack! bark bark!',
  },
  {
    id: 'pet_milo',
    name: 'asbestos',
    age: 1,
    species: 'Cat',
    breed: 'Ginger Tabby Hazard',
    gender: 'Male',
    location: 'Kyoto / Chicago',
    imageUrl: '/images/animals/kitten_playful.jpg',
    audioSample: '/sounds/animals/cat/cat_mew_cute.mp3',
    soundTitle: 'Playful Kitten Trill & Purr',
    guardianName: 'Rohan & Ananya',
    guardianNote: 'Asbestos is full of hazardous kitten energy and seeks a playful young partner to explore the house with.',
    lookingFor: 'Playdate Companion & Growing Matrimony',
    matrimonyIntent: 'Regular Playmate',
    temperament: ['Hazardous', 'Spirited', 'Kitten Energy', 'Playful'],
    interests: ['Cardboard Boxes', 'Laser Pointers', 'Shoelace Pouncing', 'Spreading Chaos'],
    pawSign: '♓ Pisces Dreamy Pouncer',
    compatibilityScore: 93,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: false,
    diet: 'Kitten Growth Recipe + Goat Milk Broth',
    about: 'Hazardous ginger boy asbestos! Spreading untamed 3 AM airborne zoomies across the hallway. Looking for a brave partner to inspect every corner of the house. mew mew purr!',
  },
  {
    id: 'pet_emotional_damage',
    name: 'emotional damage',
    age: 3,
    species: 'Cat',
    breed: 'Dramatic Scottish Fold',
    gender: 'Female',
    location: 'Tokyo / New York',
    imageUrl: '/pictures/cat/portrait-of-a-scared-cat.webp',
    audioSample: '/sounds/animals/cat/cat_meow_attention.wav',
    soundTitle: 'Dramatic Judgmental Meow',
    guardianName: 'Sora & Ken',
    guardianNote: 'Delivers 100% emotional damage with one unblinking look if treats are delayed by 3 seconds.',
    lookingFor: 'Stoic Soulmate & Drama Partner',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Dramatic', 'Judgmental', 'Expressive', 'Intense Stare'],
    interests: ['Judging Humans', 'Vacuum Patrol', 'Refrigerated Summits', 'Gourmet Sashimi'],
    pawSign: '♏ Scorpio Emotional Destroyer',
    compatibilityScore: 94,
    vaccinated: true,
    neutered: true,
    pedigreeCertified: true,
    diet: 'Freeze-Dried Chicken Hearts & Tuna Broth',
    about: 'World-renowned practitioner of emotional damage. One side-eye glance will make you question all your life choices. Seeking a partner who can withstand intense psychological eye contact. hiss meow.',
  },
  {
    id: 'pet_lady_dimitrescu',
    name: 'lady dimitrescu',
    age: 5,
    species: 'Cat',
    breed: 'Towering 9-Foot Fluff Empress',
    gender: 'Female',
    location: 'Castle Dimitrescu / Milan',
    imageUrl: '/pictures/cat/COaEeSIpWQW-png__700.webp',
    audioSample: '/sounds/animals/cat/cat_purr.mp3',
    soundTitle: 'Imperial Castle Purr',
    guardianName: 'Countess Bella & Sisters',
    guardianNote: 'Lady Dimitrescu demands silver bowls, royal cushions, and utmost obedience.',
    lookingFor: 'Imperial Royal Matrimony',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Imposing', 'Imperial', 'Majestic', 'Aristocratic'],
    interests: ['Velvet Capes', 'Silver Bowls', 'Looking Down From Heights', 'Vintage Catnip'],
    pawSign: '♑ Capricorn Sovereign Matriarch',
    compatibilityScore: 96,
    vaccinated: true,
    neutered: true,
    pedigreeCertified: true,
    diet: 'Wagyu Beef Filets & Fresh Salmon Caviar',
    about: 'The 9-foot fluffy empress lady dimitrescu! Bow down and present the gourmet pâté. Seeking an aristocratic consort worthy of sharing the castle balustrade. purr meow.',
  },
  {
    id: 'pet_big_mom',
    name: 'big mom',
    age: 4,
    species: 'Dog',
    breed: 'Empress Sovereign Bulldog',
    gender: 'Female',
    location: 'Whole Cake Park / London',
    imageUrl: '/pictures/dog/funny-dog-pics-19-10-24-2024.webp',
    audioSample: '/sounds/animals/dog/dog_bark_alert.mp3',
    soundTitle: 'Commanding Empress Bark',
    guardianName: 'Linlin & Family',
    guardianNote: 'Big Mom demands gourmet biscuits, wedding cake samples, and royal reverence.',
    lookingFor: 'Supreme Royal Dog Matrimony',
    matrimonyIntent: 'Matrimony & Companion',
    temperament: ['Commanding', 'Gourmet Lover', 'Protective', 'Empress'],
    interests: ['Wedding Cakes', 'Territory Patrol', 'Gourmet Bones', 'Velvet Throneroom'],
    pawSign: '♌ Leo Sovereign Empress',
    compatibilityScore: 97,
    vaccinated: true,
    neutered: false,
    pedigreeCertified: true,
    diet: 'Kobe Beef Meatballs & Blueberry Biscuits',
    about: 'The supreme empress big mom! Ruler of the living room sofa throne. Seeking a loyal partner worthy of joining the family fleet. LIFE OR WEDDING CAKE! bark bark!',
  },
];

// Contextual Simulated Replies for Interactive 1-on-1 Pet Chat
const PET_CHAT_REPLIES: Record<string, string[]> = {
  pet_luna: [
    "Awoooo! 🐺 Mountain trails are calling! I'm so thrilled to sniff and run zoomies with you! howl awoo!",
    "Snow is falling in the high country! Are you ready for an alpine trek together? ❄️🐾",
    "I just finished my evening howl. Your message made my tail wag with joy! awoo!",
  ],
  pet_whiskers: [
    "Purrr... 🐱 The afternoon sunbeam is warm today. I would be honored to share my velvet cushion with you. purr meow.",
    "A distinguished gentlecat appreciates your sweet message. Shall we arrange a gourmet salmon tasting? 🐟✨",
    "Synchronized purring is the highest form of feline harmony. You seem pawsitively lovely! purr.",
  ],
  pet_barnaby: [
    "Woof woof! 🎾 I found the best yellow tennis ball today! Can we go to the meadow and play fetch together? bark bark!",
    "Belly rubs and park zoomies are my top hobbies! My guardian Vikram says hello to your family too! 🐕💕",
    "Did someone say lake swimming? I'm already wagging my tail so fast! woof bark!",
  ],
  pet_hachi: [
    "Wan wan! 🐕 A dignified bow to you. Respectful companions make the best lifelong partners. bow wan!",
    "Kyoto garden walks in the autumn breeze are majestic. I would be pleased to walk beside you. wan!",
  ],
  pet_cleo: [
    "Mrr-oww! 🐆 My athletic instincts approve of your match! Let's chase feathers and bird watch together! meow purr!",
    "Bengal agility meets handsome charm. We are going to be unstoppable at agility playdates! purr!",
  ],
  pet_winston: [
    "Purr... 🧐 A refined correspondence indeed. The teatime salmon pâté awaits our distinguished matrimonial gathering. purr.",
    "British elegance requires careful companionship. You passed my sniff test with flying colours! 🐾🎩",
  ],
  pet_pierre: [
    "Snort snort! 🐶 Couch snuggles and afternoon nap zoomies are my specialty. Very thrilled to be your match!",
    "Bonjour! I have reserved the softest velvet pillow on the sofa just for us. snort woof!",
  ],
  pet_flash: [
    "Bark! ⚡ Ready for maximum agility obstacle courses! We will make a championship-level pair! bark pant!",
    "Zoomies at speed 100! Let's show everyone at the dog park what true pack chemistry looks like! woof!",
  ],
  pet_milo: [
    "Mew mew! 🐱 Let's chase sunbeams and bat yarn balls across the living room! purr mew!",
    "I might be a young kitten, but I have the biggest heart! Will you cuddle with me? mew purr!",
  ],
};

export default function PawMatchPage() {
  // Persona Mode: Pet Parent / Guardian vs Autonomous Pet
  const [matchingRole, setMatchingRole] = useState<'guardian' | 'pet'>('guardian');

  // User's Registered Pet Profile & Account Status
  const [myPet, setMyPet] = useState<PetMatrimonyProfile>(INITIAL_PET_PROFILES[2]); // Barnaby
  const [hasCustomAccount, setHasCustomAccount] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Profiles and Current Card Index
  const [profiles] = useState<PetMatrimonyProfile[]>(INITIAL_PET_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Card details expander
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<'All' | 'Dog' | 'Cat'>('All');
  const [selectedIntent, setSelectedIntent] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [pedigreeOnly, setPedigreeOnly] = useState(false);

  // Swiping motion
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  // Audio preview
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals & Interaction Flows
  const [showLikeMessageModal, setShowLikeMessageModal] = useState(false);
  const [likeTarget, setLikeTarget] = useState<PetMatrimonyProfile | null>(null);
  const [likeMessageText, setLikeMessageText] = useState('');

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<PetMatrimonyProfile | null>(null);

  const [showDateModal, setShowDateModal] = useState(false);
  const [dateTarget, setDateTarget] = useState<PetMatrimonyProfile | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('Park Fetch & Sniff Zoomies');
  const [dateLocation, setDateLocation] = useState('Central Canine Meadow');
  const [dateDayTime, setDateDayTime] = useState('Saturday afternoon, 3:00 PM');
  const [guardianPresence, setGuardianPresence] = useState(true);

  // Interactive 1-on-1 Chat
  const [activeChatPet, setActiveChatPet] = useState<PetMatrimonyProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [isPetTyping, setIsPetTyping] = useState(false);

  // Saved Data lists
  const [matchesList, setMatchesList] = useState<PetMatrimonyProfile[]>([]);
  const [scheduledDates, setScheduledDates] = useState<MatrimonyDate[]>([]);
  const [loveMessages, setLoveMessages] = useState<LoveMessage[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'chats' | 'dates' | 'letters'>('chats');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regSpecies, setRegSpecies] = useState<'Dog' | 'Cat'>('Dog');
  const [regBreed, setRegBreed] = useState('');
  const [regAge, setRegAge] = useState(2);
  const [regGender, setRegGender] = useState<'Male' | 'Female'>('Male');
  const [regGuardian, setRegGuardian] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regImage, setRegImage] = useState('/images/animals/golden_retriever.jpg');
  const [regIntent, setRegIntent] = useState<'Matrimony & Companion' | 'Pedigree Breeding' | 'Regular Playmate' | 'Pack Explorer'>('Matrimony & Companion');
  const [regBio, setRegBio] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered Profiles
  const filteredProfiles = profiles.filter((p) => {
    if (p.id === myPet.id) return false;
    const matchesSpecies = selectedSpecies === 'All' || p.species === selectedSpecies;
    const matchesIntent = selectedIntent === 'All' || p.matrimonyIntent === selectedIntent;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    const matchesPedigree = !pedigreeOnly || p.pedigreeCertified;
    return matchesSpecies && matchesIntent && matchesGender && matchesPedigree;
  });

  const currentProfile = filteredProfiles[currentIndex % Math.max(1, filteredProfiles.length)];

  // Restore saved data and stop audio on unmount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedRole = localStorage.getItem('pawmatch_role');
        if (savedRole === 'guardian' || savedRole === 'pet') setMatchingRole(savedRole);

        const savedProfile = localStorage.getItem('pawmatch_my_profile');
        if (savedProfile) {
          setMyPet(JSON.parse(savedProfile));
          setHasCustomAccount(true);
        }

        const sMatches = localStorage.getItem('pawmatch_matches');
        if (sMatches) setMatchesList(JSON.parse(sMatches));

        const sDates = localStorage.getItem('pawmatch_dates');
        if (sDates) setScheduledDates(JSON.parse(sDates));

        const sMessages = localStorage.getItem('pawmatch_messages');
        if (sMessages) setLoveMessages(JSON.parse(sMessages));
      } catch {}
    });

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Play/Stop voice sample
  const toggleVoiceSample = (profile: PetMatrimonyProfile) => {
    playTapTone();
    if (playingAudioId === profile.id) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    audioRef.current = new Audio(profile.audioSample);
    audioRef.current.onended = () => setPlayingAudioId(null);
    audioRef.current.play().catch(() => {});
    setPlayingAudioId(profile.id);
  };

  // Pass action
  const handlePass = useCallback(() => {
    if (!currentProfile) return;
    playTapTone();
    setDirection('left');
    setShowCardDetails(false);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 280);
  }, [currentProfile]);

  // Touch Heart action -> Prompts Send Message Modal
  const handleHeartClick = () => {
    if (!currentProfile) return;
    playTapTone();
    setLikeTarget(currentProfile);
    setLikeMessageText('');
    setShowLikeMessageModal(true);
  };

  // Like & Message Confirmation -> Triggers Mutual Match Celebration
  const handleConfirmLikeAndMessage = (customMsg?: string) => {
    if (!likeTarget) return;
    playAppLaunchTone();

    const messageText = customMsg !== undefined ? customMsg : likeMessageText.trim();
    const finalMsg = messageText || `Hello ${likeTarget.name}! I loved your profile and would love to match! 🐾`;

    // 1. Record Love Message
    const newMsg: LoveMessage = {
      id: getUniqueId('msg'),
      petId: likeTarget.id,
      petName: likeTarget.name,
      senderName: matchingRole === 'guardian' ? `${myPet.name} (via ${myPet.guardianName})` : myPet.name,
      text: finalMsg,
      textPS: translateToPawScript(finalMsg),
      timestamp: 'Just now',
    };

    const updatedMsgs = [newMsg, ...loveMessages];
    setLoveMessages(updatedMsgs);
    try {
      localStorage.setItem('pawmatch_messages', JSON.stringify(updatedMsgs));
    } catch {}

    // 2. Mutual Match
    const updatedMatches = matchesList.some((p) => p.id === likeTarget.id)
      ? matchesList
      : [likeTarget, ...matchesList];
    setMatchesList(updatedMatches);
    try {
      localStorage.setItem('pawmatch_matches', JSON.stringify(updatedMatches));
    } catch {}

    // 3. Initialize chat thread
    const defaultReplies = PET_CHAT_REPLIES[likeTarget.id] || [
      `Woof/Meow! ${likeTarget.name} loved your message! Let's get to know each other! 🐾`,
    ];
    const initialReply = defaultReplies[0];

    const initialThread: ChatMessage[] = [
      {
        id: getUniqueId('chat_usr'),
        sender: 'user',
        text: finalMsg,
        textPS: translateToPawScript(finalMsg),
        timestamp: 'Just now',
      },
      {
        id: getUniqueId('chat_pet'),
        sender: 'pet',
        text: initialReply,
        textPS: translateToPawScript(initialReply),
        timestamp: 'Just now',
      },
    ];
    try {
      localStorage.setItem(`pawmatch_chat_${likeTarget.id}`, JSON.stringify(initialThread));
    } catch {}

    // 4. Advance Card and open Celebration Modal
    setShowLikeMessageModal(false);
    setDirection('right');
    setShowCardDetails(false);
    setMatchedProfile(likeTarget);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
      setShowMatchModal(true);
    }, 300);
  };

  // Open Chat
  const handleOpenChat = (pet: PetMatrimonyProfile) => {
    playTapTone();
    setActiveChatPet(pet);
    setShowMatchModal(false);
    setShowDrawer(false);

    try {
      const savedThread = localStorage.getItem(`pawmatch_chat_${pet.id}`);
      if (savedThread) {
        setChatMessages(JSON.parse(savedThread));
      } else {
        const defaultReplies = PET_CHAT_REPLIES[pet.id] || [
          `Woof/Meow! ${pet.name} is delighted to match with you! 🐾`,
        ];
        const newThread: ChatMessage[] = [
          {
            id: `chat_init_1`,
            sender: 'pet',
            text: defaultReplies[0],
            textPS: translateToPawScript(defaultReplies[0]),
            timestamp: 'Just now',
          },
        ];
        setChatMessages(newThread);
        localStorage.setItem(`pawmatch_chat_${pet.id}`, JSON.stringify(newThread));
      }
    } catch {
      setChatMessages([]);
    }
  };

  // Send message in 1-on-1 Chat
  const handleSendChatMessage = () => {
    if (!chatInputText.trim() || !activeChatPet) return;
    playTapTone();

    const userMsg: ChatMessage = {
      id: getUniqueId('chat_user'),
      sender: 'user',
      text: chatInputText.trim(),
      textPS: translateToPawScript(chatInputText.trim()),
      timestamp: 'Just now',
    };

    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInputText('');
    try {
      localStorage.setItem(`pawmatch_chat_${activeChatPet.id}`, JSON.stringify(updated));
    } catch {}

    // Pet Simulated Reply with Typing Indicator
    setIsPetTyping(true);
    setTimeout(() => {
      const replies = PET_CHAT_REPLIES[activeChatPet.id] || [
        `Woof! ${activeChatPet.name} wags tail with happiness! 🐾`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const petMsg: ChatMessage = {
        id: getUniqueId('chat_pet'),
        sender: 'pet',
        text: randomReply,
        textPS: translateToPawScript(randomReply),
        timestamp: 'Just now',
      };

      const threadWithReply = [...updated, petMsg];
      setChatMessages(threadWithReply);
      setIsPetTyping(false);
      try {
        localStorage.setItem(`pawmatch_chat_${activeChatPet.id}`, JSON.stringify(threadWithReply));
      } catch {}
    }, 1200);
  };

  // Schedule a Matrimony Playdate
  const handleScheduleDate = () => {
    if (!dateTarget) return;
    playAppLaunchTone();

    const themeIcons: Record<string, string> = {
      'Park Fetch & Sniff Zoomies': '🌳',
      'Catnip Lounge & Sunbeam Nap': '☕',
      'Beach Splash & Sand Digging': '🏖️',
      'Gourmet Salmon & Bone Tasting': '🥩',
      'Window Bird Watch & Cat Teaser Session': '🪟',
    };

    const newDate: MatrimonyDate = {
      id: getUniqueId('date'),
      petProfile: dateTarget,
      dateTheme: selectedTheme,
      themeIcon: themeIcons[selectedTheme] || '🐾',
      location: dateLocation,
      dateTime: dateDayTime,
      guardianAttending: guardianPresence,
      status: 'Confirmed',
    };

    const updatedDates = [newDate, ...scheduledDates];
    setScheduledDates(updatedDates);
    try {
      localStorage.setItem('pawmatch_dates', JSON.stringify(updatedDates));
    } catch {}

    // Insert date into chat thread if exists
    try {
      const threadKey = `pawmatch_chat_${dateTarget.id}`;
      const savedThread = localStorage.getItem(threadKey);
      const currentThread: ChatMessage[] = savedThread ? JSON.parse(savedThread) : [];

      const inviteMsg: ChatMessage = {
        id: getUniqueId('chat_invite'),
        sender: 'user',
        text: `🎟️ Matrimony Date Invitation: ${selectedTheme} at ${dateLocation} on ${dateDayTime}`,
        textPS: translateToPawScript(`Date proposal: ${selectedTheme}`),
        timestamp: 'Just now',
        isDateInvite: true,
        dateDetails: {
          theme: selectedTheme,
          themeIcon: themeIcons[selectedTheme] || '🐾',
          location: dateLocation,
          dateTime: dateDayTime,
          guardianAttending: guardianPresence,
        },
      };

      const petAcceptMsg: ChatMessage = {
        id: getUniqueId('chat_accept'),
        sender: 'pet',
        text: `Paw-fect! Date Accepted! 💍 We have marked ${dateDayTime} at ${dateLocation} on our calendar. Looking forward to meeting you! 🐾🎉`,
        textPS: translateToPawScript('Date Accepted! Looking forward to meeting!'),
        timestamp: 'Just now',
      };

      const updatedChat = [...currentThread, inviteMsg, petAcceptMsg];
      localStorage.setItem(threadKey, JSON.stringify(updatedChat));
      if (activeChatPet?.id === dateTarget.id) {
        setChatMessages(updatedChat);
      }
    } catch {}

    setShowDateModal(false);
    setShowMatchModal(false);
    if (!activeChatPet) {
      setShowDrawer(true);
      setDrawerTab('dates');
    }
  };

  // Custom Photo File Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setRegImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAppLaunchTone();

    const newProfile: PetMatrimonyProfile = {
      id: hasCustomAccount ? myPet.id : `pet_custom_${Date.now()}`,
      name: regName.trim() || 'My Furry Soul',
      age: Number(regAge) || 2,
      species: regSpecies,
      breed: regBreed.trim() || (regSpecies === 'Dog' ? 'Golden Cross' : 'Domestic Shorthair'),
      gender: regGender,
      location: regLocation.trim() || 'Nearby',
      imageUrl: regImage || (regSpecies === 'Dog' ? '/images/animals/golden_retriever.jpg' : '/images/animals/persian_cat.jpg'),
      audioSample: regSpecies === 'Dog' ? '/sounds/animals/dog/dog_bark_play.mp3' : '/sounds/animals/cat/cat_purr.mp3',
      soundTitle: regSpecies === 'Dog' ? 'Happy Tail Bark' : 'Content Purr',
      guardianName: regGuardian.trim() || 'Pet Guardian',
      guardianNote: regBio.trim() || 'Loving pet seeking companion for matrimony & playdates.',
      lookingFor: 'Lifelong Matrimony & Companion',
      matrimonyIntent: regIntent,
      temperament: ['Loving', 'Playful', 'Parent Verified'],
      interests: ['Walks', 'Treats', 'Cuddles', 'Adventures'],
      pawSign: '🌟 Lucky Paw Sign',
      compatibilityScore: 99,
      vaccinated: true,
      neutered: false,
      pedigreeCertified: true,
      diet: 'Nutrient Rich Fresh Recipe',
      about: regBio.trim() || 'Friendly pet looking for lifelong furry soulmate!',
    };

    setMyPet(newProfile);
    setHasCustomAccount(true);
    try {
      localStorage.setItem('pawmatch_my_profile', JSON.stringify(newProfile));
    } catch {}
    setShowRegisterModal(false);
  };

  const icebreakerOptions = [
    'Meow! Your sunbeam photos are pawsitively breathtaking ☀️🐾',
    'Wanna run zoomies at the dog park this Saturday? 🎾💨',
    'Awoooo! Let us howl at the full moon together! 🌕🐺',
    'Purr... I would happily share my gourmet tuna platter with you 🐟',
    'Hello! Looking for a certified companion for lifelong marriage 📜💍',
  ];

  return (
    <IPadFrame
      appName="PawMatch"
      appEmoji="💍"
      appColor="from-rose-500 via-pink-500 to-amber-500"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTapTone();
              setShowDrawer(true);
              setDrawerTab('dates');
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30 hover:bg-rose-500/20 transition-colors cursor-pointer"
            title="Scheduled Matrimony Dates"
          >
            <span>🎟️ Dates: {scheduledDates.length}</span>
          </button>
        </div>
      }
    >
      <div className="flex-1 flex flex-col overflow-y-auto select-none font-sans scrollbar-hide pb-16">
        {/* ============================================================ */}
        {/* 👑 TOP MATRIMONY NAVIGATION HEADER */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-rose-100 dark:border-white/10 shadow-xs px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Brand & Badge */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent flex items-center gap-1 tracking-tight">
                <span>PawMatch</span>
                <span className="text-base">💍</span>
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                Pet Matrimony &amp; Playdates
              </span>
            </div>

            {/* Persona Switcher, Account Creation & Chat Trigger */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Guardian vs Autonomous Pet Mode Toggle */}
              <div className="flex bg-rose-50/90 dark:bg-neutral-800 p-0.5 rounded-full border border-rose-200 dark:border-neutral-700 text-xs font-bold">
                <button
                  onClick={() => {
                    playTapTone();
                    setMatchingRole('guardian');
                    try {
                      localStorage.setItem('pawmatch_role', 'guardian');
                    } catch {}
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
                    matchingRole === 'guardian'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-rose-900 dark:text-gray-300 hover:text-rose-700'
                  }`}
                  title="Pet Parent / Guardian Mode"
                >
                  <User size={13} />
                  <span className="hidden md:inline">Guardian</span>
                </button>
                <button
                  onClick={() => {
                    playTapTone();
                    setMatchingRole('pet');
                    try {
                      localStorage.setItem('pawmatch_role', 'pet');
                    } catch {}
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
                    matchingRole === 'pet'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-900 dark:text-gray-300 hover:text-purple-700'
                  }`}
                  title="Autonomous Pet Solo Mode"
                >
                  <span>🐾</span>
                  <span className="hidden md:inline">Pet Solo</span>
                </button>
              </div>

              {/* Create Pet Account / My Profile Button */}
              <button
                onClick={() => {
                  playTapTone();
                  setRegName(myPet.name);
                  setRegSpecies(myPet.species);
                  setRegBreed(myPet.breed);
                  setRegAge(myPet.age);
                  setRegGender(myPet.gender);
                  setRegGuardian(myPet.guardianName);
                  setRegLocation(myPet.location);
                  setRegImage(myPet.imageUrl);
                  setRegIntent(myPet.matrimonyIntent);
                  setRegBio(myPet.about);
                  setShowRegisterModal(true);
                }}
                className={`flex items-center gap-1.5 p-1 pl-2.5 rounded-full border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  hasCustomAccount
                    ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 text-gray-800 dark:text-gray-200'
                    : 'border-rose-400 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-95'
                }`}
                title={hasCustomAccount ? "Edit Pet Profile" : "Create Pet Account"}
              >
                {hasCustomAccount ? (
                  <>
                    <span className="truncate max-w-[80px]">{myPet.name}</span>
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={myPet.imageUrl} alt={myPet.name} className="w-full h-full object-cover" />
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Create Profile</span>
                  </>
                )}
              </button>

              {/* Matches & Chats Drawer Button */}
              <button
                onClick={() => {
                  playTapTone();
                  setShowDrawer(true);
                  setDrawerTab('chats');
                }}
                className="relative p-2 rounded-full bg-rose-50 dark:bg-neutral-800 hover:bg-rose-100 dark:hover:bg-neutral-700 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-neutral-700 transition-all cursor-pointer"
                title="My Matches, Chats & Dates"
              >
                <Heart size={16} className="fill-rose-500 text-rose-500" />
                {matchesList.length + scheduledDates.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full font-bold flex items-center justify-center">
                    {matchesList.length + scheduledDates.length}
                  </span>
                )}
              </button>

              {/* Filter Toggle Button */}
              <button
                onClick={() => {
                  playTapTone();
                  setShowFilters(!showFilters);
                }}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  showFilters
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50'
                }`}
                title="Filter by species, intent or pedigree"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Sub-Banner: Current Persona Status */}
        <div className="bg-rose-50/50 dark:bg-neutral-900/60 border-b border-rose-100/60 dark:border-neutral-800 py-1.5 px-4 text-center text-xs text-gray-600 dark:text-gray-400">
          {matchingRole === 'guardian' ? (
            <span>
              👨‍👩‍👧 <strong>Guardian Matrimony Search:</strong> Finding companion for{' '}
              <strong className="text-rose-700 dark:text-rose-400">{myPet.name}</strong> ({myPet.breed}) • Managed by{' '}
              <strong>{myPet.guardianName}</strong>
            </span>
          ) : (
            <span>
              🐾 <strong>Autonomous Pet Dating:</strong> Browsing matches directly as{' '}
              <strong className="text-purple-700 dark:text-purple-400">{myPet.name}</strong> ({myPet.breed})
            </span>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-4 w-full">
          {/* Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-rose-200 dark:border-neutral-800 shadow-sm space-y-4 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-800 dark:text-gray-100 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Filter size={16} className="text-rose-500" />
                      <span>Pet Matrimony Filters</span>
                    </span>
                    <button
                      onClick={() => {
                        playTapTone();
                        setSelectedSpecies('All');
                        setSelectedIntent('All');
                        setSelectedGender('All');
                        setPedigreeOnly(false);
                      }}
                      className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Species Filter */}
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Species</label>
                      <select
                        value={selectedSpecies}
                        onChange={(e) => setSelectedSpecies(e.target.value as 'All' | 'Dog' | 'Cat')}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none font-medium text-gray-800 dark:text-gray-100"
                      >
                        <option value="All">All (Dogs &amp; Cats)</option>
                        <option value="Dog">Dogs 🐶</option>
                        <option value="Cat">Cats 🐱</option>
                      </select>
                    </div>

                    {/* Intent Filter */}
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Matrimony Intent</label>
                      <select
                        value={selectedIntent}
                        onChange={(e) => setSelectedIntent(e.target.value)}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none font-medium text-gray-800 dark:text-gray-100"
                      >
                        <option value="All">All Intents</option>
                        <option value="Matrimony & Companion">Matrimony &amp; Companion 💍</option>
                        <option value="Pedigree Breeding">Pedigree Breeding 🧬</option>
                        <option value="Regular Playmate">Regular Playmate 🎾</option>
                        <option value="Pack Explorer">Pack Explorer 🐾</option>
                      </select>
                    </div>

                    {/* Gender Filter */}
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Gender</label>
                      <select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none font-medium text-gray-800 dark:text-gray-100"
                      >
                        <option value="All">Any Gender</option>
                        <option value="Male">Male ♂</option>
                        <option value="Female">Female ♀</option>
                      </select>
                    </div>

                    {/* Pedigree Verified Only */}
                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                        <input
                          type="checkbox"
                          checked={pedigreeOnly}
                          onChange={(e) => setPedigreeOnly(e.target.checked)}
                          className="rounded text-rose-500"
                        />
                        <span className="font-bold text-gray-700 dark:text-gray-300">Pedigree Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================ */}
          {/* 🎴 CLEAN SWIPE CARD DECK */}
          {/* ============================================================ */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-rose-100 dark:border-neutral-800 shadow-sm max-w-md mx-auto my-8">
              <div className="text-4xl mb-3">🐾</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">No Matching Profiles Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your species or matrimony intent filters to view more furry companions.
              </p>
              <button
                onClick={() => {
                  setSelectedSpecies('All');
                  setSelectedIntent('All');
                  setSelectedGender('All');
                  setPedigreeOnly(false);
                }}
                className="px-5 py-2 bg-rose-500 text-white font-bold rounded-full text-xs hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-4">
              <div className="relative w-full max-w-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProfile.id + currentIndex}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
                      rotate: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
                    }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    style={{ x, rotate }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 100) handleHeartClick();
                      else if (info.offset.x < -100) handlePass();
                    }}
                    className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-rose-100 dark:border-neutral-800 cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* Drag Overlays */}
                    <motion.div
                      style={{ opacity: likeOpacity }}
                      className="absolute top-8 left-8 z-20 bg-emerald-500 text-white px-4 py-2 rounded-2xl font-black text-2xl rotate-[-15deg] border-4 border-emerald-300 shadow-xl pointer-events-none"
                    >
                      LIKE 💖
                    </motion.div>
                    <motion.div
                      style={{ opacity: passOpacity }}
                      className="absolute top-8 right-8 z-20 bg-rose-500 text-white px-4 py-2 rounded-2xl font-black text-2xl rotate-[15deg] border-4 border-rose-300 shadow-xl pointer-events-none"
                    >
                      NOPE ❌
                    </motion.div>

                    {/* High-Resolution Animal Photo Container */}
                    <div className="relative w-full aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentProfile.imageUrl}
                        alt={currentProfile.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Gradient Overlay for Top Badges & Bottom Identification */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 flex flex-col justify-between p-4 text-white pointer-events-none">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between pointer-events-auto">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
                              <span>{getAnimalEmoji(currentProfile.species)}</span>
                              <span>{currentProfile.breed}</span>
                            </span>
                            {currentProfile.pedigreeCertified && (
                              <span className="bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 shadow-xs">
                                <Award size={13} />
                                <span>Pedigree</span>
                              </span>
                            )}
                          </div>

                          {/* Sniff Compatibility Pill */}
                          <div className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Sparkles size={13} />
                            <span>{currentProfile.compatibilityScore}% Match</span>
                          </div>
                        </div>

                        {/* Bottom Profile Basics */}
                        <div className="pointer-events-auto">
                          <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                              <span>{currentProfile.name},</span>
                              <span className="font-normal text-xl">{currentProfile.age} yrs</span>
                              <span className="text-sm opacity-80">{currentProfile.gender === 'Male' ? '♂' : '♀'}</span>
                            </h2>

                            {/* Voice Sample Audio Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVoiceSample(currentProfile);
                              }}
                              className="p-2.5 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                              title="Listen to authentic vocal sample"
                            >
                              {playingAudioId === currentProfile.id ? (
                                <VolumeX size={18} className="text-rose-300 animate-pulse" />
                              ) : (
                                <Volume2 size={18} />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-200 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{currentProfile.location}</span>
                            </span>
                            <span>•</span>
                            <span>{currentProfile.pawSign}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Card Info Section (Collapsible) */}
                    <div className="p-4 bg-white dark:bg-neutral-900 border-t border-rose-100 dark:border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-neutral-800 px-3 py-1 rounded-full">
                          🎯 {currentProfile.matrimonyIntent}
                        </span>

                        <button
                          onClick={() => {
                            playTapTone();
                            setShowCardDetails(!showCardDetails);
                          }}
                          className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <span>{showCardDetails ? 'Hide Details' : 'Full Bio & Notes'}</span>
                          {showCardDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showCardDetails && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3 text-xs overflow-hidden pt-1"
                          >
                            {/* Guardian Note */}
                            <div className="bg-amber-50 dark:bg-neutral-800 p-3 rounded-2xl border border-amber-200 dark:border-neutral-700">
                              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                                👨‍👩‍👧 Note from Guardian ({currentProfile.guardianName}):
                              </span>
                              <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{currentProfile.guardianNote}&rdquo;</p>
                            </div>

                            {/* About Bio */}
                            <div>
                              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">About {currentProfile.name}:</span>
                              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{currentProfile.about}</p>
                            </div>

                            {/* Temperament & Interests */}
                            <div>
                              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">Temperament:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {currentProfile.temperament.map((t) => (
                                  <span key={t} className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Medical / Verification Status */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-neutral-800 text-[11px]">
                              <div>
                                <span className="text-gray-400">Vaccination: </span>
                                <strong className="text-emerald-600">{currentProfile.vaccinated ? 'Fully Vaccinated' : 'Pending'}</strong>
                              </div>
                              <div>
                                <span className="text-gray-400">Neutered: </span>
                                <strong className="text-gray-700 dark:text-gray-300">{currentProfile.neutered ? 'Yes' : 'Intact (Breeding)'}</strong>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-400">Dietary Regime: </span>
                                <strong className="text-gray-700 dark:text-gray-300">{currentProfile.diet}</strong>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Card Action Controls */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Pass Button */}
                        <button
                          onClick={handlePass}
                          className="w-14 h-14 rounded-full bg-rose-50 dark:bg-neutral-800 hover:bg-rose-100 dark:hover:bg-neutral-700 text-rose-500 border border-rose-200 dark:border-neutral-700 shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          title="Pass"
                        >
                          <X size={26} strokeWidth={2.5} />
                        </button>

                        {/* Speaker Button */}
                        <button
                          onClick={() => toggleVoiceSample(currentProfile)}
                          className="w-11 h-11 rounded-full bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 text-amber-600 border border-amber-200 dark:border-neutral-700 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          title="Hear Vocal Recording"
                        >
                          <Volume2 size={20} />
                        </button>

                        {/* Like Button -> Triggers Love Note Modal */}
                        <button
                          onClick={handleHeartClick}
                          className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer animate-pulse"
                          title="Like & Send Love Message"
                        >
                          <Heart size={30} className="fill-white" />
                        </button>

                        {/* Direct Date Scheduling Button */}
                        <button
                          onClick={() => {
                            playTapTone();
                            setDateTarget(currentProfile);
                            setShowDateModal(true);
                          }}
                          className="w-12 h-12 rounded-full bg-purple-50 dark:bg-neutral-800 hover:bg-purple-100 text-purple-600 border border-purple-200 dark:border-neutral-700 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          title="Propose a Matrimony Playdate"
                        >
                          <Calendar size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 💌 STEP 1 MODAL: SEND LOVE NOTE & MESSAGE MODAL */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showLikeMessageModal && likeTarget && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full border border-rose-200 dark:border-neutral-800 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💌</span>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                      Send Love Message to {likeTarget.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowLikeMessageModal(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-rose-50 dark:bg-neutral-800 p-3 rounded-2xl">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-300 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={likeTarget.imageUrl} alt={likeTarget.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{likeTarget.name} ({likeTarget.breed})</h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">{likeTarget.compatibilityScore}% Compatibility Match</p>
                  </div>
                </div>

                {/* Quick Icebreaker Options */}
                <div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Choose Icebreaker:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {icebreakerOptions.map((text, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          playTapTone();
                          setLikeMessageText(text);
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs bg-gray-50 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Note Input */}
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Or write your own love letter:
                  </label>
                  <textarea
                    rows={3}
                    value={likeMessageText}
                    onChange={(e) => setLikeMessageText(e.target.value)}
                    placeholder="Express your feelings, describe a perfect playdate, or send a gentle purr..."
                    className="w-full p-3 text-xs bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none focus:border-rose-400 text-gray-800 dark:text-gray-100"
                  />
                </div>

                {/* Live PawScript Translation */}
                {likeMessageText.trim() && (
                  <div className="p-3 bg-amber-50 dark:bg-neutral-800 rounded-2xl border border-amber-200 dark:border-neutral-700 text-xs">
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                      Live PawScript Translation:
                    </span>
                    <span className="pawscript-text font-bold text-amber-900 dark:text-amber-300">
                      {translateToPawScript(likeMessageText)}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmLikeAndMessage('')}
                    className="flex-1 py-2.5 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Send Heart Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmLikeAndMessage()}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Send &amp; Match</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* 🎉 STEP 2 MODAL: MUTUAL MATCH CELEBRATION MODAL */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showMatchModal && matchedProfile && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-md w-full border-2 border-rose-300 dark:border-neutral-700 shadow-2xl text-center space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-5xl">💍🎉</span>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                    It&apos;s a Mutual Match!
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {matchedProfile.name} loved your profile back! The universe approves of this union.
                  </p>
                </div>

                {/* Both Pets Side-by-Side Avatars */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-rose-400 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={myPet.imageUrl} alt={myPet.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">{myPet.name}</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <Heart size={20} className="fill-white" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-rose-400 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={matchedProfile.imageUrl} alt={matchedProfile.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">{matchedProfile.name}</span>
                  </div>
                </div>

                {/* Unlocked Actions: Schedule Date or Chat Now */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      playAppLaunchTone();
                      setDateTarget(matchedProfile);
                      setShowDateModal(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Calendar size={15} />
                    <span>Schedule a Matrimony Date</span>
                  </button>

                  <button
                    onClick={() => handleOpenChat(matchedProfile)}
                    className="w-full py-3 bg-rose-50 dark:bg-neutral-800 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-rose-200 dark:border-neutral-700 cursor-pointer"
                  >
                    <MessageCircle size={15} />
                    <span>Send Message &amp; Chat</span>
                  </button>

                  <button
                    onClick={() => setShowMatchModal(false)}
                    className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    Keep Swiping Profiles
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* 📅 STEP 3 MODAL: PROPOSE A MATRIMONY DATE */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showDateModal && dateTarget && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full border border-rose-200 dark:border-neutral-800 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎟️</span>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                      Propose Date with {dateTarget.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDateModal(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Select Date Theme:
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { theme: 'Park Fetch & Sniff Zoomies', icon: '🌳' },
                      { theme: 'Catnip Lounge & Sunbeam Nap', icon: '☕' },
                      { theme: 'Beach Splash & Sand Digging', icon: '🏖️' },
                      { theme: 'Gourmet Salmon & Bone Tasting', icon: '🥩' },
                      { theme: 'Window Bird Watch & Cat Teaser Session', icon: '🪟' },
                    ].map((item) => (
                      <button
                        key={item.theme}
                        type="button"
                        onClick={() => {
                          playTapTone();
                          setSelectedTheme(item.theme);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          selectedTheme === item.theme
                            ? 'border-rose-500 bg-rose-50 dark:bg-neutral-800 text-rose-900 dark:text-rose-300 shadow-xs'
                            : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location & Time Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Meeting Location</label>
                    <input
                      type="text"
                      value={dateLocation}
                      onChange={(e) => setDateLocation(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Day &amp; Time</label>
                    <input
                      type="text"
                      value={dateDayTime}
                      onChange={(e) => setDateDayTime(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Chaperone Toggle */}
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer p-2.5 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={guardianPresence}
                    onChange={(e) => setGuardianPresence(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span>Guardians will attend to chaperone this meeting 👨‍👩‍👧</span>
                </label>

                {/* Confirm Date Proposal */}
                <button
                  onClick={handleScheduleDate}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Check size={14} />
                  <span>Send Date Proposal</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* 💬 STEP 4 MODAL: 1-ON-1 INTERACTIVE PET CHAT */}
        {/* ============================================================ */}
        <AnimatePresence>
          {activeChatPet && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full h-[580px] border border-rose-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Chat Header */}
                <div className="p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-800 border-b border-rose-100 dark:border-neutral-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeChatPet.imageUrl} alt={activeChatPet.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <span>{activeChatPet.name}</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{activeChatPet.breed} • {activeChatPet.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playTapTone();
                        setDateTarget(activeChatPet);
                        setShowDateModal(true);
                      }}
                      className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-rose-200 dark:border-neutral-600 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar size={12} />
                      <span>Date</span>
                    </button>

                    <button
                      onClick={() => setActiveChatPet(null)}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-neutral-950/50">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 shadow-xs ${
                          msg.sender === 'user'
                            ? 'bg-rose-500 text-white rounded-br-none'
                            : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-neutral-700 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        {msg.textPS && (
                          <div
                            className={`pawscript-text text-[11px] font-bold p-1.5 rounded-lg ${
                              msg.sender === 'user'
                                ? 'bg-rose-600/60 text-white/90'
                                : 'bg-amber-50 dark:bg-neutral-900 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-neutral-700'
                            }`}
                          >
                            {msg.textPS}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.timestamp}</span>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isPetTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 italic">
                      <span>🐾 {activeChatPet.name} is typing...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input Bar */}
                <div className="p-3 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendChatMessage();
                    }}
                    placeholder={`Write to ${activeChatPet.name}...`}
                    className="flex-1 p-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs outline-none text-gray-800 dark:text-gray-100"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* 📋 DRAWER: MATCHES, DATES & LOVE LETTERS */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showDrawer && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
              <motion.aside
                initial={{ x: 380 }}
                animate={{ x: 0 }}
                exit={{ x: 380 }}
                className="bg-white dark:bg-neutral-900 w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-rose-100 dark:border-neutral-800"
              >
                <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Heart size={16} className="text-rose-500 fill-rose-500" />
                    <span>Matches &amp; Matrimony Hub</span>
                  </h3>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-neutral-800 text-xs font-bold">
                  <button
                    onClick={() => {
                      playTapTone();
                      setDrawerTab('chats');
                    }}
                    className={`flex-1 py-2.5 border-b-2 text-center transition-colors cursor-pointer ${
                      drawerTab === 'chats'
                        ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Matches ({matchesList.length})
                  </button>
                  <button
                    onClick={() => {
                      playTapTone();
                      setDrawerTab('dates');
                    }}
                    className={`flex-1 py-2.5 border-b-2 text-center transition-colors cursor-pointer ${
                      drawerTab === 'dates'
                        ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Dates ({scheduledDates.length})
                  </button>
                  <button
                    onClick={() => {
                      playTapTone();
                      setDrawerTab('letters');
                    }}
                    className={`flex-1 py-2.5 border-b-2 text-center transition-colors cursor-pointer ${
                      drawerTab === 'letters'
                        ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Letters ({loveMessages.length})
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {drawerTab === 'chats' && (
                    <>
                      {matchesList.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-xs">
                          <div className="text-3xl mb-2">🐾</div>
                          <p>No mutual matches yet.</p>
                          <p className="mt-1 text-[11px] text-gray-400">Swipe right or tap ❤️ on profiles to start matching!</p>
                        </div>
                      ) : (
                        matchesList.map((pet) => (
                          <div
                            key={pet.id}
                            className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-neutral-700"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden border border-rose-300 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                  <span>{pet.name}</span>
                                  <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-1.5 py-0.2 rounded-md font-semibold">
                                    {pet.compatibilityScore}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{pet.breed}</div>
                                <div className="text-[10px] text-gray-400">{pet.location}</div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => handleOpenChat(pet)}
                                className="px-3 py-1 bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-neutral-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <MessageCircle size={12} />
                                <span>Chat</span>
                              </button>
                              <button
                                onClick={() => {
                                  playTapTone();
                                  setDateTarget(pet);
                                  setShowDateModal(true);
                                }}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Calendar size={12} />
                                <span>Date</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {drawerTab === 'dates' && (
                    <>
                      {scheduledDates.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-xs">
                          <div className="text-3xl mb-2">🎟️</div>
                          <p>No dates scheduled yet.</p>
                          <p className="mt-1 text-[11px] text-gray-400">Match with a pet and schedule a matrimony playdate!</p>
                        </div>
                      ) : (
                        scheduledDates.map((date, idx) => (
                          <div
                            key={`${date.id}_${idx}`}
                            className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-neutral-800 dark:to-neutral-800 p-4 rounded-3xl border border-amber-200 dark:border-neutral-700 shadow-xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{date.themeIcon}</span>
                                <div>
                                  <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">{date.dateTheme}</h4>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    With {date.petProfile.name} ({date.petProfile.breed})
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                {date.status}
                              </span>
                            </div>

                            <div className="bg-white/80 dark:bg-neutral-900/80 p-2.5 rounded-xl border border-amber-200/60 dark:border-neutral-700 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                <MapPin size={13} className="text-rose-500" />
                                <span className="font-medium">{date.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                <Calendar size={13} className="text-blue-500" />
                                <span>{date.dateTime}</span>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {date.guardianAttending ? 'Chaperoned by Guardians' : 'Pet Solo Meeting'}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {drawerTab === 'letters' && (
                    <>
                      {loveMessages.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-xs">
                          <div className="text-3xl mb-2">💌</div>
                          <p>No love letters sent yet.</p>
                          <p className="mt-1 text-[11px] text-gray-400">Tap ❤️ on pet profiles to write personalized letters!</p>
                        </div>
                      ) : (
                        loveMessages.map((msg, idx) => (
                          <div
                            key={`${msg.id}_${idx}`}
                            className="bg-white dark:bg-neutral-800 p-3.5 rounded-2xl border border-rose-100 dark:border-neutral-700 shadow-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-rose-800 dark:text-rose-300">To {msg.petName}</span>
                              <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{msg.text}</p>
                            <div className="pawscript-text text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-neutral-900 p-2 rounded-lg border border-amber-200 dark:border-neutral-700 font-medium">
                              {msg.textPS}
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-neutral-800 text-center">
                  <Link
                    href="/pawchat"
                    className="inline-block text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
                  >
                    Open PawChat for Live Audio Conversations →
                  </Link>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* 👤 MODAL: REGISTER / EDIT PET ACCOUNT */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showRegisterModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-rose-200 dark:border-neutral-800 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>{hasCustomAccount ? 'Edit Your Pet Profile' : 'Register Pet Account'}</span>
                  </h3>
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-400 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={regImage} alt="Pet Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-neutral-800 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold rounded-xl border border-rose-200 dark:border-neutral-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload size={13} />
                        <span>Upload Pet Photo</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">PNG, JPG, or WEBP photo</span>
                    </div>
                  </div>

                  {/* Name & Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Pet Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Whiskers"
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min={1}
                        max={25}
                        required
                        value={regAge}
                        onChange={(e) => setRegAge(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Species & Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Species</label>
                      <select
                        value={regSpecies}
                        onChange={(e) => setRegSpecies(e.target.value as 'Dog' | 'Cat')}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                      >
                        <option value="Dog">Dog 🐕</option>
                        <option value="Cat">Cat 🐱</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Gender</label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value as 'Male' | 'Female')}
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                      >
                        <option value="Male">Male ♂</option>
                        <option value="Female">Female ♀</option>
                      </select>
                    </div>
                  </div>

                  {/* Breed & Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Breed</label>
                      <input
                        type="text"
                        value={regBreed}
                        onChange={(e) => setRegBreed(e.target.value)}
                        placeholder="e.g. Golden Retriever"
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Location</label>
                      <input
                        type="text"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Guardian Name */}
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Guardian Name</label>
                    <input
                      type="text"
                      value={regGuardian}
                      onChange={(e) => setRegGuardian(e.target.value)}
                      placeholder="e.g. Dr. Jane"
                      className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Matrimony Intent */}
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Matrimony Intent</label>
                    <select
                      value={regIntent}
                      onChange={(e) => setRegIntent(e.target.value as 'Matrimony & Companion' | 'Pedigree Breeding' | 'Regular Playmate' | 'Pack Explorer')}
                      className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                    >
                      <option value="Matrimony & Companion">Matrimony &amp; Companion 💍</option>
                      <option value="Pedigree Breeding">Pedigree Breeding 🧬</option>
                      <option value="Regular Playmate">Regular Playmate 🎾</option>
                      <option value="Pack Explorer">Pack Explorer 🐾</option>
                    </select>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">About Bio</label>
                    <textarea
                      rows={3}
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="Describe personality, favorite toys, sunbeam nap habits..."
                      className="w-full p-2 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 outline-none text-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Save Profile &amp; Start Matching</span>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </IPadFrame>
  );
}
