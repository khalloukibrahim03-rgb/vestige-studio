/**
 * Shot timing & editorial rhythm engine.
 * Dynamic shot duration calculations based on narrative intent, scale, and emotional weight.
 */

export interface TimingPacingConfig {
  shotType: string; // e.g. 'extreme_wide', 'close_up', 'macro'
  purpose: string;   // e.g. 'scale', 'tension', 'discovery'
  baseDuration?: number;
}

export function calculateDynamicShotDuration(config: TimingPacingConfig): number {
  if (config.baseDuration && config.baseDuration > 0) {
    return config.baseDuration;
  }

  // Atmospheric / Scale shots receive longer screen presence
  if (config.shotType === "extreme_wide" || config.shotType === "aerial" || config.purpose.includes("scale")) {
    return 6.5;
  }

  // Tension or discovery shots are shorter & sharper
  if (config.shotType === "close_up" || config.shotType === "macro" || config.purpose.includes("tension")) {
    return 4.2;
  }

  // Standard narrative progression shot duration
  return 5.4;
}
