export interface AudioEditingParams {
  jCutOffset: number; // e.g. -1.0s (sound leads in before visual)
  lCutOffset: number; // e.g. +1.0s (sound tails out past visual)
  soundLevel: number;
  track: "A1_environment" | "A2_secondary" | "A3_voiceover" | "A4_music";
}

export function computeAudioTimings(
  timelineStart: number,
  clipDuration: number,
  params: Partial<AudioEditingParams>
) {
  const jOffset = params.jCutOffset || 0;
  const lOffset = params.lCutOffset || 0;

  const audioStart = Math.max(0, timelineStart + jOffset);
  const audioDuration = clipDuration + Math.abs(jOffset) + lOffset;

  return {
    audioStart,
    audioDuration,
    fadeInDuration: Math.abs(jOffset) > 0 ? 0.8 : 0.3,
    fadeOutDuration: lOffset > 0 ? 1.0 : 0.3,
  };
}
