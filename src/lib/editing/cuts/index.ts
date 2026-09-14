import { CutStrategy, DirectorScene } from "../../schemas/director-plan";

export interface CutDescription {
  type: CutStrategy;
  name: string;
  description: string;
  requiresTransition: boolean;
  defaultTransitionDuration: number;
}

export const CUT_STRATEGIES: Record<CutStrategy, CutDescription> = {
  hard_cut: {
    type: "hard_cut",
    name: "Hard Cut",
    description: "Direct instantaneous cut between scenes for raw documentary immediacy.",
    requiresTransition: false,
    defaultTransitionDuration: 0,
  },
  match_cut: {
    type: "match_cut",
    name: "Match Cut",
    description: "Cut matching visual composition or subject movement between consecutive shots.",
    requiresTransition: false,
    defaultTransitionDuration: 0,
  },
  motivated_cut: {
    type: "motivated_cut",
    name: "Motivated Cut",
    description: "Cut driven by narrative action, sound cue, or subject interest.",
    requiresTransition: false,
    defaultTransitionDuration: 0,
  },
  action_cut: {
    type: "action_cut",
    name: "Action Cut",
    description: "Cut during subject movement to maintain seamless momentum.",
    requiresTransition: false,
    defaultTransitionDuration: 0,
  },
  visual_continuity: {
    type: "visual_continuity",
    name: "Visual Continuity Cut",
    description: "Subtle cross-dissolve or match cut preserving fluid spatial continuity.",
    requiresTransition: true,
    defaultTransitionDuration: 0.8,
  },
  fade_to_black: {
    type: "fade_to_black",
    name: "Fade to Black",
    description: "Gradual fade out to black symbolizing scene closure or temporal transition.",
    requiresTransition: true,
    defaultTransitionDuration: 1.0,
  },
  crossfade: {
    type: "crossfade",
    name: "Crossfade / Dissolve",
    description: "Gentle visual blend connecting atmospheric or subterranean progression.",
    requiresTransition: true,
    defaultTransitionDuration: 0.6,
  },
  dip_to_black: {
    type: "dip_to_black",
    name: "Dip to Black",
    description: "Brief dip to black marking significant narrative chapter shift.",
    requiresTransition: true,
    defaultTransitionDuration: 0.8,
  },
};

export function evaluateJCutLCutOffsets(scene: DirectorScene): { jOffset: number; lOffset: number } {
  return {
    jOffset: scene.jCutOffset ?? 0,
    lOffset: scene.lCutOffset ?? 0,
  };
}
