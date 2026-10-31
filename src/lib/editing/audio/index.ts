import { AudioClipItem } from "../types";

export interface AudioTimingCalculation {
  timelineStart: number;
  duration: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}

/**
 * Calculates audio timing with J-cut (audio begins before video)
 * and L-cut (audio tails out after video) offsets.
 */
export function calculateAudioTiming(
  sceneStartTime: number,
  sceneDuration: number,
  jCutOffset: number = 0, // e.g. -1.0 means audio starts 1.0s before scene
  lCutOffset: number = 0  // e.g. +1.0 means audio continues 1.0s after scene
): AudioTimingCalculation {
  const timelineStart = Math.max(0, sceneStartTime + jCutOffset);
  const duration = sceneDuration + Math.abs(jCutOffset) + Math.max(0, lCutOffset);
  const fadeInDuration = Math.abs(jCutOffset) > 0 ? 0.8 : 0.3;
  const fadeOutDuration = lCutOffset > 0 ? 1.0 : 0.4;

  return {
    timelineStart,
    duration,
    fadeInDuration,
    fadeOutDuration,
  };
}

/**
 * Builds modular FFmpeg audio filter string for a clip.
 * Handles trimming, PTS synchronization, volume level, fades, and adelay.
 */
export function buildAudioFilter(clip: AudioClipItem, inputIndex: number): string {
  const delayMs = Math.round(Math.max(0, clip.timelineStart) * 1000);
  const volume = clip.volume ?? 0.8;
  const duration = clip.duration.toFixed(2);
  const fadeIn = clip.fadeInDuration || 0.3;
  const fadeOut = clip.fadeOutDuration || 0.4;
  const fadeOutStart = Math.max(0, clip.duration - fadeOut).toFixed(2);

  // Filter chain: atrim -> asetpts -> afade(in) -> afade(out) -> volume -> adelay
  return `[${inputIndex}:a]atrim=0:${duration},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${fadeIn},afade=t=out:st=${fadeOutStart}:d=${fadeOut},volume=${volume},adelay=${delayMs}|${delayMs}`;
}
