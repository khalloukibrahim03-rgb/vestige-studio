import { ColorConfig } from "../types";
export * from "./presets";

/**
 * Builds modular FFmpeg color grading filter chain.
 */
export function buildColorFilter(color?: ColorConfig): string[] {
  const filters: string[] = [];
  if (!color) return filters;

  const contrast = color.contrast ?? 1.0;
  const brightness = color.exposure ?? 0.0;
  const saturation = color.saturation ?? 1.0;

  if (contrast !== 1.0 || brightness !== 0.0 || saturation !== 1.0) {
    filters.push(`eq=contrast=${contrast}:brightness=${brightness}:saturation=${saturation}`);
  }

  // Temperature color shift via colorbalance
  if (color.temperature && color.temperature !== 0) {
    const temp = color.temperature; // -1 (cool) to +1 (warm)
    if (temp < 0) {
      // Cool blue
      filters.push(`colorbalance=rs=${(temp * 0.15).toFixed(3)}:gs=0:bs=${(Math.abs(temp) * 0.2).toFixed(3)}`);
    } else {
      // Warm orange
      filters.push(`colorbalance=rs=${(temp * 0.2).toFixed(3)}:gs=${(temp * 0.1).toFixed(3)}:bs=${(-temp * 0.15).toFixed(3)}`);
    }
  }

  if (color.vignette && color.vignette > 0) {
    const angle = (color.vignette * Math.PI) / 4;
    filters.push(`vignette=angle=${angle.toFixed(2)}`);
  }

  return filters;
}
