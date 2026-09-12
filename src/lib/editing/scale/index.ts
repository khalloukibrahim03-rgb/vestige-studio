/**
 * Builds scale filter with padding to ensure aspect ratio compliance without stretching.
 */
export function buildScaleFilter(targetWidth: number, targetHeight: number): string {
  return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
}
