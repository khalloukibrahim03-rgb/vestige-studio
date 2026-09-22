export * from "./types";
export * as crop from "./crop";
export * as scale from "./scale";
export * as motion from "./motion";
export * as cuts from "./cuts";
export * as transitions from "./transitions";
export * as timing from "./timing";
export * as audio from "./audio";
export * as color from "./color";
export * as presets from "./presets";
export * as timeline from "./timeline";
export * as render from "./render";

import { CinematicTimeline, ExportPreset } from "./types";
import { ModularRenderPipeline, ProgressCallback } from "./render/render-pipeline";
import { EXPORT_PRESETS } from "./presets/export-presets";

export { generateTimelineFromDirectorPlan } from "./timeline/timeline-builder";
export { ModularRenderPipeline } from "./render/render-pipeline";
export { CINEMATIC_COLOR_PRESETS, getColorPreset } from "./color/presets";
export { EXPORT_PRESETS } from "./presets/export-presets";

export async function renderCinematicTimeline(
  timeline: CinematicTimeline,
  exportPresetId: string = "SHORT_HIGH",
  onProgress?: ProgressCallback
): Promise<string> {
  const preset = EXPORT_PRESETS[exportPresetId] || EXPORT_PRESETS.SHORT_HIGH;
  const pipeline = new ModularRenderPipeline();
  return pipeline.render(timeline, preset, onProgress);
}
