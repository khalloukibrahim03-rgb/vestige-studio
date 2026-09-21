export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number; // 0.1 to 1.0 (subtle)
}

export function createSubtleMotion(type: MotionType = "none", speed: number = 0.2): MotionConfig {
  return {
    type,
    speed: Math.min(1.0, Math.max(0.05, speed)),
  };
}
