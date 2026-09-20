export type CutStrategyType =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity"
  | "fade_to_black"
  | "crossfade"
  | "dip_to_black";

export interface CutMetadata {
  strategy: CutStrategyType;
  jCutOffset?: number; // Audio leads video (negative seconds, e.g. -1.0s)
  lCutOffset?: number; // Audio tails after video changes (positive seconds, e.g. +1.0s)
  reasoning?: string;
}

/**
 * Calculates audio lead-in (J-cut) or audio trailing (L-cut) time bounds.
 */
export function calculateCutOverlapBounds(
  sceneTimelineStart: number,
  sceneDuration: number,
  jCutOffset: number = 0,
  lCutOffset: number = 0
) {
  const audioStart = Math.max(0, sceneTimelineStart + jCutOffset);
  const audioDuration = sceneDuration + Math.abs(jCutOffset) + lCutOffset;

  return {
    audioStart,
    audioDuration,
    hasJCut: jCutOffset < 0,
    hasLCut: lCutOffset > 0,
  };
}
