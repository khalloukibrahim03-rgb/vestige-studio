import { TransformConfig } from "../types";

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculates smart 9:16 vertical crop bounds from a 16:9 landscape source without stretching.
 */
export function calculateSmartCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): CropRegion {
  const targetAspect = targetWidth / targetHeight; // 1080/1920 = 0.5625

  let cropWidth = Math.round(sourceHeight * targetAspect);
  let cropHeight = sourceHeight;

  if (cropWidth > sourceWidth) {
    cropWidth = sourceWidth;
    cropHeight = Math.round(sourceWidth / targetAspect);
  }

  // Calculate default centered position
  let cropX = Math.round((sourceWidth - cropWidth) / 2);
  let cropY = Math.round((sourceHeight - cropHeight) / 2);

  // Apply position offset if specified (-1 to 1)
  if (transform?.positionX) {
    const maxShiftX = (sourceWidth - cropWidth) / 2;
    cropX = Math.round(cropX + transform.positionX * maxShiftX);
  }

  if (transform?.positionY) {
    const maxShiftY = (sourceHeight - cropHeight) / 2;
    cropY = Math.round(cropY + transform.positionY * maxShiftY);
  }

  // Ensure within source bounds
  cropX = Math.max(0, Math.min(sourceWidth - cropWidth, cropX));
  cropY = Math.max(0, Math.min(sourceHeight - cropHeight, cropY));

  return {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
  };
}
