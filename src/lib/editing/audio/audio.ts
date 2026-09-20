import { AudioClipItem } from "../types";

/**
 * Audio filter generator for trim, fades, gain volume, delay, and ducking.
 */
export function buildAudioClipFilter(clip: AudioClipItem, index: number): string {
  const filters: string[] = [];
  filters.push(`atrim=0:${clip.duration}`);
  filters.push("asetpts=PTS-STARTPTS");

  if (clip.fadeInDuration > 0) {
    filters.push(`afade=t=in:ss=0:d=${clip.fadeInDuration}`);
  }

  if (clip.fadeOutDuration > 0) {
    const fadeOutStart = Math.max(0, clip.duration - clip.fadeOutDuration);
    filters.push(`afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${clip.fadeOutDuration}`);
  }

  const vol = clip.volume ?? 1.0;
  filters.push(`volume=${vol}`);

  const delayMs = Math.round(clip.timelineStart * 1000);
  filters.push(`adelay=${delayMs}|${delayMs}`);

  return `[${index}:a]${filters.join(",")}[a${index}]`;
}
