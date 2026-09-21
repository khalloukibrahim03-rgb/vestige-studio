import { TransitionConfig, TransitionType } from "../types";

export interface TransitionDescriptor {
  type: TransitionType;
  duration: number;
}

export function createTransition(type: TransitionType, duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration: Math.max(0, duration),
  };
}

export function isContinuousCut(type: TransitionType): boolean {
  return type === "none" || type === "visual_continuity";
}
