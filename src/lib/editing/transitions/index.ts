import { TransitionType, TransitionConfig } from "../types";

export type { TransitionType, TransitionConfig };

export function buildTransitionFilter(
  type: TransitionType,
  duration: number,
  clipDuration: number
): string {
  if (type === "fade_to_black") {
    const startTime = Math.max(0, clipDuration - duration);
    return `fade=t=out:st=${startTime.toFixed(2)}:d=${duration.toFixed(2)}`;
  }
  if (type === "fade_from_black") {
    return `fade=t=in:st=0:d=${duration.toFixed(2)}`;
  }
  return "";
}
