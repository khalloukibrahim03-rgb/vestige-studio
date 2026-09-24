import { TransitionConfig } from "../types";

/**
 * Transitions helper utilities.
 */
export function isStandardCut(transition: TransitionConfig): boolean {
  return transition.type === "none" || transition.duration <= 0;
}

export function formatTransitionSummary(transition: TransitionConfig): string {
  if (isStandardCut(transition)) return "Hard Cut";
  return `${transition.type.replace(/_/g, " ")} (${transition.duration}s)`;
}
