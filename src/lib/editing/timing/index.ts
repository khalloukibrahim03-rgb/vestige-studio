/**
 * Dynamic pacing helpers to calculate dynamic shot durations based on narrative intent.
 */
export function calculateDynamicShotDuration(
  purpose: string,
  shotType: string,
  baseDuration?: number
): number {
  if (baseDuration && baseDuration > 0) return baseDuration;

  // Atmosphere / scale shots require longer durations (5.5s - 7.5s)
  if (shotType === "extreme_wide" || shotType === "environmental") {
    return 6.5;
  }

  // Information / discovery shots are punchier (3.5s - 4.5s)
  if (shotType === "macro_detail" || shotType === "close_up") {
    return 4.2;
  }

  return 5.0;
}
