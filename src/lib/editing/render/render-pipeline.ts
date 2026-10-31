import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";
import { CinematicTimeline, ExportPreset, VideoClipItem } from "../types";
import { buildCropFilter } from "../crop";
import { buildScaleFilter } from "../scale";
import { buildColorFilter } from "../color";
import { buildMotionFilter } from "../motion";
import { buildTransitionFilter } from "../transitions";
import { getFFmpegPath, getFFmpegDiagnostics } from "./ffmpeg-resolver";
import { IRenderBackend } from "./backend";

export interface RenderProgress {
  stage: "downloading_assets" | "building_filtergraph" | "rendering" | "completed" | "failed";
  percent: number;
  message: string;
  outputPath?: string;
  error?: string;
  diagnostics?: any;
}

export type ProgressCallback = (progress: RenderProgress) => void;

export class ModularRenderPipeline implements IRenderBackend {
  readonly id = "local_ffmpeg";
  readonly name = "Local FFmpeg Engine (Vercel Serverless Ready)";

  private cacheDir: string;
  private outputDir: string;

  constructor(cacheDir: string = "/tmp/vestige_cache", outputDir: string = "/tmp/vestige_output") {
    this.cacheDir = cacheDir;
    this.outputDir = outputDir;

    // Dynamically configure fluent-ffmpeg with static/resolved FFmpeg path
    const ffmpegPath = getFFmpegPath();
    ffmpeg.setFfmpegPath(ffmpegPath);
  }

