export type ScaleMode = "fit" | "fill" | "pad";

export interface ScaleOptions {
  targetWidth: number;
  targetHeight: number;
  mode?: ScaleMode;
}

/**
 * Builds modular FFmpeg scale filter string.
 * Enforces correct aspect ratio and prevents distorting/stretching video.
 */
export function buildScaleFilter(targetWidth: number, targetHeight: number, mode: ScaleMode = "pad"): string {
  if (mode === "pad") {
    return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
  }
  if (mode === "fill") {
    return `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=increase,crop=${targetWidth}:${targetHeight}`;
  }
  return `scale=${targetWidth}:${targetHeight}`;
}
