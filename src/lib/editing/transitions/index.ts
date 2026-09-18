import { TransitionType, TransitionConfig } from "../types";

export interface TransitionFilterOptions {
  type: TransitionType;
  duration: number;
  offsetSeconds: number;
}

export function validateTransitionConfig(config: TransitionConfig, sceneDuration: number): TransitionConfig {
  const maxDuration = Math.min(config.duration, sceneDuration * 0.4);
  return {
    type: config.type,
    duration: Math.max(0, maxDuration),
  };
}

export function getTransitionFFmpegFilterName(type: TransitionType): string {
  switch (type) {
    case "crossfade":
      return "fade";
    case "fade_to_black":
    case "dip_to_black":
      return "fade=t=out";
    case "visual_continuity":
      return "fade=t=in";
    case "none":
    default:
      return "";
  }
}
