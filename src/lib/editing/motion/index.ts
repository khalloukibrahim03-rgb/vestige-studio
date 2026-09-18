export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number; // 0.1 (subtle) to 1.0
  description: string;
}

export const CAMERA_MOTION_PRESETS: Record<MotionType, MotionConfig> = {
  none: {
    type: "none",
    speed: 0,
    description: "Locked static shot for stability and realism.",
  },
  push_in: {
    type: "push_in",
    speed: 0.15,
    description: "Subtle slow push-in towards subject to heighten intimacy or tension.",
  },
  pull_out: {
    type: "pull_out",
    speed: 0.15,
    description: "Subtle slow pull-out to reveal environment and scale.",
  },
  pan_left: {
    type: "pan_left",
    speed: 0.2,
    description: "Slow lateral pan left following natural environmental flow.",
  },
  pan_right: {
    type: "pan_right",
    speed: 0.2,
    description: "Slow lateral pan right following natural environmental flow.",
  },
};

export function getMotionConfig(motionType?: string): MotionConfig {
  if (!motionType) return CAMERA_MOTION_PRESETS.none;
  const normalized = motionType.toLowerCase().replace(/[\s-]+/g, "_") as MotionType;
  return CAMERA_MOTION_PRESETS[normalized] || CAMERA_MOTION_PRESETS.none;
}
