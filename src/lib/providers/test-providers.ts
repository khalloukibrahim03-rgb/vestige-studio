import { PexelsProvider } from "./pexels-provider";
import { FreesoundProvider } from "./freesound-provider";
import { GeminiDirectorProvider } from "./gemini-director-provider";

async function testProviders() {
  console.log("=== Testing Provider Architecture ===");

  const director = new GeminiDirectorProvider();
  const pexels = new PexelsProvider();
  const freesound = new FreesoundProvider();

  console.log("1. Generating Director Plan for 'THE DEEP IS NOT EMPTY'...");
  const plan = await director.generateDirectorPlan("THE DEEP IS NOT EMPTY", "9:16");
  console.log(`Plan generated: "${plan.title}" with ${plan.scenes.length} scenes.`);

  console.log("2. Testing Media Provider asset search...");
  const firstScene = plan.scenes[0];
  const videoCandidates = await pexels.searchVideos(firstScene.selectedAssetQuery);
  console.log(`Pexels returned ${videoCandidates.length} candidate clips.`);

  const bestVideo = await pexels.evaluateAndSelectBestShot(videoCandidates, firstScene);
  console.log(`Best shot selected: ${bestVideo.title} (Overall Score: ${bestVideo.score?.overall})`);

  console.log("3. Testing Sound Provider asset search...");
  const soundCandidates = await freesound.searchSounds(firstScene.soundQuery || "ocean waves");
  console.log(`Freesound returned ${soundCandidates.length} audio tracks. First: ${soundCandidates[0]?.title}`);

  console.log("=== All Provider Layer Checks Passed Successfully ===");
}

testProviders().catch(console.error);
