/**
 * Builds high-quality scale and aspect-ratio preservation filter with letterbox/pillarbox padding.
 */
export function buildScaleFilter(targetWidth: number, targetHeight: number): string {
  return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
}

/**
 * Enforces standardized pixel aspect ratio (SAR 1/1) and color format for concatenation compatibility.
 */
export function buildStandardizationFilter(fps: number = 30): string {
  return `setsar=1,fps=${fps},format=yuv420p`;
}
