/**
 * Timing & dynamic pacing calculation utilities.
 */
export function calculateTimelineStartTimes(durations: number[]): number[] {
  const startTimes: number[] = [];
  let currentTime = 0;
  for (const d of durations) {
    startTimes.push(currentTime);
    currentTime += d;
  }
  return startTimes;
}

export function calculateTotalDuration(durations: number[]): number {
  return durations.reduce((acc, d) => acc + d, 0);
}
