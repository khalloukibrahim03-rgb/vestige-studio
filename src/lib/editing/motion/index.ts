export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number; // 0.1 to 1.0
}

/**
 * Generates subtle zoompan filter string for cinematic camera movements.
 */
export function buildMotionFilterString(
  motionType: MotionType = "none",
  fps: number = 30,
  durationSec: number = 5,
  targetWidth: number = 1080,
  targetHeight: number = 1920
): string {
  if (motionType === "none") return "";

  const totalFrames = Math.round(fps * durationSec);
  if (motionType === "push_in") {
    return `zoompan=z='min(zoom+0.0005,1.08)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
  } else if (motionType === "pull_out") {
    return `zoompan=z='max(1.08-0.0005*on,1.0)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
  }

  return "";
}
