import ffmpegStatic from "ffmpeg-static";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

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
 * 2. Static bundled binary via `ffmpeg-static` (handles ESM default export differences)
 * 3. Direct node_modules path (node_modules/ffmpeg-static/ffmpeg)
 * 4. System PATH fallback ("ffmpeg")
 */
export function getFFmpegPath(): string {
  // 1. Explicit env override
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }

  // 2. Bundled static binary from ffmpeg-static
  const rawStatic = typeof ffmpegStatic === "string" ? ffmpegStatic : (ffmpegStatic as any)?.default;
  if (rawStatic && typeof rawStatic === "string" && fs.existsSync(rawStatic)) {
    return rawStatic;
  }

  // 3. Direct node_modules path
  const localNodeModulesFfmpeg = path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg");
  if (fs.existsSync(localNodeModulesFfmpeg)) {
    return localNodeModulesFfmpeg;
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
  } catch (err: any) {
    console.warn("[FFmpeg Resolver] Execution test failed:", err?.message || err);
  }

  const rawStatic = typeof ffmpegStatic === "string" ? ffmpegStatic : (ffmpegStatic as any)?.default;

  return {
    ffmpegDetected,
    executablePath: resolvedPath,
    version,
    isStaticBundle: resolvedPath === rawStatic || resolvedPath.includes("ffmpeg-static"),
    environment: process.env.VERCEL ? "Vercel Serverless" : process.env.NODE_ENV || "development",
  };
}
