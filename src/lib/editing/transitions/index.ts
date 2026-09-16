import { TransitionConfig, TransitionType } from "../types";

export interface TransitionFilterOptions {
  type: TransitionType;
  duration: number;
}

/**
 * Builds transition filter representation or returns transition duration parameters.
 */
export function createTransitionConfig(
  type: TransitionType = "none",
  duration: number = 0.5
): TransitionConfig {
  return {
    type,
    duration,
  };
}
