/**
 * High-quality scaling logic for standard and vertical conversion pipelines.
 */
export interface ScaleConfig {
  targetWidth: number;
  targetHeight: number;
  forceAspectRatio?: "decrease" | "increase" | "none";
}

export function buildScaleFilterString(config: ScaleConfig): string {
  const forceRatio = config.forceAspectRatio ?? "decrease";
  return `scale=${config.targetWidth}:${config.targetHeight}:force_original_aspect_ratio=${forceRatio},pad=${config.targetWidth}:${config.targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
}
