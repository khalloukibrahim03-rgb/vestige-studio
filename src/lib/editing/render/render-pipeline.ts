import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";
import { CinematicTimeline, ExportPreset, AudioClipItem } from "../types";
import { buildCropFilter, buildScaleFilter, buildColorFilter } from "./filter-generator";
import { getFFmpegPath, getFFmpegDiagnostics } from "./ffmpeg-resolver";
import { IRenderBackend } from "./backend";

export interface RenderProgress {
  stage: "downloading_assets" | "building_filtergraph" | "rendering" | "completed" | "failed";
  percent: number;
  message: string;
  outputPath?: string;
  error?: string;
  diagnostics?: ReturnType<typeof getFFmpegDiagnostics>;
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

    // 1. Ensure all video and audio assets are saved locally
    const preparedVideoClips = await Promise.all(
      timeline.videoTrack.clips.map(async (clip, idx) => {
        const localPath = await this.ensureLocalAsset(clip.sourceUrl, `video_${idx}_${clip.id}.mp4`);
        return { ...clip, localFilePath: localPath };
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

      // Inputs array
      const videoInputs: string[] = [];
      preparedVideoClips.forEach((clip) => {
        command.input(clip.localFilePath!);
        videoInputs.push(clip.localFilePath!);
      });

      // Collect audio inputs
      const audioInputs: { path: string; track: string; clipIndex: number; clip: AudioClipItem }[] = [];
      preparedAudioTracks.forEach((track) => {
        track.clips.forEach((clip, idx) => {
          command.input(clip.localFilePath!);
          audioInputs.push({ path: clip.localFilePath!, track: track.id, clipIndex: idx, clip });
        });
      });

      const complexFilter: string[] = [];

      // Video processing pipeline
      // Process each video clip: trim -> crop -> scale -> color -> pts
      preparedVideoClips.forEach((clip, i) => {
        const trimFilter = `[${i}:v]trim=start=${clip.startInSource}:duration=${clip.duration},setpts=PTS-STARTPTS`;
        const crop = buildCropFilter(1920, 1080, preset.width, preset.height, clip.transform);
        const scale = buildScaleFilter(preset.width, preset.height);
        const colorFilters = buildColorFilter(clip.color);

        let chain = `${trimFilter},${crop},${scale}`;
        if (colorFilters.length > 0) {
          chain += `,${colorFilters.join(",")}`;
        }

        complexFilter.push(`${chain}[v${i}]`);
      });

      // Concatenate video clips sequentially
      const concatVideoInputs = preparedVideoClips.map((_, i) => `[v${i}]`).join("");
      complexFilter.push(`${concatVideoInputs}concat=n=${preparedVideoClips.length}:v=1:a=0[v_concat]`);

      // Audio processing & mixing
      if (audioInputs.length > 0) {
        audioInputs.forEach((item, idx) => {
          const inputIdx = preparedVideoClips.length + idx;
          const delayMs = Math.round(Math.max(0, item.clip.timelineStart) * 1000);
          const volume = item.clip.volume ?? 0.8;
          complexFilter.push(`[${inputIdx}:a]atrim=0:${item.clip.duration},asetpts=PTS-STARTPTS,volume=${volume},adelay=${delayMs}|${delayMs}[a${idx}]`);
        });

        const concatAudioInputs = audioInputs.map((_, idx) => `[a${idx}]`).join("");
        complexFilter.push(`${concatAudioInputs}amix=inputs=${audioInputs.length}:duration=first:dropout_transition=2[a_mixed]`);
      } else {
        // Fallback quiet audio if no track provided
        complexFilter.push(`anullsrc=channel_layout=stereo:sample_rate=48000[a_mixed]`);
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
          `-shortest`
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
