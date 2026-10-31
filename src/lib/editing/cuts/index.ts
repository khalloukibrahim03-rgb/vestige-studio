import { CutStrategy } from "../../schemas/director-plan";

export interface CutDefinition {
  strategy: CutStrategy;
  name: string;
  description: string;
  narrativeUse: string;
  defaultDuration: number; // Duration of visual transition if applicable
}

export const CUT_DEFINITIONS: Record<CutStrategy, CutDefinition> = {
  hard_cut: {
    strategy: "hard_cut",
    name: "Hard Cut",
    description: "Instantaneous transition from one shot to the next without overlap.",
    narrativeUse: "Direct documentary realism, threshold crossings, immediate narrative shifts.",
    defaultDuration: 0,
  },
  match_cut: {
    strategy: "match_cut",
    name: "Match Cut",
    description: "Cut matching graphic shape, motion vector, or subject placement across scenes.",
    narrativeUse: "Connecting thematic parallels or bridging spatial/temporal leaps.",
    defaultDuration: 0,
  },
  motivated_cut: {
    strategy: "motivated_cut",
    name: "Motivated Cut",
    description: "Cut triggered by an in-frame visual cue, eye trace, or off-screen audio prompt.",
    narrativeUse: "Directing viewer attention naturally following discovery or organic motion.",
    defaultDuration: 0,
  },
  action_cut: {
    strategy: "action_cut",
    name: "Action Cut",
    description: "Cut that occurs in the middle of a continuous action.",
    narrativeUse: "Hiding the transition within kinetic energy for seamless continuity.",
    defaultDuration: 0,
  },
  visual_continuity: {
    strategy: "visual_continuity",
    name: "Visual Continuity Cut",
    description: "Maintains screen direction, spatial geometry, and luminance balance.",
    narrativeUse: "Preserving geographical and spatial orientation in documentary sequences.",
    defaultDuration: 0.5,
  },
  fade_to_black: {
    strategy: "fade_to_black",
    name: "Fade to Black",
    description: "Gradual transition from the scene to black slug.",
    narrativeUse: "Signaling chapter conclusions, passage of deep time, solemn reflection.",
    defaultDuration: 1.0,
  },
  crossfade: {
    strategy: "crossfade",
    name: "Crossfade",
    description: "Gradual visual dissolve blending one shot into the next.",
    narrativeUse: "Dreamlike descent, fluid water transitions, shifting states of consciousness.",
    defaultDuration: 0.8,
  },
  dip_to_black: {
    strategy: "dip_to_black",
    name: "Dip to Black",
    description: "Brief fade to black slug followed immediately by a fade up into the next scene.",
    narrativeUse: "Punctuation mark indicating significant elapsed time or complete scene reset.",
    defaultDuration: 0.8,
  },
};

export function getCutDefinition(strategy: CutStrategy): CutDefinition {
  return CUT_DEFINITIONS[strategy] || CUT_DEFINITIONS.hard_cut;
}
