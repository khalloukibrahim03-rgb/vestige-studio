import { TransformConfig } from "../types";

export interface SmartCropParameters {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  targetWidth: number;
  targetHeight: number;
  ffmpegCropFilterString: string;
}

/**
 * Calculates smart center-of-interest vertical 9:16 crop box from landscape source footage.
 */
export function calculateSmart916Crop(
  sourceWidth: number = 1920,
  sourceHeight: number = 1080,
  transform: TransformConfig = {}
): SmartCropParameters {
  const targetAspect = 9 / 16; // 0.5625
  const targetWidth = 1080;
  const targetHeight = 1920;

  // Compute crop box dimensions maintaining 9:16 aspect ratio in source space
  let cropW = sourceHeight * targetAspect; // 1080 * 0.5625 = 607.5 (~608)
  let cropH = sourceHeight;

  if (cropW > sourceWidth) {
    cropW = sourceWidth;
    cropH = sourceWidth / targetAspect;
  }

  // Ensure dimensions are even numbers for FFmpeg H.264 encoding compatibility
  cropW = Math.floor(cropW / 2) * 2;
  cropH = Math.floor(cropH / 2) * 2;

  // Position alignment (center with user/transform offset)
  const offsetX = transform.positionX ?? 0; // -1 to 1 offset
  const maxShiftX = (sourceWidth - cropW) / 2;
  const centerX = (sourceWidth - cropW) / 2 + offsetX * maxShiftX;
  const cropX = Math.max(0, Math.min(sourceWidth - cropW, Math.floor(centerX)));

  const offsetY = transform.positionY ?? 0;
  const maxShiftY = (sourceHeight - cropH) / 2;
  const centerY = (sourceHeight - cropH) / 2 + offsetY * maxShiftY;
  const cropY = Math.max(0, Math.min(sourceHeight - cropH, Math.floor(centerY)));

  const filterString = `crop=${cropW}:${cropH}:${cropX}:${cropY}`;

  return {
    cropX,
    cropY,
    cropWidth: cropW,
    cropHeight: cropH,
    targetWidth,
    targetHeight,
    ffmpegCropFilterString: filterString,
  };
}
