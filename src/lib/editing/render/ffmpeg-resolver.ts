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
 * 2. Static bundled binary via `ffmpeg-static`
 * 3. Fallback to node_modules ffmpeg-static path
 * 4. System PATH fallback ("ffmpeg")
 */
export function getFFmpegPath(): string {
  // 1. Explicit env override
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }

  // 2. Bundled static binary from ffmpeg-static
  const staticPath = typeof ffmpegStatic === "string"
    ? ffmpegStatic
    : (ffmpegStatic as { default?: string })?.default;

  if (staticPath && typeof staticPath === "string" && fs.existsSync(staticPath)) {
    return staticPath;
  }

  // 3. Check relative node_modules ffmpeg-static path
  const nodeModulesPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg");
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath;
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
    isStaticBundle: resolvedPath.includes("ffmpeg-static"),
    environment: process.env.VERCEL ? "Vercel Serverless" : process.env.NODE_ENV || "development",
  };
}
