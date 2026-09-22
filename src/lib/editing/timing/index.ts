export function calculateShotRhythm(
  baseDurationSec: number,
  shotPurpose: "scale" | "anticipation" | "discovery" | "tension" | "information" | "progression"
): number {
  switch (shotPurpose) {
    case "scale":
    case "anticipation":
      return Math.max(5.0, baseDurationSec * 1.2);
    case "discovery":
    case "tension":
      return Math.max(3.0, baseDurationSec * 0.85);
    case "information":
    case "progression":
      return Math.max(3.5, baseDurationSec);
    default:
      return baseDurationSec;
  }
}
