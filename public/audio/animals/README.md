# Real-World Animal Audio Tracks Directory

Place your audio files (MP3, WAV, OGG, or M4A) in this directory!

The PawLingo audio engine will **automatically detect and play real sound tracks** placed in this folder. If an audio file is not present, it seamlessly falls back to PawLingo's procedural acoustic formant synthesizer.

---

## 📁 Recommended Filename Mapping

Drop your audio recordings here with any of the following names:

### 🐱 Cats (Feline Phonetics)
- `cat_meow.mp3` or `cat_meow.wav` — Classic rising/falling meow
- `cat_purr.mp3` or `cat_purr.wav` — Contentment purr
- `cat_hiss.mp3` or `cat_hiss.wav` — Defensive warning hiss
- `cat_trill.mp3` or `cat_trill.wav` — Chirrup / greeting trill
- `cat_mew.mp3` or `cat_mew.wav` — Kitten distress / soft mew
- `cat_chack.mp3` or `cat_chack.wav` — Agitated chack / spit
- `cat_yowl.mp3` or `cat_yowl.wav` — Midnight territorial yowl
- `cat_chatter.mp3` or `cat_chatter.wav` — Rapid jaw chatter / prey clicking

### 🐕 Dogs (Canine Phonetics)
- `dog_bark.mp3` or `dog_bark.wav` — Play / alert explosive bark
- `dog_growl.mp3` or `dog_growl.wav` — Low chest warning growl
- `dog_howl.mp3` or `dog_howl.wav` — Long wolf/dog distance howl
- `dog_whine.mp3` or `dog_whine.wav` — High attention whimper/whine
- `dog_boof.mp3` or `dog_boof.wav` — Muffled low-frequency ruff/boof
- `dog_yap.mp3` or `dog_yap.wav` — Sharp high-pitched yap
- `dog_snarl.mp3` or `dog_snarl.wav` — Teeth friction layered growl
- `dog_pant.mp3` or `dog_pant.wav` — Rhythmic panting breath

### 🐦 Birds (Avian Syrinx Phonetics)
- `bird_chirp.mp3` or `bird_chirp.wav` — Bright downward chirp
- `bird_tweet.mp3` or `bird_tweet.wav` — Melodic singing trill / song
- `bird_caw.mp3` or `bird_caw.wav` — Raspy crow / raven caw
- `bird_coo.mp3` or `bird_coo.wav` — Gentle pigeon / dove coo
- `bird_screech.mp3` or `bird_screech.wav` — Piercing alarm screech
- `bird_clack.mp3` or `bird_clack.wav` — Dry percussive beak click

### 🐾 Other Species
- `horse_neigh.mp3` or `horse_neigh.wav` — Whinny / neigh cascade
- `cow_moo.mp3` or `cow_moo.wav` — Deep bovine chest call
- `sheep_baa.mp3` or `sheep_baa.wav` — Nasal tremolo bleat
- `lion_roar.mp3` or `lion_roar.wav` — Thunderous territorial roar
- `duck_quack.mp3` or `duck_quack.wav` — Nasal resonant quack
- `mouse_squeak.mp3` or `mouse_squeak.wav` — High-pitch rodent squeak
- `snake_hiss.mp3` or `snake_hiss.wav` — Sibilant slither hiss

---

## 🎧 How PawLingo Uses These Files
1. When you click **"Pronounce"** or compose messages in PawScript, the system attempts to play the corresponding file from `/audio/animals/{filename}`.
2. It caches the audio buffer in memory using the Web Audio API for zero-latency instant playback.
3. If no file exists yet for a sound, it uses the upgraded **organic vocal-tract formant synthesis engine** (`lib/sounds.ts`) featuring dynamic pitch trajectories, formant filters (F1/F2), and glottal pulse shaping.
