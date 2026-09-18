export interface TimingProfile {
  shotType: string;
  minDuration: number;
  maxDuration: number;
  recommendedDuration: number;
}

export const SHOT_TIMING_PROFILES: Record<string, TimingProfile> = {
  extreme_wide: {
    shotType: "extreme_wide",
    minDuration: 5.0,
    maxDuration: 8.0,
    recommendedDuration: 6.5,
  },
  wide: {
    shotType: "wide",
    minDuration: 4.5,
    maxDuration: 7.0,
    recommendedDuration: 5.5,
  },
  medium: {
    shotType: "medium",
    minDuration: 3.5,
    maxDuration: 6.0,
    recommendedDuration: 4.5,
  },
  close_up: {
    shotType: "close_up",
    minDuration: 2.5,
    maxDuration: 5.0,
    recommendedDuration: 3.8,
  },
  macro: {
    shotType: "macro",
    minDuration: 3.0,
    maxDuration: 5.5,
    recommendedDuration: 4.2,
  },
  aerial: {
    shotType: "aerial",
    minDuration: 5.0,
    maxDuration: 8.5,
    recommendedDuration: 6.8,
  },
  environmental: {
    shotType: "environmental",
    minDuration: 4.0,
    maxDuration: 7.5,
    recommendedDuration: 5.8,
  },
};

export function getRecommendedShotDuration(shotType: string, purpose?: string): number {
  const normalized = shotType.toLowerCase().replace(/[\s-]+/g, "_");
  const profile = SHOT_TIMING_PROFILES[normalized] || SHOT_TIMING_PROFILES.medium;

  let duration = profile.recommendedDuration;

  // Extend duration for atmospheric, scale-establishing, or anticipation scenes
  if (purpose) {
    const p = purpose.toLowerCase();
    if (p.includes("establish") || p.includes("scale") || p.includes("isolation") || p.includes("atmosphere")) {
      duration += 0.8;
    } else if (p.includes("discovery") || p.includes("reveal") || p.includes("tension")) {
      duration -= 0.5;
    }
  }

  return Math.max(profile.minDuration, Math.min(profile.maxDuration, duration));
}
