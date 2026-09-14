import { TransitionConfig, TransitionType } from "../types";

export function createTransition(type: TransitionType, duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration,
  };
}

/**
 * Builds FFmpeg fade or crossfade filter parameters for video transitions.
 */
export function buildVideoTransitionFilter(type: TransitionType, duration: number, clipDuration: number): string[] {
  const filters: string[] = [];

  if (type === "fade_to_black" || type === "dip_to_black") {
    const fadeOutStart = Math.max(0, clipDuration - duration);
    filters.push(`fade=t=out:st=${fadeOutStart.toFixed(2)}:d=${duration.toFixed(2)}`);
  } else if (type === "crossfade") {
    const fadeOutStart = Math.max(0, clipDuration - duration);
    filters.push(`fade=t=out:st=${fadeOutStart.toFixed(2)}:d=${duration.toFixed(2)}`);
  }

  return filters;
}
