import { TransitionType } from "../types";

export type CutStrategy = "hard_cut" | "match_cut" | "motivated_cut" | "action_cut" | "fade_to_black" | "crossfade" | "dip_to_black";

export interface CutDefinition {
  type: CutStrategy;
  transitionType: TransitionType;
  defaultDuration: number;
}

export const CUT_STRATEGIES: Record<CutStrategy, CutDefinition> = {
  hard_cut: { type: "hard_cut", transitionType: "none", defaultDuration: 0 },
  match_cut: { type: "match_cut", transitionType: "visual_continuity", defaultDuration: 0 },
  motivated_cut: { type: "motivated_cut", transitionType: "none", defaultDuration: 0 },
  action_cut: { type: "action_cut", transitionType: "none", defaultDuration: 0 },
  fade_to_black: { type: "fade_to_black", transitionType: "fade_to_black", defaultDuration: 0.5 },
  crossfade: { type: "crossfade", transitionType: "crossfade", defaultDuration: 0.8 },
  dip_to_black: { type: "dip_to_black", transitionType: "dip_to_black", defaultDuration: 0.6 },
};

export function resolveCutTransition(strategy: CutStrategy, customDuration?: number): { type: TransitionType; duration: number } {
  const cut = CUT_STRATEGIES[strategy] || CUT_STRATEGIES.hard_cut;
  return {
    type: cut.transitionType,
    duration: customDuration ?? cut.defaultDuration,
  };
}
