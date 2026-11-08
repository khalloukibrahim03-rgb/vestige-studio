import { TransformConfig } from "../types";

export interface CropCalculation {
  width: number;
  height: number;
  x: number;
  y: number;
  filterString: string;
}

/**
 * Calculates smart 9:16 vertical crop parameters from a source aspect ratio.
 * Ensures center-of-interest safe zones without stretching.
 */
export function calculateSmartCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): CropCalculation {
  const targetAspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let cropW: number;
  let cropH: number;

  if (sourceAspect > targetAspect) {
    // Source is wider than target (e.g. 16:9 into 9:16) -> crop horizontally
    cropH = sourceHeight;
    cropW = Math.round(sourceHeight * targetAspect);
  } else {
    // Source is taller than target -> crop vertically
    cropW = sourceWidth;
    cropH = Math.round(sourceWidth / targetAspect);
  }

  // Position offsets (-1 to +1)
  const posX = transform?.positionX ?? 0;
  const posY = transform?.positionY ?? 0;

  const maxOffsetX = (sourceWidth - cropW) / 2;
  const maxOffsetY = (sourceHeight - cropH) / 2;

  // Ensure crop remains strictly within bounds
  const rawX = Math.round((sourceWidth - cropW) / 2 + posX * maxOffsetX);
  const rawY = Math.round((sourceHeight - cropH) / 2 + posY * maxOffsetY);

  const x = Math.max(0, Math.min(sourceWidth - cropW, rawX));
  const y = Math.max(0, Math.min(sourceHeight - cropH, rawY));

  return {
    width: cropW,
    height: cropH,
    x,
    y,
    filterString: `crop=${cropW}:${cropH}:${x}:${y}`,
  };
}

/**
 * Builds FFmpeg crop filter string.
 */
export function buildCropFilter(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): string {
  return calculateSmartCrop(sourceWidth, sourceHeight, targetWidth, targetHeight, transform).filterString;
}
