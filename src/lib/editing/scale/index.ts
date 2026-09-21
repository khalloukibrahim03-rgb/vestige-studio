export interface ScaleFilterResult {
  scaleFilter: string;
  padFilter: string;
}

/**
 * Generates progressive scaling and aspect ratio padding filter parameters.
 */
export function buildScaleAndPadFilter(
  targetWidth: number,
  targetHeight: number
): ScaleFilterResult {
  return {
    scaleFilter: `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease`,
    padFilter: `pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`,
  };
}
