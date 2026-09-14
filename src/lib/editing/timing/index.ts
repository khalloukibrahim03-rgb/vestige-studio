import { DirectorScene } from "../../schemas/director-plan";

export interface ShotPacingRules {
  minDuration: number;
  maxDuration: number;
  recommendedPacing: string;
}

export function getRecommendedShotPacing(shotType: DirectorScene["shotType"]): ShotPacingRules {
  switch (shotType) {
    case "extreme_wide":
    case "aerial":
    case "environmental":
      return {
        minDuration: 5.0,
        maxDuration: 8.0,
        recommendedPacing: "Longer duration to establish environment, scale, and atmospheric grandeur.",
      };
    case "close_up":
    case "macro_detail":
      return {
        minDuration: 3.0,
        maxDuration: 5.5,
        recommendedPacing: "Moderate to short duration for focused detail and discovery impact.",
      };
    case "scientific":
    case "pov":
      return {
        minDuration: 4.5,
        maxDuration: 7.0,
        recommendedPacing: "Sustained view to allow observation of technical instruments and subject dynamics.",
      };
    default:
      return {
        minDuration: 4.0,
        maxDuration: 6.5,
        recommendedPacing: "Balanced documentary pace matching rhythm and spoken narrative flow.",
      };
  }
}

export function calculateTotalTimelineDuration(scenes: { duration: number }[]): number {
  return scenes.reduce((sum, s) => sum + s.duration, 0);
}
