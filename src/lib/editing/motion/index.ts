import { buildMotionFilter } from "../render/filter-generator";

export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number; // 0.1 (extremely subtle) to 1.0
  durationSec: number;
}

export function generateCameraMotionFilter(
  motion: MotionConfig,
  fps: number = 30
): string {
  return buildMotionFilter(motion.type, fps, motion.durationSec);
}
