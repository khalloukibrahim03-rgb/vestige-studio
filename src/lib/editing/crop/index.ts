import { TransformConfig } from "../types";
import { buildCropFilter } from "../render/filter-generator";

export interface SafeZoneBounds {
  topPercent: number;
  bottomPercent: number;
  leftPercent: number;
  rightPercent: number;
}

export const SHORTS_SAFE_ZONE: SafeZoneBounds = {
  topPercent: 15, // Reserve top 15% for UI headers/controls
  bottomPercent: 20, // Reserve bottom 20% for caption overlays & title badges
  leftPercent: 5,
  rightPercent: 5,
};

export function calculateSmartCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
): { cropFilter: string; cropWidth: number; cropHeight: number; offsetX: number; offsetY: number } {
  const targetAspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let cropW: number;
  let cropH: number;

  if (sourceAspect > targetAspect) {
    cropH = sourceHeight;
    cropW = Math.round(sourceHeight * targetAspect);
  } else {
    cropW = sourceWidth;
    cropH = Math.round(sourceWidth / targetAspect);
  }

  const posX = transform?.positionX ?? 0;
  const posY = transform?.positionY ?? 0;

  const maxOffsetX = (sourceWidth - cropW) / 2;
  const maxOffsetY = (sourceHeight - cropH) / 2;

  const x = Math.max(0, Math.round((sourceWidth - cropW) / 2 + posX * maxOffsetX));
  const y = Math.max(0, Math.round((sourceHeight - cropH) / 2 + posY * maxOffsetY));

  const filter = buildCropFilter(sourceWidth, sourceHeight, targetWidth, targetHeight, transform);

  return {
    cropFilter: filter,
    cropWidth: cropW,
    cropHeight: cropH,
    offsetX: x,
    offsetY: y,
  };
}
