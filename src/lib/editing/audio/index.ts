export interface AudioTrackMixConfig {
  trackName: string;
  defaultVolume: number;
  duckingThresholdDb?: number;
}

export const DEFAULT_AUDIO_TRACK_CONFIGS: Record<string, AudioTrackMixConfig> = {
  A1_environment: {
    trackName: "A1 — Environment Ambience",
    defaultVolume: 0.8,
  },
  A2_secondary: {
    trackName: "A2 — Secondary Acoustic Effects",
    defaultVolume: 0.85,
  },
  A3_voiceover: {
    trackName: "A3 — Voiceover Narration",
    defaultVolume: 1.0,
    duckingThresholdDb: -12,
  },
  A4_music: {
    trackName: "A4 — Musical Score",
    defaultVolume: 0.6,
  },
};

/**
 * Computes J-cut / L-cut duration and timeline start adjustments.
 */
export function calculateJLCutTiming(
  timelineStart: number,
  baseDuration: number,
  jCutOffset: number = 0,
  lCutOffset: number = 0
): { adjustedStart: number; adjustedDuration: number } {
  const adjustedStart = Math.max(0, timelineStart + jCutOffset);
  const adjustedDuration = baseDuration + Math.abs(jCutOffset) + lCutOffset;

  return { adjustedStart, adjustedDuration };
}
