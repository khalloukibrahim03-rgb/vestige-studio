import { GeminiDirectorProvider } from "../providers/gemini-director-provider";
import { PexelsProvider } from "../providers/pexels-provider";
import { FreesoundProvider } from "../providers/freesound-provider";
import { generateTimelineFromDirectorPlan } from "./timeline/timeline-builder";
import { ModularRenderPipeline } from "./render/render-pipeline";
import { EXPORT_PRESETS } from "./presets/export-presets";

async function testEditingEngine() {
  console.log("=== Testing Editing Engine & FFmpeg Modular Render Pipeline ===");

  const director = new GeminiDirectorProvider();
  const pexels = new PexelsProvider();
  const freesound = new FreesoundProvider();

  console.log("1. Generating Director Plan...");
  const plan = await director.generateDirectorPlan("THE DEEP IS NOT EMPTY", "9:16");

  console.log("2. Resolving media and audio assets for each scene...");
  const selectedAssets = [];
  for (const scene of plan.scenes) {
    const videoCandidates = await pexels.searchVideos(scene.selectedAssetQuery);
    const bestVideo = await pexels.evaluateAndSelectBestShot(videoCandidates, scene);

    let bestSound;
    if (scene.soundQuery) {
      const soundCandidates = await freesound.searchSounds(scene.soundQuery);
      bestSound = soundCandidates[0];
    }

    selectedAssets.push({
      sceneId: scene.sceneId,
      video: bestVideo,
      sound: bestSound,
    });
  }

  console.log("3. Compiling Cinematic Timeline with J/L-cuts...");
  const timeline = generateTimelineFromDirectorPlan(plan, selectedAssets, "SHORT_HIGH");
  console.log(`Timeline compiled. Total Duration: ${timeline.totalDuration}s. Video Clips: ${timeline.videoTrack.clips.length}`);

  console.log("4. Invoking FFmpeg Modular Render Pipeline...");
  const renderer = new ModularRenderPipeline("/tmp/vestige_test_cache", "/tmp/vestige_test_out");
  const outputPath = await renderer.render(timeline, EXPORT_PRESETS.SHORT_HIGH, (p) => {
    console.log(`Progress [${p.percent}%] Stage: ${p.stage} - ${p.message}`);
  });

  console.log("=== RENDER SUCCESSFUL ===");
  console.log("Output video file generated at:", outputPath);
}

testEditingEngine().catch(console.error);
