export interface ScaleOptions {
  targetWidth: number;
  targetHeight: number;
  maintainAspectRatio: boolean;
}

/**
 * Generates FFmpeg scale and padding filter string to maintain subject framing
 * without stretching or distorting source video.
 */
export function buildScaleFilterString(targetWidth: number, targetHeight: number): string {
  return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
}
