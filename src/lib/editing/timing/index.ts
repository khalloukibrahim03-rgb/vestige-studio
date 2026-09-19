export interface RhythmProfile {
  pacing: "contemplative" | "steady" | "dynamic" | "suspenseful";
  minShotDurationSec: number;
  maxShotDurationSec: number;
  defaultShotDurationSec: number;
}

export const RHYTHM_PROFILES: Record<string, RhythmProfile> = {
  contemplative: {
    pacing: "contemplative",
    minShotDurationSec: 5.0,
    maxShotDurationSec: 10.0,
    defaultShotDurationSec: 6.5,
  },
  steady: {
    pacing: "steady",
    minShotDurationSec: 3.5,
    maxShotDurationSec: 7.0,
    defaultShotDurationSec: 5.0,
  },
  dynamic: {
    pacing: "dynamic",
    minShotDurationSec: 2.0,
    maxShotDurationSec: 4.5,
    defaultShotDurationSec: 3.2,
  },
  suspenseful: {
    pacing: "suspenseful",
    minShotDurationSec: 3.0,
    maxShotDurationSec: 8.0,
    defaultShotDurationSec: 5.5,
  },
};

export function evaluateShotTiming(
  pacing: string,
  scenePurpose: string,
  baseDurationSec?: number
): number {
  const profile = RHYTHM_PROFILES[pacing] || RHYTHM_PROFILES.steady;

  if (baseDurationSec && baseDurationSec > 0) {
    return Math.min(
      profile.maxShotDurationSec,
      Math.max(profile.minShotDurationSec, baseDurationSec)
    );
  }

  const purposeLower = scenePurpose.toLowerCase();
  if (purposeLower.includes("scale") || purposeLower.includes("establish") || purposeLower.includes("abyss")) {
    return profile.maxShotDurationSec;
  } else if (purposeLower.includes("discovery") || purposeLower.includes("reveal")) {
    return profile.minShotDurationSec + 1.0;
  }

  return profile.defaultShotDurationSec;
}
