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
 * Dynamically resolves the FFmpeg executable path across Node, Next.js server, and Vercel serverless runtimes.
 */
export function getFFmpegPath(): string {
  // 1. Explicit env override
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }

  // 2. Import from ffmpeg-static package
  const staticPath = typeof ffmpegStatic === "string" ? ffmpegStatic : (ffmpegStatic as unknown as { default?: string })?.default;
  if (staticPath && typeof staticPath === "string" && fs.existsSync(staticPath)) {
    return staticPath;
  }

  // 3. Project local node_modules fallback
  const nodeModulesPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg");
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath;
  }

  // 4. System PATH fallback
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
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn("[FFmpeg Resolver] Execution test failed:", errMsg);
  }

  return {
    ffmpegDetected,
    executablePath: resolvedPath,
    version,
    isStaticBundle: resolvedPath.includes("ffmpeg-static"),
    environment: process.env.VERCEL ? "Vercel Serverless" : process.env.NODE_ENV || "development",
  };
}
