/**
 * Builds subtle camera motion transform filters (Ken Burns push-in / pull-out).
 */
export function buildMotionFilter(
  motionType?: "none" | "push_in" | "pull_out" | "pan_left" | "pan_right",
  fps: number = 30,
  durationSec: number = 5,
  targetWidth: number = 1080,
  targetHeight: number = 1920
): string {
  if (!motionType || motionType === "none") return "";

  const totalFrames = Math.round(fps * durationSec);
  if (motionType === "push_in") {
    return `zoompan=z='min(zoom+0.0005,1.08)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
  } else if (motionType === "pull_out") {
    return `zoompan=z='max(1.08-0.0005*on,1.0)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
  } else if (motionType === "pan_left") {
    return `zoompan=z='1.05':d=${totalFrames}:x='max(0,iw/2-(iw/zoom/2)-(on*0.5))':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
  } else if (motionType === "pan_right") {
    return `zoompan=z='1.05':d=${totalFrames}:x='min(iw-(iw/zoom),iw/2-(iw/zoom/2)+(on*0.5))':y='ih/2-(ih/zoom/2)':s=${targetWidth}x${targetHeight}`;
  }

  return "";
}
