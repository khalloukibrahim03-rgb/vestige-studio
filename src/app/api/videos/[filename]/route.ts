import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join("/tmp/vestige_output", safeFilename);

    try {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `inline; filename="${safeFilename}"`,
          "Accept-Ranges": "bytes",
        },
      });
    } catch {
      return NextResponse.json({ error: "Video file not found or expired" }, { status: 404 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error streaming video";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
