import { TransitionConfig, TransitionType } from "../types";

export function createTransition(type: TransitionType, duration: number = 0.5): TransitionConfig {
  return {
    type,
    duration,
  };
}
