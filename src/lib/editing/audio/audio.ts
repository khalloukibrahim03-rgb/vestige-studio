import { AudioClipItem, TimelineTrackAudio } from "../types";

export interface AudioMixConfig {
  sampleRate: number;
  channels: number;
  masterGain: number;
}

export const DEFAULT_AUDIO_CONFIG: AudioMixConfig = {
  sampleRate: 48000,
  channels: 2,
  masterGain: 1.0,
};

/**
 * Generates an FFmpeg audio filter for an individual audio clip.
 * Implements sample-rate standardization, delay for timeline positioning, volume gain, and fades.
 */
export function buildAudioClipFilter(clip: AudioClipItem, inputIndex: number, outputLabel: string): string {
  const delayMs = Math.round(Math.max(0, clip.timelineStart) * 1000);
  const volume = clip.volume ?? 0.8;
  const duration = clip.duration;

  const filters: string[] = [
    `aformat=sample_rates=48000:channel_layouts=stereo`,
    `atrim=0:${duration}`,
    `asetpts=PTS-STARTPTS`,
    `volume=${volume.toFixed(2)}`,
  ];

  if (clip.fadeInDuration > 0) {
    filters.push(`afade=t=in:st=0:d=${clip.fadeInDuration.toFixed(2)}`);
  }

  if (clip.fadeOutDuration > 0) {
    const fadeOutStart = Math.max(0, duration - clip.fadeOutDuration);
    filters.push(`afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${clip.fadeOutDuration.toFixed(2)}`);
  }

  filters.push(`adelay=${delayMs}|${delayMs}`);

  return `[${inputIndex}:a]${filters.join(",")}[${outputLabel}]`;
}

/**
 * Creates audio track structures with future voiceover and music support.
 */
export function createDefaultAudioTracks(): TimelineTrackAudio[] {
  return [
    {
      id: "track_a1",
      name: "A1 — Environment Ambience",
      type: "A1_environment",
      clips: [],
      muted: false,
      solo: false,
      gain: 1.0,
    },
    {
      id: "track_a2",
      name: "A2 — Secondary Acoustic Effects",
      type: "A2_secondary",
      clips: [],
      muted: false,
      solo: false,
      gain: 0.9,
    },
    {
      id: "track_a3",
      name: "A3 — Voiceover (Future)",
      type: "A3_voiceover",
      clips: [],
      muted: false,
      solo: false,
      gain: 1.0,
    },
    {
      id: "track_a4",
      name: "A4 — Music Score (Future)",
      type: "A4_music",
      clips: [],
      muted: false,
      solo: false,
      gain: 0.8,
    },
  ];
}
