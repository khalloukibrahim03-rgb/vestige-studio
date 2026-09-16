import { CutStrategy } from "../../schemas/director-plan";

export interface CutDefinition {
  strategy: CutStrategy;
  description: string;
  recommendedTransitionDuration: number;
}

export const EDITORIAL_CUT_DEFINITIONS: Record<CutStrategy, CutDefinition> = {
  hard_cut: {
    strategy: "hard_cut",
    description: "Abrupt transition from one shot to another. Clean documentary threshold.",
    recommendedTransitionDuration: 0,
  },
  match_cut: {
    strategy: "match_cut",
    description: "Cut between two shots that match in action, composition, or subject matter.",
    recommendedTransitionDuration: 0,
  },
  motivated_cut: {
    strategy: "motivated_cut",
    description: "Cut driven by narrative action, sound cue, or subject movement.",
    recommendedTransitionDuration: 0,
  },
  action_cut: {
    strategy: "action_cut",
    description: "Cut in the middle of a continuous subject motion.",
    recommendedTransitionDuration: 0,
  },
  visual_continuity: {
    strategy: "visual_continuity",
    description: "Matches visual vector or direction of motion across the edit.",
    recommendedTransitionDuration: 0.5,
  },
  fade_to_black: {
    strategy: "fade_to_black",
    description: "Fades visual to solid black before introducing next scene.",
    recommendedTransitionDuration: 1.0,
  },
  crossfade: {
    strategy: "crossfade",
    description: "Smooth dissolve transition blending outgoing and incoming footage.",
    recommendedTransitionDuration: 0.8,
  },
  dip_to_black: {
    strategy: "dip_to_black",
    description: "Quick fade down to black and back up to incoming scene.",
    recommendedTransitionDuration: 0.6,
  },
};
