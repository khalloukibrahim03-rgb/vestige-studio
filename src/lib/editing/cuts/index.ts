import { CutStrategy } from "../../schemas/director-plan";

export interface CutEvaluation {
  strategy: CutStrategy;
  description: string;
  isHardCut: boolean;
  requiresCrossfade: boolean;
  requiresDipToBlack: boolean;
}

/**
 * Evaluates editorial intention behind cut strategies.
 */
export function evaluateCutStrategy(strategy: CutStrategy): CutEvaluation {
  switch (strategy) {
    case "hard_cut":
      return {
        strategy,
        description: "Direct, immediate transition between consecutive shots preserving temporal momentum.",
        isHardCut: true,
        requiresCrossfade: false,
        requiresDipToBlack: false,
      };
    case "match_cut":
      return {
        strategy,
        description: "Seamless edit matching visual composition, motion, or subject geometry between shots.",
        isHardCut: true,
        requiresCrossfade: false,
        requiresDipToBlack: false,
      };
    case "motivated_cut":
      return {
        strategy,
        description: "Edit triggered by visual action, sound cue, or narrative revelation.",
        isHardCut: true,
        requiresCrossfade: false,
        requiresDipToBlack: false,
      };
    case "action_cut":
      return {
        strategy,
        description: "Cut occurring during continuous action to create imperceptible movement continuity.",
        isHardCut: true,
        requiresCrossfade: false,
        requiresDipToBlack: false,
      };
    case "visual_continuity":
      return {
        strategy,
        description: "Cut maintaining screen direction, eye-line match, or spatial orientation.",
        isHardCut: true,
        requiresCrossfade: false,
        requiresDipToBlack: false,
      };
    case "crossfade":
      return {
        strategy,
        description: "Soft visual blend between scenes signifying time progression or emotional shift.",
        isHardCut: false,
        requiresCrossfade: true,
        requiresDipToBlack: false,
      };
    case "dip_to_black":
    case "fade_to_black":
      return {
        strategy,
        description: "Fade to black marking major narrative chapter changes or dramatic punctuation.",
        isHardCut: false,
        requiresCrossfade: false,
        requiresDipToBlack: true,
      };
    default:
      return {
        strategy: "hard_cut",
        description: "Standard documentary cut.",
        isHardCut: true,
        requiresCrossfade: false,
        requiresDipToBlack: false,
      };
  }
}
