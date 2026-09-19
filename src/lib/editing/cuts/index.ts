import { TransitionType } from "../types";

export type CutStrategyType =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity"
  | "j_cut"
  | "l_cut";

export interface CutDefinition {
  type: CutStrategyType;
  description: string;
  recommendedTransition: TransitionType;
  audioLeadSec?: number;
  audioTailSec?: number;
}

export const CUT_STRATEGIES: Record<CutStrategyType, CutDefinition> = {
  hard_cut: {
    type: "hard_cut",
    description: "Instantaneous edit between two shots. Standard for documentary pacing.",
    recommendedTransition: "none",
  },
  match_cut: {
    type: "match_cut",
    description: "Cuts between two shots that match in composition, shape, or action.",
    recommendedTransition: "none",
  },
  motivated_cut: {
    type: "motivated_cut",
    description: "Cut driven by narrative action, sound cue, or subject gaze.",
    recommendedTransition: "none",
  },
  action_cut: {
    type: "action_cut",
    description: "Cut occurring during subject movement to maintain seamless momentum.",
    recommendedTransition: "none",
  },
  visual_continuity: {
    type: "visual_continuity",
    description: "Smooth tonal or color continuity shift between scenes.",
    recommendedTransition: "visual_continuity",
  },
  j_cut: {
    type: "j_cut",
    description: "Audio of the upcoming shot precedes the visual cut by 0.5s - 1.5s.",
    recommendedTransition: "none",
    audioLeadSec: 1.0,
  },
  l_cut: {
    type: "l_cut",
    description: "Audio of the preceding shot continues for 0.5s - 1.5s into the next shot.",
    recommendedTransition: "none",
    audioTailSec: 1.0,
  },
};

export function resolveCutStrategy(strategyName: string): CutDefinition {
  const normalized = strategyName.toLowerCase().replace(/[^a-z_]/g, "_") as CutStrategyType;
  return CUT_STRATEGIES[normalized] || CUT_STRATEGIES.hard_cut;
}
