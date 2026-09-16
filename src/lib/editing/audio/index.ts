export interface AudioMixSettings {
  masterGain: number;
  environmentGain: number;
  secondaryGain: number;
  voiceoverGain: number;
  musicGain: number;
}

export const DEFAULT_AUDIO_MIX_SETTINGS: AudioMixSettings = {
  masterGain: 1.0,
  environmentGain: 1.0,
  secondaryGain: 0.9,
  voiceoverGain: 1.0,
  musicGain: 0.8,
};

/**
 * Calculates start time and duration for an audio clip considering J-cut and L-cut offsets.
 */
export function calculateJLCutTiming(
  timelineCutTime: number,
  visualDuration: number,
  jCutOffset: number = 0,
  lCutOffset: number = 0
): { audioStart: number; audioDuration: number } {
  const audioStart = Math.max(0, timelineCutTime + jCutOffset);
  const audioDuration = visualDuration + Math.abs(jCutOffset) + lCutOffset;
  return { audioStart, audioDuration };
}

/**
 * Normalizes audio volume level between 0 and 1.
 */
export function normalizeAudioVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}
