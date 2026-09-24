/**
 * Subtle camera motion parameters (push-in, pull-out, slow pan).
 */
export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number; // 0.0 to 1.0 (subtle to active)
  duration: number; // seconds
}

export function calculateMotionScaleFactor(motion: MotionConfig, progress: number): number {
  if (motion.type === "none") return 1.0;

  const speed = Math.max(0.01, Math.min(1.0, motion.speed));
  const maxScaleDelta = 0.08 * speed; // Max 8% zoom for cinematic realism

  if (motion.type === "push_in") {
    return 1.0 + maxScaleDelta * progress;
  }
  if (motion.type === "pull_out") {
    return (1.0 + maxScaleDelta) - maxScaleDelta * progress;
  }

  return 1.0;
}
