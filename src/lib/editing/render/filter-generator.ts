import { ColorConfig, TransformConfig, TransitionConfig } from "../types";
import { buildCropFilter } from "../crop/crop";
import { buildScaleFilter, buildStandardizationFilter } from "../scale/scale";
import { buildColorFilter } from "../color/color";
import { buildMotionFilter } from "../motion/motion";
import { buildFadeFilters } from "../transitions/transitions";

export {
  buildCropFilter,
  buildScaleFilter,
  buildStandardizationFilter,
  buildColorFilter,
  buildMotionFilter,
  buildFadeFilters,
};

/**
 * Builds the complete modular video stream filter chain for an individual clip:
 * Trim -> Crop -> Scale -> Motion -> Transitions -> Color -> Standardization (setsar=1,fps,format=yuv420p)
 */
export function buildClipFilterChain(
  inputIndex: number,
  clip: {
    startInSource: number;
    duration: number;
    transform?: TransformConfig;
    color?: ColorConfig;
    transitionIn?: TransitionConfig;
    transitionOut?: TransitionConfig;
    motion?: { type: "none" | "push_in" | "pull_out" | "pan_left" | "pan_right"; speed: number };
  },
  preset: { width: number; height: number; fps: number },
  outputLabel: string
): string {
  const trimFilter = `[${inputIndex}:v]trim=start=${clip.startInSource}:duration=${clip.duration},setpts=PTS-STARTPTS`;
  const cropFilter = buildCropFilter(1920, 1080, preset.width, preset.height, clip.transform);
  const scaleFilter = buildScaleFilter(preset.width, preset.height);

  const filterSteps: string[] = [trimFilter, cropFilter, scaleFilter];

  // Optional motion
  if (clip.motion && clip.motion.type !== "none") {
    const motionFilter = buildMotionFilter(clip.motion.type, preset.fps, clip.duration, preset.width, preset.height);
    if (motionFilter) {
      filterSteps.push(motionFilter);
    }
  }

  // Fade transitions (fade to black / dip to black)
  const fadeFilters = buildFadeFilters(clip.duration, clip.transitionIn, clip.transitionOut);
  if (fadeFilters.length > 0) {
    filterSteps.push(...fadeFilters);
  }

  // Color grading
  const colorFilters = buildColorFilter(clip.color);
  if (colorFilters.length > 0) {
    filterSteps.push(...colorFilters);
  }

  // Standardization (setsar=1,fps,yuv420p) to ensure concat filter never fails across different sources
  filterSteps.push(buildStandardizationFilter(preset.fps));

  return `${filterSteps.join(",")}[${outputLabel}]`;
}
