import { TransformConfig } from "../types";

export interface CropBounds {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Calculates 9:16 smart cropping parameters from source aspect to target vertical aspect
 * with center-of-interest safe zones.
 */
export function calculateSmartCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number = 1080,
  targetHeight: number = 1920,
  transform?: TransformConfig
): CropBounds {
  const targetAspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let cropW: number;
  let cropH: number;

  if (sourceAspect > targetAspect) {
    // Source is wider -> crop sides to reach 9:16
    cropH = sourceHeight;
    cropW = Math.round(sourceHeight * targetAspect);
  } else {
    // Source is taller -> crop top/bottom
    cropW = sourceWidth;
    cropH = Math.round(sourceWidth / targetAspect);
  }

  const posX = transform?.positionX ?? 0; // -1 (left) to +1 (right)
  const posY = transform?.positionY ?? 0; // -1 (top) to +1 (bottom)

  const maxOffsetX = (sourceWidth - cropW) / 2;
  const maxOffsetY = (sourceHeight - cropH) / 2;

  const x = Math.max(0, Math.round((sourceWidth - cropW) / 2 + posX * maxOffsetX));
  const y = Math.max(0, Math.round((sourceHeight - cropH) / 2 + posY * maxOffsetY));

  return { width: cropW, height: cropH, x, y };
}
