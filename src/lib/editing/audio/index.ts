import { AudioClipItem } from "../types";

/**
 * Builds FFmpeg audio filter parameters (volume, delay, trimming, fade in/out, ducking).
 */
export function buildAudioFilter(clip: AudioClipItem, delayMs: number): string {
  const volume = clip.volume ?? 0.8;
  const filters: string[] = [
    `atrim=0:${clip.duration}`,
    `asetpts=PTS-STARTPTS`,
    `volume=${volume}`,
  ];

  if (clip.fadeInDuration && clip.fadeInDuration > 0) {
    filters.push(`afade=t=in:st=0:d=${clip.fadeInDuration}`);
  }

  if (clip.fadeOutDuration && clip.fadeOutDuration > 0) {
    const fadeOutStart = Math.max(0, clip.duration - clip.fadeOutDuration);
    filters.push(`afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${clip.fadeOutDuration}`);
  }

  filters.push(`adelay=${delayMs}|${delayMs}`);

  return filters.join(",");
}
