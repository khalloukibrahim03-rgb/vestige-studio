import { buildScaleFilter } from "../render/filter-generator";

export interface ScalingConfig {
  targetWidth: number;
  targetHeight: number;
  maintainAspectRatio: boolean;
  padColor: string;
}

export function createScalingFilter(
  targetWidth: number,
  targetHeight: number,
  padColor: string = "black"
): string {
  if (padColor === "black") {
    return buildScaleFilter(targetWidth, targetHeight);
  }
  return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:${padColor}`;
}
