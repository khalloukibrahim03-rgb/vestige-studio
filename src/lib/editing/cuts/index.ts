import { CutStrategy } from "../../schemas/director-plan";

export interface CutDecision {
  strategy: CutStrategy;
  description: string;
  recommendedTransitionDuration: number;
}

export function evaluateCutStrategy(strategy: CutStrategy): CutDecision {
  switch (strategy) {
    case "hard_cut":
      return {
        strategy,
        description: "Direct, instantaneous cut maintaining documentary realism.",
        recommendedTransitionDuration: 0,
      };
    case "crossfade":
      return {
        strategy,
        description: "Smooth dissolution between light/tone levels.",
        recommendedTransitionDuration: 0.8,
      };
    case "fade_to_black":
      return {
        strategy,
        description: "Fade out into total darkness for scene/chapter boundaries.",
        recommendedTransitionDuration: 1.0,
      };
    case "visual_continuity":
      return {
        strategy,
        description: "Cut matching continuous visual direction or motion.",
        recommendedTransitionDuration: 0.5,
      };
    case "motivated_cut":
      return {
        strategy,
        description: "Cut timed precisely with on-screen action or sonic cue.",
        recommendedTransitionDuration: 0.3,
      };
    default:
      return {
        strategy,
        description: "Standard documentary cut.",
        recommendedTransitionDuration: 0.5,
      };
  }
}
