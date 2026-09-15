import { TransitionConfig, TransitionType } from "../types";

export function createTransitionConfig(type: TransitionType = "none", duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration,
  };
}
