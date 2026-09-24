/**
 * Editorial timing and dynamic shot duration calculation.
 */
export interface ShotTimingParams {
  shotType: "extreme_wide" | "wide" | "medium" | "close_up" | "macro" | "aerial" | "pov";
  narrativePurpose: string;
  pacing: "slow" | "building" | "contemplative" | "rapid" | "steady";
}

export function calculateRecommendedShotDuration(params: ShotTimingParams): number {
  let baseDuration = 5.0;

  switch (params.shotType) {
    case "extreme_wide":
    case "aerial":
      baseDuration = 6.5; // Longer for scale and context
      break;
    case "close_up":
    case "macro":
      baseDuration = 4.2; // Shorter for emotional intensity or detail
      break;
    case "medium":
    case "wide":
      baseDuration = 5.2;
      break;
    case "pov":
      baseDuration = 4.8;
      break;
  }

  if (params.pacing === "contemplative" || params.pacing === "slow") {
    baseDuration *= 1.25;
  } else if (params.pacing === "rapid") {
    baseDuration *= 0.75;
  }

  return Math.round(baseDuration * 10) / 10;
}
