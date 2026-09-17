export interface RhythmConfig {
  pacing: "contemplative" | "standard" | "dynamic" | "fast";
  minDuration: number;
  maxDuration: number;
}

export const RHYTHM_PRESETS: Record<string, RhythmConfig> = {
  documentary_deep: { pacing: "contemplative", minDuration: 4.0, maxDuration: 8.0 },
  documentary_standard: { pacing: "standard", minDuration: 3.0, maxDuration: 6.0 },
  shorts_dynamic: { pacing: "dynamic", minDuration: 2.5, maxDuration: 5.5 },
  fast_paced: { pacing: "fast", minDuration: 1.5, maxDuration: 3.5 },
};

export function calculateShotDuration(
  narrativeRole: "establish" | "transition" | "climax" | "reflection",
  preset: RhythmConfig = RHYTHM_PRESETS.documentary_deep
): number {
  switch (narrativeRole) {
    case "establish":
      return Math.min(preset.maxDuration, 6.5);
    case "climax":
      return Math.max(preset.minDuration, 3.5);
    case "reflection":
      return preset.maxDuration;
    case "transition":
    default:
      return (preset.minDuration + preset.maxDuration) / 2;
  }
}
