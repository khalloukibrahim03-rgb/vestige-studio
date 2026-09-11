import { CinematicTimeline, ExportPreset } from "../types";
import { ProgressCallback } from "./render-pipeline";

export interface IRenderBackend {
  readonly id: string;
  readonly name: string;
  render(
    timeline: CinematicTimeline,
    preset: ExportPreset,
    onProgress?: ProgressCallback
  ): Promise<string>;
}
