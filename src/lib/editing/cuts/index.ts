import { TransitionConfig, TransitionType } from "../types";

export interface CutStrategyConfig {
  type: TransitionType;
  duration: number;
}

/**
 * Resolves editorial cut strategy into concrete FFmpeg transition parameters.
 */
export function resolveCutStrategy(strategyName: string, preferredDuration: number = 0.5): TransitionConfig {
  switch (strategyName) {
    case "fade_to_black":
    case "dip_to_black":
      return { type: "fade_to_black", duration: preferredDuration };
    case "crossfade":
      return { type: "crossfade", duration: preferredDuration };
    case "visual_continuity":
      return { type: "visual_continuity", duration: preferredDuration };
    case "hard_cut":
    case "match_cut":
    case "action_cut":
    default:
      return { type: "none", duration: 0 };
  }
}
