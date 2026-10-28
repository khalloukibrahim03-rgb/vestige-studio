/**
 * Modular camera motion builder (subtle Ken Burns push-in, pull-out, panning).
 */
export function buildMotionFilter(
  motionType?: "none" | "push_in" | "pull_out" | "pan_left" | "pan_right",
  fps: number = 30,
  durationSec: number = 5
): string {
  if (!motionType || motionType === "none") return "";

  const totalFrames = Math.round(fps * durationSec);
  if (motionType === "push_in") {
    return `zoompan=z='min(zoom+0.0005,1.08)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920`;
  } else if (motionType === "pull_out") {
    return `zoompan=z='max(1.08-0.0005*on,1.0)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920`;
  }

  return "";
}
