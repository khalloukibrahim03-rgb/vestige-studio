export type CutStrategy =
  | "hard_cut"
  | "match_cut"
  | "motivated_cut"
  | "action_cut"
  | "visual_continuity"
  | "fade_to_black"
  | "crossfade"
  | "dip_to_black";

export interface CutDefinition {
  strategy: CutStrategy;
  description: string;
  isHardCut: boolean;
}

export const CUT_STRATEGIES: Record<CutStrategy, CutDefinition> = {
  hard_cut: {
    strategy: "hard_cut",
    description: "Instantaneous edit transition between consecutive scenes.",
    isHardCut: true,
  },
  match_cut: {
    strategy: "match_cut",
    description: "Graphic or thematic alignment between ending and starting framing.",
    isHardCut: true,
  },
  motivated_cut: {
    strategy: "motivated_cut",
    description: "Cut triggered by subject action or audio cue.",
    isHardCut: true,
  },
  action_cut: {
    strategy: "action_cut",
    description: "Cutting mid-movement to preserve fluid narrative motion.",
    isHardCut: true,
  },
  visual_continuity: {
    strategy: "visual_continuity",
    description: "Maintaining spatial and compositional direction across cuts.",
    isHardCut: true,
  },
  fade_to_black: {
    strategy: "fade_to_black",
    description: "Gradual luminance decay signaling scene completion or passage of time.",
    isHardCut: false,
  },
  crossfade: {
    strategy: "crossfade",
    description: "Dissolve blending adjacent visual elements.",
    isHardCut: false,
  },
  dip_to_black: {
    strategy: "dip_to_black",
    description: "Brief black interlude between major documentary movements.",
    isHardCut: false,
  },
};
