import { AudioClipItem } from "../types";

/**
 * Audio editing helper utilities for J-cuts, L-cuts, and multi-track ducking.
 */
export interface JCutLCutOffsets {
  jCutOffset: number; // Audio lead-in seconds (audio starts before video)
  lCutOffset: number; // Audio trailing seconds (audio continues after video)
}

export function computeAudioClipTimelineBounds(
  videoStart: number,
  videoDuration: number,
  offsets: JCutLCutOffsets
): { timelineStart: number; duration: number } {
  const timelineStart = Math.max(0, videoStart - offsets.jCutOffset);
  const duration = videoDuration + offsets.jCutOffset + offsets.lCutOffset;

  return {
    timelineStart,
    duration,
  };
}

export function applyDuckingToTracks(
  tracks: AudioClipItem[],
  voiceoverActiveAt: { start: number; end: number }[]
): AudioClipItem[] {
  return tracks.map((clip) => {
    const isOverlappingVoice = voiceoverActiveAt.some(
      (vo) => clip.timelineStart < vo.end && clip.timelineStart + clip.duration > vo.start
    );

    if (isOverlappingVoice && clip.ducking !== false) {
      return {
        ...clip,
        volume: Math.max(0.1, clip.volume * 0.4), // Duck background track by 60%
      };
    }
    return clip;
  });
}
