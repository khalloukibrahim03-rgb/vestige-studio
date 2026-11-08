export type CutType =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity"
  | "fade_to_black"
  | "crossfade"
  | "dip_to_black";

export interface CutDecision {
  type: CutType;
  rationale: string;
  recommendedTransitionDuration: number;
}

/**
 * Evaluates cut strategies for documentary storytelling.
 * Respects the core principle: simple cuts are preferred; transitions must be narratively motivated.
 */
export function getCutProperties(cutType: CutType): CutDecision {
  switch (cutType) {
    case "hard_cut":
      return {
        type: "hard_cut",
        rationale: "Clean documentary cut. Preserves raw momentum and temporal immediacy.",
        recommendedTransitionDuration: 0,
      };
    case "match_cut":
      return {
        type: "match_cut",
        rationale: "Graphically aligns subject or motion vectors between sequential shots.",
        recommendedTransitionDuration: 0,
      };
    case "motivated_cut":
      return {
        type: "motivated_cut",
        rationale: "Triggered by an internal narrative event, glance, or audio cue.",
        recommendedTransitionDuration: 0,
      };
    case "action_cut":
      return {
        type: "action_cut",
        rationale: "Cuts mid-movement to mask the transition through visual flow.",
        recommendedTransitionDuration: 0,
      };
    case "fade_to_black":
      return {
        type: "fade_to_black",
        rationale: "Signals chapter transition, closure, or dramatic passage of time.",
        recommendedTransitionDuration: 0.8,
      };
    case "crossfade":
      return {
        type: "crossfade",
        rationale: "Blends visual environments to signify atmospheric progression.",
        recommendedTransitionDuration: 0.6,
      };
    case "dip_to_black":
      return {
        type: "dip_to_black",
        rationale: "Momentary dip into darkness to allow emotional resonance before the next scene.",
        recommendedTransitionDuration: 0.7,
      };
    case "visual_continuity":
    default:
      return {
        type: "visual_continuity",
        rationale: "Maintains visual continuity of color and luminance across adjacent frames.",
        recommendedTransitionDuration: 0.5,
      };
  }
}
