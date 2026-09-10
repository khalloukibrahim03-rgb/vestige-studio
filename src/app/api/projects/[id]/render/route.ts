import { NextRequest, NextResponse } from "next/server";
import { projectStore } from "@/lib/services/project-store";
import { ModularRenderPipeline } from "@/lib/editing/render/render-pipeline";
import { EXPORT_PRESETS } from "@/lib/editing/presets/export-presets";

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

    // Asynchronous render background execution
    const renderer = new ModularRenderPipeline();

    renderer.render(project.timeline, exportPreset, (progress) => {
      project.renderProgress = {
        percent: progress.percent,
        stage: progress.stage,
        message: progress.message,
      };
      if (progress.stage === "completed" && progress.outputPath) {
        const filename = progress.outputPath.split("/").pop();
        project.status = "completed";
        project.renderedVideoUrl = `/api/videos/${filename}`;
      } else if (progress.stage === "failed") {
        project.status = "failed";
      }
      project.updatedAt = new Date().toISOString();
      projectStore.set(id, project);
    }).catch((err) => {
      console.error("Render background execution error:", err);
      project.status = "failed";
      project.renderProgress = { percent: 0, stage: "failed", message: err.message };
      projectStore.set(id, project);
    });

    return NextResponse.json({ success: true, message: "Render started", project });
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
