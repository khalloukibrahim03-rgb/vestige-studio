import { buildCropFilter } from "../render/filter-generator";
import { TransformConfig } from "../types";

export { buildCropFilter };

export function calculateSmartCropParams(
  sourceW: number,
  sourceH: number,
  targetAspect: number = 9 / 16,
  transform?: TransformConfig
): { cropWidth: number; cropHeight: number; x: number; y: number } {
  const sourceAspect = sourceW / sourceH;
  let cropW: number;
  let cropH: number;

  if (sourceAspect > targetAspect) {
    cropH = sourceH;
    cropW = Math.round(sourceH * targetAspect);
  } else {
    cropW = sourceW;
    cropH = Math.round(sourceW / targetAspect);
  }

  const posX = transform?.positionX ?? 0;
  const posY = transform?.positionY ?? 0;

  const maxOffsetX = (sourceW - cropW) / 2;
  const maxOffsetY = (sourceH - cropH) / 2;

  const x = Math.max(0, Math.round((sourceW - cropW) / 2 + posX * maxOffsetX));
  const y = Math.max(0, Math.round((sourceH - cropH) / 2 + posY * maxOffsetY));

  return { cropWidth: cropW, cropHeight: cropH, x, y };
}
