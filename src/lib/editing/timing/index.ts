import { ShotType } from "../../schemas/director-plan";

export interface PacingRule {
  minDuration: number;
  maxDuration: number;
  recommendedDuration: number;
  rationale: string;
}

export const SHOT_PACING_RULES: Record<ShotType, PacingRule> = {
  extreme_wide: {
    minDuration: 5.0,
    maxDuration: 8.5,
    recommendedDuration: 6.5,
    rationale: "Requires sufficient viewer dwell time to parse vast geographic scale and environmental context.",
  },
  wide: {
    minDuration: 4.5,
    maxDuration: 7.0,
    recommendedDuration: 5.5,
    rationale: "Establishes subject in their spatial environment with balanced narrative weight.",
  },
  medium: {
    minDuration: 3.5,
    maxDuration: 6.0,
    recommendedDuration: 4.5,
    rationale: "Focuses on relationship between subject and immediate action.",
  },
  close_up: {
    minDuration: 3.0,
    maxDuration: 5.5,
    recommendedDuration: 4.0,
    rationale: "Draws immediate emotional intimacy or subject significance.",
  },
  macro_detail: {
    minDuration: 3.0,
    maxDuration: 5.0,
    recommendedDuration: 4.2,
    rationale: "Punctuates scene with visceral or scientific discovery; best kept punchy to avoid visual fatigue.",
  },
  aerial: {
    minDuration: 5.0,
    maxDuration: 9.0,
    recommendedDuration: 6.8,
    rationale: "Sweeping perspective demands longer dwell to appreciate topography and majesty.",
  },
  pov: {
    minDuration: 3.0,
    maxDuration: 5.5,
    recommendedDuration: 4.0,
    rationale: "First-person immersion benefits from active progression.",
  },
  environmental: {
    minDuration: 4.5,
    maxDuration: 7.5,
    recommendedDuration: 5.8,
    rationale: "Absorbs ambient physical forces like currents, fog, weather, or marine twilight.",
  },
  scientific: {
    minDuration: 5.0,
    maxDuration: 8.0,
    recommendedDuration: 6.5,
    rationale: "Allows technical instruments, telemetry, or ROV scans to be clearly comprehended.",
  },
};

/**
 * Calculates optimal shot duration dynamically based on narrative purpose and shot grammar.
 */
export function calculateDynamicDuration(
  shotType: ShotType,
  intent: "scale" | "silence" | "anticipation" | "atmosphere" | "tension" | "discovery" | "information" = "atmosphere"
): number {
  const rule = SHOT_PACING_RULES[shotType] || SHOT_PACING_RULES.wide;

  switch (intent) {
    case "scale":
    case "silence":
    case "anticipation":
      return Math.min(rule.maxDuration, rule.recommendedDuration + 1.2);
    case "atmosphere":
      return rule.recommendedDuration;
    case "tension":
    case "discovery":
    case "information":
      return Math.max(rule.minDuration, rule.recommendedDuration - 0.8);
    default:
      return rule.recommendedDuration;
  }
}
