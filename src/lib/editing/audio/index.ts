import { AudioClipItem } from "../types";

export type { AudioClipItem };

export interface AudioTrackMixConfig {
  track: "A1_environment" | "A2_secondary" | "A3_voiceover" | "A4_music";
  gain: number;
  muted: boolean;
  solo: boolean;
}

export function calculateAudioOverlap(
  currentStart: number,
  clipDuration: number,
  jCutOffset: number = 0,
  lCutOffset: number = 0
): { timelineStart: number; totalDuration: number } {
  const timelineStart = Math.max(0, currentStart + jCutOffset);
  const totalDuration = clipDuration + Math.abs(jCutOffset) + lCutOffset;
  return { timelineStart, totalDuration };
}

export function normalizeAudioVolume(volume: number, ducking: boolean = false): number {
  let target = Math.max(0, Math.min(1.0, volume));
  if (ducking) {
    target *= 0.4;
  }
  return target;
}
