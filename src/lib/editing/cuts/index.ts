import { TransitionType } from "../types";

export interface CutDefinition {
  type: TransitionType;
  name: string;
  description: string;
}

export const CUT_STRATEGIES: Record<string, CutDefinition> = {
  hard_cut: {
    type: "none",
    name: "Hard Cut",
    description: "Direct instantaneous edit between two shots for rhythm and momentum.",
  },
  crossfade: {
    type: "crossfade",
    name: "Crossfade / Dissolve",
    description: "Smooth blend between consecutive shots indicating passage of time or atmosphere.",
  },
  fade_to_black: {
    type: "fade_to_black",
    name: "Fade to Black",
    description: "Gradual transition to complete darkness representing scene resolution or thematic shift.",
  },
  dip_to_black: {
    type: "dip_to_black",
    name: "Dip to Black",
    description: "Brief pulse through darkness connecting separate movements in narrative.",
  },
  visual_continuity: {
    type: "visual_continuity",
    name: "Visual Continuity Cut",
    description: "Match cut preserving vector movement or spatial composition across edits.",
  },
};

/**
 * Calculates J-cut (audio lead-in) and L-cut (audio tailing) timing windows.
 */
export function calculateJLCutTiming(sceneDuration: number, jCutOffset: number = 0, lCutOffset: number = 0) {
  const audioStartOffset = Math.min(0, jCutOffset);
  const totalAudioDuration = sceneDuration + Math.abs(audioStartOffset) + Math.max(0, lCutOffset);

  return {
    audioStartOffset,
    totalAudioDuration,
    hasJCut: jCutOffset < 0,
    hasLCut: lCutOffset > 0,
  };
}
