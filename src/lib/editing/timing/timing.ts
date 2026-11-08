import { ShotType } from "../../schemas/director-plan";

export interface TimingPacingRule {
  minDuration: number;
  maxDuration: number;
  defaultDuration: number;
  narrativeFunction: string;
}

export const SHOT_TIMING_RULES: Record<ShotType, TimingPacingRule> = {
  extreme_wide: {
    minDuration: 5.0,
    maxDuration: 8.5,
    defaultDuration: 6.2,
    narrativeFunction: "Establishes grand scale, environmental isolation, and atmospheric stillness.",
  },
  wide: {
    minDuration: 4.5,
    maxDuration: 7.0,
    defaultDuration: 5.4,
    narrativeFunction: "Provides spatial context and introduces physical thresholds.",
  },
  medium: {
    minDuration: 3.5,
    maxDuration: 6.0,
    defaultDuration: 4.8,
    narrativeFunction: "Follows subject action and contextual interactions.",
  },
  close_up: {
    minDuration: 3.0,
    maxDuration: 5.5,
    defaultDuration: 4.2,
    narrativeFunction: "Heightens emotional connection and intimacy.",
  },
  macro_detail: {
    minDuration: 3.0,
    maxDuration: 5.0,
    defaultDuration: 4.5,
    narrativeFunction: "Punchy, focused revelation of intricate organic or technical textures.",
  },
  aerial: {
    minDuration: 5.0,
    maxDuration: 9.0,
    defaultDuration: 6.5,
    narrativeFunction: "Sweeping geographical and geological perspective.",
  },
  pov: {
    minDuration: 3.0,
    maxDuration: 5.5,
    defaultDuration: 4.0,
    narrativeFunction: "Direct subjective immersion from the observer's standpoint.",
  },
  environmental: {
    minDuration: 4.5,
    maxDuration: 7.5,
    defaultDuration: 6.0,
    narrativeFunction: "Builds tactile presence through changing light and ambient currents.",
  },
  scientific: {
    minDuration: 4.5,
    maxDuration: 8.0,
    defaultDuration: 6.5,
    narrativeFunction: "Careful analytical observation of exploratory instruments and findings.",
  },
};

/**
 * Validates and refines dynamic shot duration based on narrative rhythm.
 */
export function getRefinedShotDuration(shotType: ShotType, requestedDuration?: number): number {
  const rule = SHOT_TIMING_RULES[shotType] || SHOT_TIMING_RULES.medium;
  if (!requestedDuration) return rule.defaultDuration;
  return Math.max(rule.minDuration, Math.min(rule.maxDuration, requestedDuration));
}
