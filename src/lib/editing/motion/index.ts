export type MotionType = "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";

export interface MotionConfig {
  type: MotionType;
  speed: number; // 0.1 to 1.0 (subtle to moderate)
}

/**
 * Builds modular FFmpeg zoompan filter for subtle, cinematic camera movement.
 * Real documentary movement must be restrained and not disorienting.
 */
export function buildMotionFilter(
  motionType?: MotionType,
  fps: number = 30,
  durationSec: number = 5,
  targetWidth: number = 1080,
  targetHeight: number = 1920
): string {
  if (!motionType || motionType === "none") return "";

  const totalFrames = Math.max(1, Math.round(fps * durationSec));

  switch (motionType) {
    case "push_in":
      // Subtle push-in: max zoom up to 1.06 over clip duration
      return `zoompan=z='min(zoom+0.0004,1.06)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
    case "pull_out":
      // Subtle pull-out: start at 1.06 and slowly recede to 1.00
      return `zoompan=z='max(1.06-0.0004*on,1.0)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
    case "pan_left":
      return `zoompan=z=1.04:x='min(x+0.5,iw-iw/zoom)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${targetWidth}x${targetHeight}`;
    case "pan_right":
      return `zoompan=z=1.04:x='max(x-0.5,0)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${targetWidth}x${targetHeight}`;
    default:
      return "";
  }
}
