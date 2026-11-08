# VESTIGE STUDIO — Cinematic AI Video Editing Engine

VESTIGE STUDIO is an AI-assisted cinematic video editing platform designed for high-quality documentary Shorts and long-form visual stories.

Unlike generic AI video generators that simply stitch random clips together into slideshows, VESTIGE STUDIO operates as an **AI Director and Non-Linear Editing Suite**. Every cut has a narrative reason, every shot has an intentional purpose, timing follows organic emotional rhythm, audio continuity is preserved with J-cuts and L-cuts, and the color palette is graded to serve the story.

---

## 🌟 Architecture & Core Capabilities

```
VESTIGE STUDIO
├── 1. AI Director (Gemini 2.5 Flash)
│   ├── Structured Director Plan (Zod-validated JSON)
│   └── Editorial Reasoning (WHY THIS SHOT, DURATION, CUT, TRANSITION, SOUND, COLOR)
├── 2. Intelligent Sourcing Providers
│   ├── PexelsProvider: Multi-parameter candidate scoring (Story, Composition, Motion, Lighting, Continuity)
│   └── FreesoundProvider: Natural acoustic soundscapes & hydrophone ambience
├── 3. Cinematic NLE Engine (/src/lib/editing)
│   ├── /timeline: Multi-track representation (V1, A1 Environment, A2 Secondary, A3 Voiceover, A4 Music)
│   ├── /crop: Smart 9:16 vertical crop with center-of-interest safe zones
│   ├── /scale: High-quality scaling and pillarbox/letterbox padding
│   ├── /motion: Subtle Ken Burns moves (push-in, pull-out, pan)
│   ├── /cuts: Motivated cuts, match cuts, action cuts, visual continuity cuts
│   ├── /transitions: Crossfade, fade-to-black, dip-to-black
│   ├── /timing: Dynamic shot duration curves based on documentary shot types
│   ├── /color: Presets (Natural Documentary, Deep Ocean, Cold Scientific, Night, Warm Memory, Neutral) + live grading
│   ├── /audio: J-cut (lead-in) and L-cut (tailing), track gain, mute/solo, and continuous audio mixing
│   └── /render: Modular FFmpeg complex filter pipeline, static binary resolver, IRenderBackend abstraction
└── 4. Realtime Studio Interface
    ├── Realtime preview player with scrubbing, seeking, volume & fullscreen
    ├── Interactive clip trim, re-order, transition, and live color matrix adjustments
    └── Dark obsidian aesthetic (#0a0b0e), platinum typography, and gold accents (#c5a059)
```

---

## 🎬 Official Benchmark Concept: "THE DEEP IS NOT EMPTY"

The platform includes an automated 1-click test benchmark:
- **Concept**: *THE DEEP IS NOT EMPTY* (~48s oceanic descent).
- **Progression**:
  1. Open vast ocean surface waves under sky (establishing scale & human isolation).
  2. Sinking beneath the surface threshold with sunlight rays piercing water (audio J-cut).
  3. Gradual disappearance of sunlight into deep shadowy twilight (crossfade into cold scientific palette).
  4. Sudden discovery of bioluminescent deep sea life in pitch darkness (motivated cut & macro detail).
  5. Scientific ROV research submersible scanning the abyssal floor with searchlights and sonar audio.
  6. Final dip into abyssal silence.

---

## 🚀 Deployment & Vercel Requirements

### Vercel Serverless Configuration
- **Dynamic FFmpeg Resolution**: FFmpeg is dynamically resolved via `ffmpeg-static` (`getFFmpegPath()`). No manual system package installation (`apt-get install ffmpeg`) is needed on Vercel.
- **Vercel Serverless Max Duration**: Render API routes configure `maxDuration = 60` to accommodate complete transcoding runs.
- **Server Diagnostics**: The `/api/diagnostics` endpoint verifies FFmpeg detection, path resolution, binary version, and platform specs.

### Custom Server / Docker Deployment
If deploying on a custom VPS, Docker container, or Kubernetes, specify your system binary:
```env
FFMPEG_PATH=/usr/bin/ffmpeg
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (optional):
   ```bash
   cp .env.example .env.local
   ```
   *Note: If no API keys are provided, VESTIGE STUDIO automatically operates with zero-lock fallback mode using curated high-resolution sample footage and offline AI director plans.*

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Verification

Run provider abstraction tests:
```bash
npx tsx src/lib/providers/test-providers.ts
```

Run end-to-end timeline compilation and FFmpeg rendering test:
```bash
npx tsx src/lib/editing/test-editing-engine.ts
```

Run TypeScript and Next.js production build:
```bash
npx tsc --noEmit
npm run build
```

---

## 📄 License
MIT License
