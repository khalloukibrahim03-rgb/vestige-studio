/**
 * Builds controlled camera motion zoompan filter strings for FFmpeg.
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
    return `zoompan=z='1.05':x='if(eq(on,1),iw*0.1,max(iw*0.02,x-1))':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${targetWidth}x${targetHeight}`;
  } else if (motionType === "pan_right") {
    return `zoompan=z='1.05':x='if(eq(on,1),0,min(iw*0.1,x+1))':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${targetWidth}x${targetHeight}`;
  }

  return "";
}
