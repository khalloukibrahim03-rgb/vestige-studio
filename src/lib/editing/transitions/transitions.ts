import { TransitionConfig } from "../types";

/**
 * Builds transition fade filters for an individual clip.
 * e.g., fade in from black or fade out to black.
 */
export function buildFadeFilters(
  durationSec: number,
  transitionIn?: TransitionConfig,
  transitionOut?: TransitionConfig
): string[] {
  const filters: string[] = [];

  if (transitionIn && transitionIn.type !== "none" && transitionIn.duration > 0) {
    if (transitionIn.type === "fade_to_black" || transitionIn.type === "dip_to_black") {
      filters.push(`fade=t=in:st=0:d=${transitionIn.duration}`);
    }
  }

  if (transitionOut && transitionOut.type !== "none" && transitionOut.duration > 0) {
    if (transitionOut.type === "fade_to_black" || transitionOut.type === "dip_to_black") {
      const startTime = Math.max(0, durationSec - transitionOut.duration);
      filters.push(`fade=t=out:st=${startTime}:d=${transitionOut.duration}`);
    }
  }

  return filters;
}
