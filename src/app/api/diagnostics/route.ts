import { NextResponse } from "next/server";
import { getFFmpegDiagnostics } from "@/lib/editing/render/ffmpeg-resolver";

export async function GET() {
  const diagnostics = getFFmpegDiagnostics();
  return NextResponse.json({
    status: diagnostics.ffmpegDetected ? "ok" : "ffmpeg_missing",
    diagnostics,
    timestamp: new Date().toISOString(),
  });
}
