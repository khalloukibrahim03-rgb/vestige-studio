import { TransitionConfig } from "../types";

/**
 * Generates FFmpeg video transition filter expressions (e.g., fade out to black / crossfade).
 */
export function buildTransitionFilter(transition: TransitionConfig, clipDuration: number): string[] {
  const filters: string[] = [];
  if (transition.type === "none" || transition.duration <= 0) return filters;

  if (transition.type === "fade_to_black" || transition.type === "dip_to_black") {
    const startTime = Math.max(0, clipDuration - transition.duration);
    filters.push(`fade=t=out:st=${startTime.toFixed(2)}:d=${transition.duration.toFixed(2)}`);
  }

  return filters;
}
