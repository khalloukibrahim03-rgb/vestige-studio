export interface ScaleParameters {
  targetWidth: number;
  targetHeight: number;
  ffmpegScaleFilterString: string;
}

/**
 * Builds high-quality FFmpeg scale and pad filter string to convert footage to exact target dimensions.
 */
export function buildScaleAndPadFilter(targetWidth: number, targetHeight: number): ScaleParameters {
  // Scales footage down/up while preserving aspect ratio and pads remaining space with black
  const filterString = `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;

  return {
    targetWidth,
    targetHeight,
    ffmpegScaleFilterString: filterString,
  };
}
