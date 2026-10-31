import { TransformConfig } from "../types";

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SafeZone {
  topPercent: number; // e.g. 10% from top for UI headers
  bottomPercent: number; // e.g. 20% from bottom for captions & player controls
  leftPercent: number; // e.g. 5%
  rightPercent: number; // e.g. 5%
}

export const VERTICAL_SAFE_ZONE: SafeZone = {
  topPercent: 0.12, // Shorts header & sound tag safe
  bottomPercent: 0.18, // Shorts title, profile, like button safe
  leftPercent: 0.06,
  rightPercent: 0.12, // Right edge button cluster safe
};

/**
 * Calculates smart crop rectangle for landscape-to-vertical (or arbitrary) aspect ratio conversion.
 * Ensures center-of-interest is preserved and subject remains prominent.
 */
export function calculateCropRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): CropRect {
  const targetAspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let cropW: number;
  let cropH: number;

  if (sourceAspect > targetAspect) {
    // Source is wider than target (e.g. 16:9 -> 9:16) -> crop sides
    cropH = sourceHeight;
    cropW = Math.round(sourceHeight * targetAspect);
  } else {
    // Source is taller than target -> crop top/bottom
    cropW = sourceWidth;
    cropH = Math.round(sourceWidth / targetAspect);
  }

  // Position offsets: -1 (left/top) to +1 (right/bottom)
  const posX = transform?.positionX ?? 0;
  const posY = transform?.positionY ?? 0;

  const maxOffsetX = (sourceWidth - cropW) / 2;
  const maxOffsetY = (sourceHeight - cropH) / 2;

  const x = Math.max(0, Math.min(sourceWidth - cropW, Math.round((sourceWidth - cropW) / 2 + posX * maxOffsetX)));
  const y = Math.max(0, Math.min(sourceHeight - cropH, Math.round((sourceHeight - cropH) / 2 + posY * maxOffsetY)));

  return { x, y, width: cropW, height: cropH };
}

/**
 * Builds modular FFmpeg crop filter string.
 * Format: crop=w:h:x:y
 */
export function buildCropFilter(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): string {
  const rect = calculateCropRect(sourceWidth, sourceHeight, targetWidth, targetHeight, transform);
  return `crop=${rect.width}:${rect.height}:${rect.x}:${rect.y}`;
}
