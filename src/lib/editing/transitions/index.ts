import { TransitionConfig, TransitionType } from "../types";

export interface TransitionFilterOptions {
  type: TransitionType;
  duration: number;
  offsetSec?: number;
}

/**
 * Builds FFmpeg complex filter options for scene transitions.
 */
export function buildTransitionFilterConfig(config: TransitionConfig): TransitionFilterOptions {
  return {
    type: config.type,
    duration: Math.max(0, config.duration || 0.5),
  };
}

/**
 * Validates if a transition requires video stream blending.
 */
export function isBlendingTransition(type: TransitionType): boolean {
  return type === "crossfade" || type === "dip_to_black" || type === "fade_to_black";
}
