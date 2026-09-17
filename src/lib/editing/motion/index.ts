import { buildMotionFilter } from "../render/filter-generator";

export { buildMotionFilter };

export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number;
}

export function createMotionConfig(type: MotionType = "none", speed: number = 1.0): MotionConfig {
  return { type, speed };
}
