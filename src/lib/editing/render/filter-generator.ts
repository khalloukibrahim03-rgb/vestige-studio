import { ColorConfig, TransformConfig } from "../types";

/**
 * Builds modular FFmpeg crop filter strings.
 * Converts landscape source (16:9) to vertical output (9:16) with safe center positioning.
 */
export function buildCropFilter(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): string {
  const targetAspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let cropW: number;
  let cropH: number;

  if (sourceAspect > targetAspect) {
    // Source is wider -> crop sides
    cropH = sourceHeight;
    cropW = Math.round(sourceHeight * targetAspect);
  } else {
    // Source is taller -> crop top/bottom
    cropW = sourceWidth;
    cropH = Math.round(sourceWidth / targetAspect);
  }

  // Position offsets
  const posX = transform?.positionX ?? 0; // -1 (left) to 1 (right)
  const posY = transform?.positionY ?? 0; // -1 (top) to 1 (bottom)

  const maxOffsetX = (sourceWidth - cropW) / 2;
  const maxOffsetY = (sourceHeight - cropH) / 2;

  const x = Math.round((sourceWidth - cropW) / 2 + posX * maxOffsetX);
  const y = Math.round((sourceHeight - cropH) / 2 + posY * maxOffsetY);

  // FFmpeg crop filter format: crop=w:h:x:y
  return `crop=${cropW}:${cropH}:${Math.max(0, x)}:${Math.max(0, y)}`;
}

/**
 * Builds scale filter.
 */
export function buildScaleFilter(targetWidth: number, targetHeight: number): string {
  return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
}

/**
 * Builds color filter using eq / colorbalance / vignette.
 */
export function buildColorFilter(color?: ColorConfig): string[] {
  const filters: string[] = [];
  if (!color) return filters;

  const contrast = color.contrast ?? 1.0;
  const brightness = color.exposure ?? 0.0;
  const saturation = color.saturation ?? 1.0;

  if (contrast !== 1.0 || brightness !== 0.0 || saturation !== 1.0) {
    filters.push(`eq=contrast=${contrast}:brightness=${brightness}:saturation=${saturation}`);
  }

  // Temperature color shift via colorbalance
  if (color.temperature && color.temperature !== 0) {
    const temp = color.temperature; // -1 (cool) to +1 (warm)
    if (temp < 0) {
      // Cool blue
      filters.push(`colorbalance=rs=${temp * 0.15}:gs=0:bs=${Math.abs(temp) * 0.2}`);
    } else {
      // Warm orange
      filters.push(`colorbalance=rs=${temp * 0.2}:gs=${temp * 0.1}:bs=-${temp * 0.15}`);
    }
  }

  if (color.vignette && color.vignette > 0) {
    const angle = (color.vignette * Math.PI) / 4;
    filters.push(`vignette=angle=${angle.toFixed(2)}`);
  }

  return filters;
}

/**
 * Builds subtle motion transform filter (Ken Burns push-in / pull-out).
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
