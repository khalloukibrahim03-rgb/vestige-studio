export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed?: number; // 0.1 to 1.0 (subtle)
}

/**
 * Builds subtle cinematic camera motion (Ken Burns push-in / pull-out / slow pan).
 * Maintains realistic documentary motion without fake jerky camera shake.
 */
export function buildMotionFilter(
  motionType: MotionType = "none",
  fps: number = 30,
  durationSec: number = 5,
  width: number = 1080,
  height: number = 1920
): string {
  if (!motionType || motionType === "none") return "";

  const totalFrames = Math.max(1, Math.round(fps * durationSec));

  if (motionType === "push_in") {
    // Subtle 4% zoom over the full duration
    return `zoompan=z='min(zoom+0.0004,1.05)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
  } else if (motionType === "pull_out") {
    return `zoompan=z='max(1.05-0.0004*on,1.0)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
  } else if (motionType === "pan_left") {
    return `zoompan=z='1.04':d=${totalFrames}:x='(1-on/${totalFrames})*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
  } else if (motionType === "pan_right") {
    return `zoompan=z='1.04':d=${totalFrames}:x='(on/${totalFrames})*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
  }

  return "";
}
