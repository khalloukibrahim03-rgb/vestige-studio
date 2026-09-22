import { buildScaleFilter } from "../render/filter-generator";

export function calculateScale(targetWidth: number, targetHeight: number) {
  return buildScaleFilter(targetWidth, targetHeight);
}
