export interface JLCutBounds {
  audioStart: number;
  audioDuration: number;
}

export function calculateJLCutBounds(
  timelineStart: number,
  clipDuration: number,
  jCutOffset: number = 0, // negative number e.g. -1.0s (starts early)
  lCutOffset: number = 0  // positive number e.g. +1.0s (ends late)
): JLCutBounds {
  const audioStart = Math.max(0, timelineStart + jCutOffset);
  const audioDuration = clipDuration + Math.abs(jCutOffset) + lCutOffset;
  return { audioStart, audioDuration };
}

export function buildAudioFilterString(
  durationSec: number,
  delayMs: number,
  volume: number = 0.8
): string {
  return `atrim=0:${durationSec},asetpts=PTS-STARTPTS,volume=${volume},adelay=${delayMs}|${delayMs}`;
}
