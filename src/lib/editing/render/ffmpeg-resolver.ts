import ffmpegStatic from "ffmpeg-static";
import { execSync } from "child_process";
import fs from "fs";

export interface FFmpegDiagnostics {
  ffmpegDetected: boolean;
  executablePath: string | null;
  version: string | null;
  isStaticBundle: boolean;
  environment: string;
}

/**
 * Dynamically resolves the FFmpeg executable path.
 * Strategy order:
 * 1. Process environment override (FFMPEG_PATH)
 * 2. Static bundled binary via `ffmpeg-static` (works seamlessly in Vercel Serverless / Node runtimes)
 * 3. Fallback to node_modules/ffmpeg-static/ffmpeg
 * 4. System PATH fallback ("ffmpeg")
 */
export function getFFmpegPath(): string {
  // 1. Explicit env override
  if (process.env.FFMPEG_PATH && fs.existsSync(/*turbopackIgnore: true*/ process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }

  // 2. Bundled static binary from ffmpeg-static (ESM / CJS safe)
  const staticPath = (typeof ffmpegStatic === "string" ? ffmpegStatic : (ffmpegStatic as unknown as { default?: string })?.default) || "";
  if (staticPath && fs.existsSync(/*turbopackIgnore: true*/ staticPath)) {
    return staticPath;
  }

  // 3. Fallback to direct path in node_modules
  const directNodeModulesPath = "./node_modules/ffmpeg-static/ffmpeg";
  if (fs.existsSync(/*turbopackIgnore: true*/ directNodeModulesPath)) {
    return directNodeModulesPath;
  }

  // 4. Fallback to system ffmpeg command
  return "ffmpeg";
}

/**
 * Runs server-side diagnostics on the FFmpeg setup.
 */
export function getFFmpegDiagnostics(): FFmpegDiagnostics {
  const resolvedPath = getFFmpegPath();
  let ffmpegDetected = false;
  let version: string | null = null;

  try {
    const output = execSync(`"${resolvedPath}" -version`, { encoding: "utf8", timeout: 3000 });
    const firstLine = output.split("\n")[0] || "";
    if (firstLine.toLowerCase().includes("ffmpeg version")) {
      ffmpegDetected = true;
      version = firstLine.trim();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[FFmpeg Resolver] Execution test failed:", message);
  }

  return {
    ffmpegDetected,
    executablePath: resolvedPath,
    version,
    isStaticBundle: typeof ffmpegStatic === "string" && resolvedPath === ffmpegStatic,
    environment: process.env.VERCEL ? "Vercel Serverless" : process.env.NODE_ENV || "development",
  };
}
