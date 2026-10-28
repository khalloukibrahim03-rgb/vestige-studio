import { CutStrategy } from "../../schemas/director-plan";

export interface CutDefinition {
  type: CutStrategy;
  name: string;
  description: string;
  defaultTransitionDuration: number;
}

export const CUT_STRATEGIES: Record<CutStrategy, CutDefinition> = {
  hard_cut: {
    type: "hard_cut",
    name: "Hard Cut",
    description: "Instantaneous edit transition without dissolve.",
    defaultTransitionDuration: 0,
  },
  match_cut: {
    type: "match_cut",
    name: "Match Cut",
    description: "Visual continuation connecting action or shape across scenes.",
    defaultTransitionDuration: 0,
  },
  motivated_cut: {
    type: "motivated_cut",
    name: "Motivated Cut",
    description: "Edit triggered by narrative action or acoustic cue.",
    defaultTransitionDuration: 0,
  },
  action_cut: {
    type: "action_cut",
    name: "Cut on Action",
    description: "Transition during kinetic motion for seamless momentum.",
    defaultTransitionDuration: 0,
  },
  visual_continuity: {
    type: "visual_continuity",
    name: "Visual Continuity",
    description: "Smooth dissolve preserving spatial orientation.",
    defaultTransitionDuration: 0.8,
  },
  fade_to_black: {
    type: "fade_to_black",
    name: "Fade to Black",
    description: "Gradual luminance decay signaling scene end or chapter break.",
    defaultTransitionDuration: 1.0,
  },
  crossfade: {
    type: "crossfade",
    name: "Crossfade",
    description: "Gentle optical blend between outgoing and incoming footage.",
    defaultTransitionDuration: 0.8,
  },
  dip_to_black: {
    type: "dip_to_black",
    name: "Dip to Black",
    description: "Brief fade to black and back to signify time progression.",
    defaultTransitionDuration: 1.0,
  },
};

export function getCutStrategy(strategy: CutStrategy): CutDefinition {
  return CUT_STRATEGIES[strategy] || CUT_STRATEGIES.hard_cut;
}
