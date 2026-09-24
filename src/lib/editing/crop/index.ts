import { TransformConfig } from "../types";

export interface SmartCropParams {
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  transform: TransformConfig;
}

/**
 * Calculates subject-aware center-of-interest cropping dimensions for vertical 9:16 target aspect ratios.
 */
export function calculateSmartCrop({
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
  transform,
}: SmartCropParams) {
  const targetAspect = targetWidth / targetHeight;
  let cropW = sourceWidth;
  let cropH = sourceHeight;

  if (sourceWidth / sourceHeight > targetAspect) {
    cropW = Math.round(sourceHeight * targetAspect);
  } else {
    cropH = Math.round(sourceWidth / targetAspect);
  }

  const offsetX = transform.cropX !== undefined
    ? Math.round(transform.cropX * (sourceWidth - cropW))
    : Math.round((sourceWidth - cropW) / 2);

  const offsetY = transform.cropY !== undefined
    ? Math.round(transform.cropY * (sourceHeight - cropH))
    : Math.round((sourceHeight - cropH) / 2);

  return {
    cropW,
    cropH,
    offsetX: Math.max(0, Math.min(sourceWidth - cropW, offsetX)),
    offsetY: Math.max(0, Math.min(sourceHeight - cropH, offsetY)),
  };
}
