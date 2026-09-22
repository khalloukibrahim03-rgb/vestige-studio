import { TransformConfig } from "../types";
import { buildCropFilter } from "../render/filter-generator";

export function calculateSmartCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  transform?: TransformConfig
) {
  return buildCropFilter(sourceWidth, sourceHeight, targetWidth, targetHeight, transform);
}

export * from "../types";
