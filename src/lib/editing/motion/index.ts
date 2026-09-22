import { buildMotionFilter } from "../render/filter-generator";

export function generateMotionTransform(
  motionType?: "none" | "push_in" | "pull_out" | "pan_left" | "pan_right",
  fps: number = 30,
  durationSec: number = 5
) {
  return buildMotionFilter(motionType, fps, durationSec);
}
