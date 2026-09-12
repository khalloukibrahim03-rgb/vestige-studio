export type CutType =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity"
  | "fade_to_black"
  | "crossfade"
  | "dip_to_black";

export interface CutDescription {
  type: CutType;
  requiresTransitionFilter: boolean;
  editorialPurpose: string;
}

export function evaluateCutStrategy(cutType: CutType): CutDescription {
  switch (cutType) {
    case "fade_to_black":
    case "dip_to_black":
      return {
        type: cutType,
        requiresTransitionFilter: true,
        editorialPurpose: "Dramatically marks a scene transition or time lapse.",
      };
    case "crossfade":
      return {
        type: cutType,
        requiresTransitionFilter: true,
        editorialPurpose: "Smoothly dissolves visual elements during spatial or temporal movement.",
      };
    case "match_cut":
    case "motivated_cut":
    case "action_cut":
    case "visual_continuity":
      return {
        type: cutType,
        requiresTransitionFilter: false,
        editorialPurpose: "Maintains visual momentum and narrative continuity across cuts without distracting transitions.",
      };
    case "hard_cut":
    default:
      return {
        type: "hard_cut",
        requiresTransitionFilter: false,
        editorialPurpose: "Clean documentary cut that respects natural rhythm and keeps editing invisible.",
      };
  }
}
