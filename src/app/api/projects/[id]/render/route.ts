import { NextRequest, NextResponse } from "next/server";
import { projectStore } from "@/lib/services/project-store";
import { ModularRenderPipeline } from "@/lib/editing/render/render-pipeline";
import { EXPORT_PRESETS } from "@/lib/editing/presets/export-presets";

export const maxDuration = 60; // 60s max execution time for Vercel Serverless Function

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = projectStore.get(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.timeline) {
      return NextResponse.json({ error: "Timeline is not compiled yet" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const presetId = body.presetId || "SHORT_HIGH";
    const exportPreset = EXPORT_PRESETS[presetId] || EXPORT_PRESETS.SHORT_HIGH;

    project.status = "rendering";
    project.renderProgress = { percent: 0, stage: "starting", message: "Initializing FFmpeg pipeline..." };
    projectStore.set(id, project);

    const renderer = new ModularRenderPipeline();

    // Await render execution directly in serverless handler to ensure process doesn't get frozen
    try {
      const outputPath = await renderer.render(project.timeline, exportPreset, (progress) => {
        project.renderProgress = {
          percent: progress.percent,
          stage: progress.stage,
          message: progress.message,
        };
        project.updatedAt = new Date().toISOString();
        projectStore.set(id, project);
      });

      const filename = outputPath.split("/").pop();
      project.status = "completed";
      project.renderedVideoUrl = `/api/videos/${filename}`;
      project.renderProgress = { percent: 100, stage: "completed", message: "Render completed successfully!" };
      project.updatedAt = new Date().toISOString();
      projectStore.set(id, project);

      return NextResponse.json({ success: true, message: "Render completed", project });
    } catch (renderErr: any) {
      console.error("FFmpeg execution error during render:", renderErr);
      project.status = "failed";
      project.renderProgress = { percent: 0, stage: "failed", message: renderErr.message };
      projectStore.set(id, project);
      return NextResponse.json({ error: renderErr.message || "Render failed" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Render route error:", error);
    return NextResponse.json({ error: error.message || "Failed to trigger render" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = projectStore.get(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
