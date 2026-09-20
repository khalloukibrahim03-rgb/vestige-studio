import { TransitionConfig } from "../types";

/**
 * Helper to build fade / transition filter flags for FFmpeg video streams.
 */
export function buildVideoTransitionFilter(
  transitionIn?: TransitionConfig,
  transitionOut?: TransitionConfig,
  clipDurationSec: number = 5
): string[] {
  const filters: string[] = [];

  if (transitionIn && transitionIn.type !== "none" && transitionIn.duration > 0) {
    if (transitionIn.type === "fade_to_black" || transitionIn.type === "dip_to_black") {
      filters.push(`fade=t=in:st=0:d=${transitionIn.duration}`);
    }
  }

  if (transitionOut && transitionOut.type !== "none" && transitionOut.duration > 0) {
    if (transitionOut.type === "fade_to_black" || transitionOut.type === "dip_to_black") {
      const startTime = Math.max(0, clipDurationSec - transitionOut.duration);
      filters.push(`fade=t=out:st=${startTime.toFixed(2)}:d=${transitionOut.duration}`);
    }
  }

  return filters;
}
