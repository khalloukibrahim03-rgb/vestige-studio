export interface JLOffset {
  audioStartOffset: number; // Negative value for J-cut (audio starts before visual cut)
  audioEndOffset: number;   // Positive value for L-cut (audio continues after visual cut)
}

/**
 * Calculates J-cut and L-cut timing offsets for audio-visual continuity.
 */
export function calculateJLTiming(jCutOffset: number = 0, lCutOffset: number = 0, currentTimelineTime: number = 0, clipDuration: number = 0): {
  audioTimelineStart: number;
  audioDuration: number;
  fadeInDuration: number;
  fadeOutDuration: number;
} {
  const audioTimelineStart = Math.max(0, currentTimelineTime + jCutOffset);
  const audioDuration = clipDuration + Math.abs(jCutOffset) + lCutOffset;
  const fadeInDuration = Math.abs(jCutOffset) > 0 ? 0.8 : 0.3;
  const fadeOutDuration = lCutOffset > 0 ? 1.0 : 0.3;

  return {
    audioTimelineStart,
    audioDuration,
    fadeInDuration,
    fadeOutDuration,
  };
}
