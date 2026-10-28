import { AudioClipItem } from "../types";

export interface AudioMixerOptions {
  masterGain?: number;
}

export function buildAudioFilters(clip: AudioClipItem): string[] {
  const filters: string[] = [];

  // Volume filter
  if (clip.volume !== undefined && clip.volume !== 1.0) {
    filters.push(`volume=${clip.volume.toFixed(2)}`);
  }

  // Fade in
  if (clip.fadeInDuration > 0) {
    filters.push(`afade=t=in:st=0:d=${clip.fadeInDuration.toFixed(2)}`);
  }

  // Fade out
  if (clip.fadeOutDuration > 0 && clip.duration > clip.fadeOutDuration) {
    const fadeOutStart = clip.duration - clip.fadeOutDuration;
    filters.push(`afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${clip.fadeOutDuration.toFixed(2)}`);
  }

  return filters;
}
