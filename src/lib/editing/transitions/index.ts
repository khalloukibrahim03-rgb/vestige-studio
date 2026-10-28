import { TransitionConfig } from "../types";

export function createTransitionIn(type: TransitionConfig["type"], duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration,
  };
}

export function createTransitionOut(type: TransitionConfig["type"], duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration,
  };
}
