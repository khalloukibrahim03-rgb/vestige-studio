import { TransformConfig } from "../types";

/**
 * Builds modular FFmpeg crop filter strings.
 * Converts landscape source (16:9) to vertical output (9:16) with safe center subject positioning.
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
