import { TransitionConfig } from "../types";

export type CutType =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity"
  | "fade_to_black"
  | "crossfade"
  | "dip_to_black";

export interface CutStrategy {
  type: CutType;
  description: string;
  defaultTransition: TransitionConfig;
  jCutOffset: number; // Lead-in audio offset in seconds (e.g. -0.8s)
  lCutOffset: number; // Lead-out audio offset in seconds (e.g. +1.2s)
}

export const CUT_STRATEGIES: Record<CutType, CutStrategy> = {
  hard_cut: {
    type: "hard_cut",
    description: "Instantaneous edit between shots without transition overlay. Standard documentary cutting.",
    defaultTransition: { type: "none", duration: 0 },
    jCutOffset: 0,
    lCutOffset: 0,
  },
  match_cut: {
    type: "match_cut",
    description: "Edit between two shots that match in visual action, compositional shape, or theme.",
    defaultTransition: { type: "none", duration: 0 },
    jCutOffset: -0.5,
    lCutOffset: 0.5,
  },
  motivated_cut: {
    type: "motivated_cut",
    description: "Cut driven by narrative action, sound cue, or subject gaze movement.",
    defaultTransition: { type: "none", duration: 0 },
    jCutOffset: -0.8,
    lCutOffset: 0.4,
  },
  action_cut: {
    type: "action_cut",
    description: "Cutting on action or motion to mask the visual transition seamlessly.",
    defaultTransition: { type: "none", duration: 0 },
    jCutOffset: -0.3,
    lCutOffset: 0.3,
  },
  visual_continuity: {
    type: "visual_continuity",
    description: "Smooth continuation of spatial or lighting direction between sequential scenes.",
    defaultTransition: { type: "visual_continuity", duration: 0.5 },
    jCutOffset: -0.6,
    lCutOffset: 0.6,
  },
  fade_to_black: {
    type: "fade_to_black",
    description: "Gradual video fade to black for major thematic shifts or scene resolution.",
    defaultTransition: { type: "fade_to_black", duration: 1.0 },
    jCutOffset: 0,
    lCutOffset: 0,
  },
  crossfade: {
    type: "crossfade",
    description: "Subtle cross-dissolve between overlapping environmental elements.",
    defaultTransition: { type: "crossfade", duration: 0.8 },
    jCutOffset: -0.4,
    lCutOffset: 0.4,
  },
  dip_to_black: {
    type: "dip_to_black",
    description: "Brief dip through black frame to signify passage of time or deep depth progression.",
    defaultTransition: { type: "dip_to_black", duration: 0.6 },
    jCutOffset: -0.5,
    lCutOffset: 0.5,
  },
};

export function getCutStrategy(strategyName: string): CutStrategy {
  const normalized = strategyName.toLowerCase().replace(/\s+/g, "_") as CutType;
  return CUT_STRATEGIES[normalized] || CUT_STRATEGIES.hard_cut;
}

export function computeJLCutOffsets(cutStrategyName: string, sceneDuration: number): { jCut: number; lCut: number } {
  const strategy = getCutStrategy(cutStrategyName);
  // Cap offsets to 25% of scene duration to avoid audio overlap distortion
  const maxOffset = sceneDuration * 0.25;
  const jCut = Math.max(strategy.jCutOffset, -maxOffset);
  const lCut = Math.min(strategy.lCutOffset, maxOffset);

  return { jCut, lCut };
}