  async render(
    timeline: CinematicTimeline,
    preset: ExportPreset,
    onProgress?: ProgressCallback
  ): Promise<string> {
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.mkdir(this.outputDir, { recursive: true });

    const diagnostics = getFFmpegDiagnostics();
    console.log("[RENDER DIAGNOSTICS]", JSON.stringify(diagnostics, null, 2));

    const report = (
      stage: RenderProgress["stage"],
      percent: number,
      message: string,
      outputPath?: string
    ) => {
      console.log(`[RENDER] [${percent}%] ${stage}: ${message}`);
      if (onProgress) onProgress({ stage, percent, message, outputPath, diagnostics });
    };

    if (!diagnostics.ffmpegDetected) {
      const errMessage = `FFmpeg executable not found or unexecutable at path: ${diagnostics.executablePath}`;
      report("failed", 0, errMessage);
      throw new Error(errMessage);
    }

    report("downloading_assets", 10, `Caching media and sound assets locally... (FFmpeg ${diagnostics.version?.slice(0, 30)})`);

    // 1. Ensure all video and audio assets are saved locally (except virtual generators like "black")
    const preparedVideoClips: (VideoClipItem & { isGenerator?: boolean })[] = await Promise.all(
      timeline.videoTrack.clips.map(async (clip, idx) => {
        if (clip.sourceUrl === "black" || clip.sourceUrl.startsWith("color:")) {
          return { ...clip, isGenerator: true, localFilePath: undefined };
        }
        const localPath = await this.ensureLocalAsset(clip.sourceUrl, `video_${idx}_${clip.id}.mp4`);
        return { ...clip, isGenerator: false, localFilePath: localPath };
      })
    );

    const preparedAudioTracks = await Promise.all(
      timeline.audioTracks.map(async (track) => {
        const preparedClips = await Promise.all(
          track.clips.map(async (clip, idx) => {
            const localPath = await this.ensureLocalAsset(clip.sourceUrl, `audio_${track.id}_${idx}.mp3`);
            return { ...clip, localFilePath: localPath };
          })
        );
        return { ...track, clips: preparedClips };
      })
    );

    report("building_filtergraph", 30, "Constructing FFmpeg complex filtergraph...");

    const timestamp = Date.now();
    const outputFilename = `vestige_render_${timeline.id}_${timestamp}.mp4`;
    const outputPath = path.join(this.outputDir, outputFilename);

    // 2. Build FFmpeg command using filtergraph
    return new Promise((resolve, reject) => {
      const command = ffmpeg();

      // Register file inputs and track their index
      const inputIndices = new Map<string, number>();
      let nextInputIndex = 0;

      preparedVideoClips.forEach((clip) => {
        if (!clip.isGenerator && clip.localFilePath) {
          command.input(clip.localFilePath);
          inputIndices.set(clip.id, nextInputIndex++);
        }
      });

      // Collect audio inputs
      const audioInputs: { path: string; track: string; clipIndex: number; clip: any; inputIdx: number }[] = [];
      preparedAudioTracks.forEach((track) => {
        if (track.muted) return;
        track.clips.forEach((clip, idx) => {
          command.input(clip.localFilePath!);
          const inputIdx = nextInputIndex++;
          audioInputs.push({ path: clip.localFilePath!, track: track.id, clipIndex: idx, clip, inputIdx });
        });
      });

      const complexFilter: string[] = [];

      // Video processing pipeline
      preparedVideoClips.forEach((clip, i) => {
        if (clip.isGenerator) {
          // Pure black slug generated directly via FFmpeg color source with identical SAR, fps, and format
          complexFilter.push(
            `color=c=black:s=${preset.width}x${preset.height}:r=${preset.fps}:d=${clip.duration},setsar=1,format=yuv420p[v${i}]`
          );
        } else {
          const inputIdx = inputIndices.get(clip.id)!;
          const trimFilter = `[${inputIdx}:v]trim=start=${clip.startInSource}:duration=${clip.duration},setpts=PTS-STARTPTS`;
          const crop = buildCropFilter(1920, 1080, preset.width, preset.height, clip.transform);
          const scale = buildScaleFilter(preset.width, preset.height);
          const colorFilters = buildColorFilter(clip.color);
          const transitionFilters = buildTransitionFilter({
            type: clip.transitionIn.type,
            duration: clip.transitionIn.duration,
            clipDuration: clip.duration,
          });

          const filterElements = [trimFilter, crop, scale];
          if (colorFilters.length > 0) {
            filterElements.push(...colorFilters);
          }
          if (clip.motion && clip.motion.type !== "none") {
            const motionFilter = buildMotionFilter(clip.motion.type, preset.fps, clip.duration, preset.width, preset.height);
            if (motionFilter) filterElements.push(motionFilter);
          }
          if (transitionFilters.length > 0) {
            filterElements.push(...transitionFilters);
          }

          // Enforce square pixel aspect ratio, constant frame rate, and pixel format for seamless concat
          filterElements.push(`setsar=1`, `fps=${preset.fps}`, `format=yuv420p`);

          complexFilter.push(`${filterElements.join(",")}[v${i}]`);
        }
      });

      // Concatenate video clips sequentially
      const concatVideoInputs = preparedVideoClips.map((_, i) => `[v${i}]`).join("");
      complexFilter.push(`${concatVideoInputs}concat=n=${preparedVideoClips.length}:v=1:a=0[v_concat]`);

      // Audio processing & mixing with full duration preservation
      const totalDur = timeline.totalDuration.toFixed(2);
      if (audioInputs.length > 0) {
        audioInputs.forEach((item, idx) => {
          const delayMs = Math.round(Math.max(0, item.clip.timelineStart) * 1000);
          const volume = item.clip.volume ?? 0.8;
          const fadeIn = item.clip.fadeInDuration || 0.3;
          const fadeOut = item.clip.fadeOutDuration || 0.4;
          const fadeOutStart = Math.max(0, item.clip.duration - fadeOut).toFixed(2);

          complexFilter.push(
            `[${item.inputIdx}:a]atrim=0:${item.clip.duration.toFixed(2)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${fadeIn},afade=t=out:st=${fadeOutStart}:d=${fadeOut},volume=${volume},adelay=${delayMs}|${delayMs}[a${idx}]`
          );
        });

        // Add silent base pad matching total timeline duration to ensure amix never truncates early
        complexFilter.push(`aevalsrc=0:d=${totalDur}:s=48000[a_base]`);

        const allAudioInputs = `[a_base]` + audioInputs.map((_, idx) => `[a${idx}]`).join("");
        complexFilter.push(
          `${allAudioInputs}amix=inputs=${audioInputs.length + 1}:duration=longest:dropout_transition=2,atrim=0:${totalDur},asetpts=PTS-STARTPTS[a_mixed]`
        );
      } else {
        // Fallback quiet audio if no audio clips
        complexFilter.push(`aevalsrc=0:d=${totalDur}:s=48000[a_mixed]`);
      }

      command
        .complexFilter(complexFilter)
        .map("[v_concat]")
        .map("[a_mixed]")
        .outputOptions([
          `-c:v ${preset.codecVideo}`,
          `-preset fast`,
          `-crf 20`,
          `-b:v ${preset.videoBitrate}`,
          `-pix_fmt yuv420p`,
          `-r ${preset.fps}`,
          `-c:a ${preset.codecAudio}`,
          `-b:a ${preset.audioBitrate}`,
          `-ar 48000`,
          `-t ${totalDur}`
        ])
        .output(outputPath)
        .on("start", (cmd) => {
          console.log("FFmpeg command generated:", cmd);
          report("rendering", 40, "FFmpeg render process started...");
        })
        .on("progress", (p) => {
          const percent = Math.min(95, Math.max(40, Math.round(p.percent || 50)));
          report("rendering", percent, `Rendering frame: ${p.frames || 0}`);
        })
        .on("end", () => {
          report("completed", 100, "Render completed successfully!", outputPath);
          resolve(outputPath);
        })
        .on("error", (err, stdout, stderr) => {
          console.error("FFmpeg render error:", err);
          console.error("FFmpeg stderr:", stderr);
          report("failed", 0, `Render error: ${err.message}`);
          reject(err);
        });

      command.run();
    });
  }

  private async ensureLocalAsset(url: string, filename: string): Promise<string> {
    const localPath = path.join(this.cacheDir, filename);

    try {
      const stat = await fs.stat(localPath);
      if (stat.size > 0) {
        return localPath;
      }
    } catch {
      // Not cached
    }

    if (url.startsWith("http://localhost:3000") || url.startsWith("/")) {
      const relativePath = url.replace("http://localhost:3000", "");
      const fullLocalPath = path.join(process.cwd(), "public", relativePath.replace("/samples/", "samples/"));
      try {
        await fs.copyFile(fullLocalPath, localPath);
        return localPath;
      } catch (err) {
        console.warn(`Local file copy failed from ${fullLocalPath}, falling back to fetch:`, err);
      }
    }

    console.log(`Downloading asset: ${url} -> ${localPath}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch media asset from ${url}: ${res.statusText}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(localPath, buffer);
    return localPath;
  }
}
