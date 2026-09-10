# VESTIGE STUDIO — Cinematic AI Video Editing Engine

VESTIGE STUDIO is an AI-assisted cinematic video editing engine designed for high-quality documentary Shorts and long-form videos.

Unlike basic AI video generators that simply stitch clips together, VESTIGE STUDIO operates as an **AI Director & Editing Suite**, evaluating shot composition, timing, audio continuity (J-cuts and L-cuts), and color grading to produce intentionally edited cinematic stories.

---

## 🌟 Key Features

1. **AI Director & Editorial Intelligence**: Powered by Gemini, the AI Director formulates structured Director Plans with scene-by-scene narrative purpose and detailed reasoning (*WHY THIS SHOT*, *WHY THIS DURATION*, *WHY THIS CUT*, *WHY THIS SOUND*, *WHY THIS COLOR*).
2. **Intelligent Shot Selection**: Automated searching and multi-parameter scoring (story relevance, composition, camera movement, lighting, continuity) for stock footage from **Pexels**.
3. **Natural Acoustic Soundscapes**: Automated sound selection from **Freesound** for ambient hydrophone audio and environmental soundscapes.
4. **Cinematic NLE Engine**:
   - Modular timeline data model supporting tracks (V1, A1, A2, A3, A4).
   - Audio J-cuts (audio lead-in) and L-cuts (audio tailing).
   - Smart 9:16 vertical video conversion with center-of-interest cropping.
   - Cinematic color presets (*Natural Documentary*, *Deep Ocean*, *Cold Scientific*, *Night*, *Warm Memory*, *Neutral*).
5. **Vercel-Compatible FFmpeg Render Pipeline**:
   - Dynamic path resolution (`getFFmpegPath()`) with bundled `ffmpeg-static` for serverless environments.
   - Modular filtergraph generation (`buildCropFilter`, `buildScaleFilter`, `buildColorFilter`, `buildAudioFilter`).
   - `IRenderBackend` interface for seamless future delegation to external worker infrastructure (AWS Lambda, Cloud Run, Modal).
6. **Dark Obsidian Interface**: Obsidian dark surfaces (`#0a0b0e`), platinum typography, gold accents (`#c5a059`), and glass panels.
7. **Zero-Lock Fallback System**: Full functionality out of the box with built-in curated cinematic media and offline AI models when live API keys are not provided.

---

## 🚀 Deployment & Vercel Requirements

### Vercel Serverless Configuration
- FFmpeg binary is automatically bundled and resolved via `ffmpeg-static`.
- No system-level `/usr/bin/ffmpeg` installation required on Vercel.
- Max duration settings for Vercel Serverless Functions (`maxDuration = 60`) are configured for render API endpoints.
- Diagnostic endpoint `/api/diagnostics` reports FFmpeg version, resolution status, and environment details.

### Optional Custom FFmpeg Path
If deploying on custom infrastructure, set `FFMPEG_PATH` in `.env`:
```env
FFMPEG_PATH=/custom/path/to/ffmpeg
```

---

## 💻 Quick Start & Development

### Prerequisites
- Node.js 18+

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file and configure API keys (optional):
   ```bash
   cp .env.example .env.local
   ```

3. Run local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## 🎥 Benchmark Test Concept: "THE DEEP IS NOT EMPTY"

VESTIGE STUDIO includes a 1-click test benchmark:
- **Concept**: *THE DEEP IS NOT EMPTY* (48-second oceanic descent).
- **Flow**: Idea → Gemini Director Plan → Pexels Stock Sourcing → Freesound Audio Sourcing → Timeline Construction → FFmpeg Render → Playable MP4 Export.

---

## 🏗 Architecture Overview

```
src/
  app/                    # Next.js App Router (Pages & API Routes)
    api/diagnostics/      # Server diagnostics endpoint
    api/projects/         # Project creation & render trigger routes
    api/videos/           # Video file streaming route
  components/             # UI Components (Header, Settings, PromptInput, DirectorPlanView, TimelineView)
  lib/
    editing/              # Modular Editing Engine
      color/              # Color presets & matrix adjustments
      presets/            # Export presets (SHORT_HIGH, YOUTUBE_1080P, etc.)
      render/             # FFmpeg complex filtergraph generators, resolver, backend abstraction & pipeline runner
      timeline/           # Timeline compiler (J/L-cuts, tracks)
      types.ts            # Timeline & Clip data types
    providers/            # Provider Abstraction Layer
      gemini-director-provider.ts  # Gemini AI Director provider & fallback
      pexels-provider.ts           # Pexels stock video provider & fallback
      freesound-provider.ts        # Freesound soundscape provider & fallback
    schemas/              # Zod validation schemas for AI Director JSON
    services/             # In-memory project persistence store
```

---

## 📄 License
MIT License
