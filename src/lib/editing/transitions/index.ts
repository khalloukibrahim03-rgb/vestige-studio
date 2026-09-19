import { TransitionConfig, TransitionType } from "../types";

export interface TransitionDefinition {
  type: TransitionType;
  name: string;
  defaultDurationSec: number;
  description: string;
}

export const TRANSITION_DEFINITIONS: Record<TransitionType, TransitionDefinition> = {
  none: {
    type: "none",
    name: "Hard Cut",
    defaultDurationSec: 0,
    description: "Direct cut without visual blend.",
  },
  crossfade: {
    type: "crossfade",
    name: "Cross Dissolve",
    defaultDurationSec: 0.8,
    description: "Gradual dissolve between incoming and outgoing shots.",
  },
  fade_to_black: {
    type: "fade_to_black",
    name: "Fade to Black",
    defaultDurationSec: 1.0,
    description: "Shot fades smoothly into blackness to indicate scene transition or temporal lapse.",
  },
  dip_to_black: {
    type: "dip_to_black",
    name: "Dip to Black",
    defaultDurationSec: 0.6,
    description: "Short dip into black between scenes.",
  },
  visual_continuity: {
    type: "visual_continuity",
    name: "Visual Continuity Crossfade",
    defaultDurationSec: 0.5,
    description: "Soft blend tailored for matched graphic or motion elements.",
  },
};

export function createTransitionConfig(
  type: TransitionType = "none",
  customDuration?: number
): TransitionConfig {
  const def = TRANSITION_DEFINITIONS[type] || TRANSITION_DEFINITIONS.none;
  return {
    type: def.type,
    duration: customDuration ?? def.defaultDurationSec,
  };
}
