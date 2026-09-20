import { TransformConfig } from "../types";

/**
 * Smart 9:16 vertical video converter & crop filter builder.
 * Calculates center-of-interest positioning and safe margins.
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

  // Position offsets (-1 to 1)
  const posX = transform?.positionX ?? 0;
  const posY = transform?.positionY ?? 0;

  const maxOffsetX = (sourceWidth - cropW) / 2;
  const maxOffsetY = (sourceHeight - cropH) / 2;

  const x = Math.round((sourceWidth - cropW) / 2 + posX * maxOffsetX);
  const y = Math.round((sourceHeight - cropH) / 2 + posY * maxOffsetY);

  return `crop=${cropW}:${cropH}:${Math.max(0, x)}:${Math.max(0, y)}`;
}
