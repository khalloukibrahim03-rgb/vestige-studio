export interface ShotRhythm {
  purpose: string;
  recommendedDurationRange: [number, number]; // [min, max] in seconds
}

export const RHYTHM_GUIDELINES: Record<string, ShotRhythm> = {
  scale_and_isolation: {
    purpose: "Establish vast scale and isolation",
    recommendedDurationRange: [5.0, 8.0],
  },
  spatial_transition: {
    purpose: "Move viewer across environments",
    recommendedDurationRange: [4.5, 6.5],
  },
  loss_of_familiarity: {
    purpose: "Evoke mystery and darkness",
    recommendedDurationRange: [5.5, 7.5],
  },
  discovery: {
    purpose: "Reveal unexpected life or information",
    recommendedDurationRange: [3.5, 5.0],
  },
  technological_contrast: {
    purpose: "Human technology against nature's scale",
    recommendedDurationRange: [6.0, 9.0],
  },
};

/**
 * Dynamically adjusts shot duration based on scene purpose and overall narrative pacing.
 */
export function calculateDynamicDuration(purposeKey: string, baseDuration: number): number {
  const guideline = RHYTHM_GUIDELINES[purposeKey];
  if (!guideline) return Math.max(3.0, baseDuration);

  const [min, max] = guideline.recommendedDurationRange;
  return Math.min(max, Math.max(min, baseDuration));
}
