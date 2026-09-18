import { NextRequest, NextResponse } from "next/server";
import { GeminiDirectorProvider } from "@/lib/providers/gemini-director-provider";
import { PexelsProvider } from "@/lib/providers/pexels-provider";
import { FreesoundProvider } from "@/lib/providers/freesound-provider";
import { generateTimelineFromDirectorPlan } from "@/lib/editing/timeline/timeline-builder";
import { projectStore, ProjectData } from "@/lib/services/project-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, targetAspect = "9:16", apiKeys } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const projectId = `proj_${Date.now()}`;
    const now = new Date().toISOString();

    const project: ProjectData = {
      id: projectId,
      title: prompt.slice(0, 30).toUpperCase(),
      prompt,
      targetAspect,
      status: "directing",
      createdAt: now,
      updatedAt: now,
    };

    projectStore.set(projectId, project);

    // 1. Generate Director Plan with Gemini Provider
    const directorProvider = new GeminiDirectorProvider(apiKeys?.geminiApiKey);
    const directorPlan = await directorProvider.generateDirectorPlan(prompt, targetAspect);

    project.directorPlan = directorPlan;
    project.title = directorPlan.title;
    project.status = "sourcing";
    projectStore.set(projectId, project);

    // 2. Fetch Footage & Audio Assets with Pexels & Freesound Providers
    const pexelsProvider = new PexelsProvider(apiKeys?.pexelsApiKey);
    const freesoundProvider = new FreesoundProvider(apiKeys?.freesoundApiKey);

    const selectedAssets = [];
    for (const scene of directorPlan.scenes) {
      const videoCandidates = await pexelsProvider.searchVideos(scene.selectedAssetQuery);
      const bestVideo = await pexelsProvider.evaluateAndSelectBestShot(videoCandidates, scene);

      let bestSound;
      if (scene.soundQuery) {
        const soundCandidates = await freesoundProvider.searchSounds(scene.soundQuery);
        bestSound = soundCandidates[0];
      }

      selectedAssets.push({
        sceneId: scene.sceneId,
        video: bestVideo,
        sound: bestSound,
      });
    }

    project.selectedAssets = selectedAssets;

    // 3. Construct Cinematic Timeline
    const timeline = generateTimelineFromDirectorPlan(directorPlan, selectedAssets, "SHORT_HIGH");
    project.timeline = timeline;
    project.status = "ready";
    project.updatedAt = new Date().toISOString();
    projectStore.set(projectId, project);

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Project generation error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate project" }, { status: 500 });
  }
}

export async function GET() {
  const projects = projectStore.list();
  return NextResponse.json({ projects });
}
