import { AudioClipItem } from "../types";

export interface AudioMixConfig {
  masterGain: number;
  tracks: {
    A1_environment: { gain: number; muted: boolean; solo: boolean };
    A2_secondary: { gain: number; muted: boolean; solo: boolean };
    A3_voiceover: { gain: number; muted: boolean; solo: boolean };
    A4_music: { gain: number; muted: boolean; solo: boolean };
  };
}

export function calculateJLOverlap(jOffsetSec: number, lOffsetSec: number, clipDurationSec: number) {
  const audioStartOffset = Math.min(0, jOffsetSec); // e.g. -1.0s means audio starts 1s before video
  const totalAudioDuration = clipDurationSec + Math.abs(jOffsetSec) + Math.max(0, lOffsetSec);
  return {
    audioStartOffset,
    totalAudioDuration,
  };
}

export const DEFAULT_AUDIO_MIX: AudioMixConfig = {
  masterGain: 1.0,
  tracks: {
    A1_environment: { gain: 1.0, muted: false, solo: false },
    A2_secondary: { gain: 0.9, muted: false, solo: false },
    A3_voiceover: { gain: 1.0, muted: false, solo: false },
    A4_music: { gain: 0.8, muted: false, solo: false },
  },
};
