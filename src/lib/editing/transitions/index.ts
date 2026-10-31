import { TransitionType, TransitionConfig } from "../types";

export interface TransitionFilterOptions {
  type: TransitionType;
  duration: number;
  clipDuration: number;
}

/**
 * Builds modular FFmpeg video filter strings for in/out transitions.
 */
export function buildTransitionFilter(options: TransitionFilterOptions): string[] {
  const { type, duration, clipDuration } = options;
  const filters: string[] = [];

  if (type === "none" || duration <= 0) {
    return filters;
  }

  const effectiveDuration = Math.min(duration, clipDuration / 2);

  switch (type) {
    case "fade_to_black":
    case "dip_to_black": {
      // Fade out at end of clip: fade=t=out:st=START_TIME:d=DURATION
      const startOut = Math.max(0, clipDuration - effectiveDuration);
      filters.push(`fade=t=out:st=${startOut.toFixed(2)}:d=${effectiveDuration.toFixed(2)}`);
      // Also fade in at beginning: fade=t=in:st=0:d=DURATION
      filters.push(`fade=t=in:st=0:d=${effectiveDuration.toFixed(2)}`);
      break;
    }
    case "crossfade":
    case "visual_continuity": {
      // Smooth fade-in at beginning to prevent jarring cuts
      filters.push(`fade=t=in:st=0:d=${effectiveDuration.toFixed(2)}`);
      break;
    }
    default:
      break;
  }

  return filters;
}

export function createTransition(type: TransitionType = "none", duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration,
  };
}
