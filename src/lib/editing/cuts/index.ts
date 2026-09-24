/**
 * Documentary cutting strategies and classification.
 */
export type CutType =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity_cut"
  | "fade_to_black"
  | "crossfade"
  | "dip_to_black";

export interface CutDescriptor {
  type: CutType;
  description: string;
  defaultDurationSeconds: number;
}

export const CUT_LIBRARY: Record<CutType, CutDescriptor> = {
  hard_cut: {
    type: "hard_cut",
    description: "Direct, invisible cut serving narrative rhythm and momentum.",
    defaultDurationSeconds: 0,
  },
  match_cut: {
    type: "match_cut",
    description: "Cut linking two scenes with matching composition, motion, or subject form.",
    defaultDurationSeconds: 0,
  },
  motivated_cut: {
    type: "motivated_cut",
    description: "Cut triggered by subject movement or audio cue.",
    defaultDurationSeconds: 0,
  },
  action_cut: {
    type: "action_cut",
    description: "Cut occurring mid-action to maintain seamless visual continuity.",
    defaultDurationSeconds: 0,
  },
  visual_continuity_cut: {
    type: "visual_continuity_cut",
    description: "Cut maintaining spatial or directional vector continuity.",
    defaultDurationSeconds: 0,
  },
  fade_to_black: {
    type: "fade_to_black",
    description: "Fade out to black indicating major narrative transition or passage of time.",
    defaultDurationSeconds: 1.0,
  },
  crossfade: {
    type: "crossfade",
    description: "Subtle cross-dissolve linking atmosphere or ocean depths.",
    defaultDurationSeconds: 0.8,
  },
  dip_to_black: {
    type: "dip_to_black",
    description: "Brief dip to black representing loss of orientation or passage.",
    defaultDurationSeconds: 0.5,
  },
};
