import { AudioClipItem } from "../types";

export interface AudioMixSettings {
  masterGain: number; // 0 to 1
  duckingThreshold: number; // Volume ducking factor when voiceover is present
  normalizePeak: boolean;
}

export const DEFAULT_AUDIO_MIX_SETTINGS: AudioMixSettings = {
  masterGain: 0.9,
  duckingThreshold: 0.3,
  normalizePeak: true,
};

/**
 * Calculates audio filter string for a specific audio clip (atrim, volume, delays for timeline alignment).
 */
export function buildAudioClipFilterString(
  clip: AudioClipItem,
  inputIndex: number,
  outputLabel: string
): string {
  const delayMs = Math.max(0, Math.round(clip.timelineStart * 1000));
  const vol = clip.volume.toFixed(2);
  const trimEnd = (clip.duration).toFixed(2);

  // atrim filter -> setpts -> volume -> adelay for precise multi-track timeline alignment
  return `[${inputIndex}:a]atrim=0:${trimEnd},asetpts=PTS-STARTPTS,volume=${vol},adelay=${delayMs}|${delayMs}[${outputLabel}]`;
}

/**
 * Builds the amix filter complex for combining all processed audio track streams.
 */
export function buildAudioAmixFilterString(
  inputLabels: string[],
  outputLabel: string = "a_mixed"
): string {
  if (inputLabels.length === 0) {
    return `anullsrc=r=48000:cl=stereo[${outputLabel}]`;
  }
  if (inputLabels.length === 1) {
    return `${inputLabels[0]}acopy[${outputLabel}]`;
  }

  const inputs = inputLabels.map((l) => `[${l}]`).join("");
  return `${inputs}amix=inputs=${inputLabels.length}:duration=first:dropout_transition=2[${outputLabel}]`;
}
