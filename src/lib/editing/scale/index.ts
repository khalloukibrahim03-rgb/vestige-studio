import { buildScaleFilter } from "../render/filter-generator";

export { buildScaleFilter };

export function calculateScaledResolution(
  sourceW: number,
  sourceH: number,
  targetW: number,
  targetH: number
): { width: number; height: number; scaleFactor: number } {
  const scaleX = targetW / sourceW;
  const scaleY = targetH / sourceH;
  const scaleFactor = Math.min(scaleX, scaleY);

  return {
    width: Math.round(sourceW * scaleFactor),
    height: Math.round(sourceH * scaleFactor),
    scaleFactor,
  };
}
