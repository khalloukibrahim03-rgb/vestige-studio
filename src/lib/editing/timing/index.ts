import { DirectorScene } from "../../schemas/director-plan";

export interface TimingPacingMetrics {
  totalDuration: number;
  averageSceneDuration: number;
  longestSceneDuration: number;
  shortestSceneDuration: number;
}

/**
 * Calculates pacing metrics across scenes in a director plan.
 */
export function calculatePacingMetrics(scenes: DirectorScene[]): TimingPacingMetrics {
  if (scenes.length === 0) {
    return {
      totalDuration: 0,
      averageSceneDuration: 0,
      longestSceneDuration: 0,
      shortestSceneDuration: 0,
    };
  }

  const durations = scenes.map((s) => s.duration);
  const totalDuration = durations.reduce((acc, d) => acc + d, 0);
  const averageSceneDuration = totalDuration / scenes.length;
  const longestSceneDuration = Math.max(...durations);
  const shortestSceneDuration = Math.min(...durations);

  return {
    totalDuration,
    averageSceneDuration,
    longestSceneDuration,
    shortestSceneDuration,
  };
}
