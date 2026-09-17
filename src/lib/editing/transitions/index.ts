import { TransitionConfig, TransitionType } from "../types";

export function createTransition(type: TransitionType = "none", duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration: Math.max(0, duration),
  };
}

export function isHardCut(transition: TransitionConfig): boolean {
  return transition.type === "none" || transition.duration === 0;
}
