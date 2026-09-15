import { MediaProvider, MediaAsset } from "./types";
import { DirectorScene } from "../schemas/director-plan";

export class PexelsProvider implements MediaProvider {
  readonly name = "Pexels";
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PEXELS_API_KEY;
  }

  async searchVideos(query: string, options?: { perPage?: number; minDuration?: number }): Promise<MediaAsset[]> {
    if (!this.apiKey) {
      console.warn("PEXELS_API_KEY is not set. Falling back to sample assets.");
      return this.getFallbackAssets(query);
    }

    const perPage = options?.perPage || 5;
    try {
      const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
        headers: {
          Authorization: this.apiKey,
        },
      });

      if (!res.ok) {
        console.error(`Pexels API error ${res.status}: ${res.statusText}`);
        return this.getFallbackAssets(query);
      }

      const data = await res.json();
      if (!data.videos || data.videos.length === 0) {
        return this.getFallbackAssets(query);
      }

      return data.videos.map((v: any) => {
        const files = v.video_files || [];
        const bestFile = files.find((f: any) => f.quality === "hd" && f.width >= 1080) || files[0] || {};

        return {
          provider: this.name,
          assetId: String(v.id),
          title: `Pexels Video ${v.id} (${v.user?.name || "Unknown"})`,
          url: v.url,
          downloadUrl: bestFile.link || "",
          previewUrl: v.image || "",
          duration: v.duration || 10,
          width: bestFile.width || 1920,
          height: bestFile.height || 1080,
          license: "Pexels License (Free to use)",
          author: v.user?.name,
        };
      });
    } catch (err) {
      console.error("Failed to query Pexels API:", err);
      return this.getFallbackAssets(query);
    }
  }

  async evaluateAndSelectBestShot(candidates: MediaAsset[], scene: DirectorScene): Promise<MediaAsset> {
    const list = candidates.length > 0 ? candidates : this.getFallbackAssets(scene.selectedAssetQuery);

    const scoredCandidates = list.map((asset, index) => {
      // 1. Story relevance based on query match & position
      const queryTerms = scene.selectedAssetQuery.toLowerCase().split(" ");
      const titleLower = asset.title.toLowerCase();
      const matchCount = queryTerms.filter((term) => term.length > 3 && titleLower.includes(term)).length;
      const storyRelevance = Math.min(98, Math.max(70, 85 + matchCount * 5 - index * 2));

      // 2. Composition score based on HD/4K resolution and high pixel density
      const resolutionScore = asset.width >= 3840 ? 98 : asset.width >= 1920 ? 92 : 80;
      const composition = resolutionScore;

      // 3. Movement score based on clip duration sufficiency for scene pacing
      const durationMatch = asset.duration >= scene.duration ? 95 : 75;
      const movement = durationMatch;

      // 4. Lighting & aesthetic alignment with scene visual goal
      const lighting = scene.lighting.toLowerCase().includes("dark") || scene.lighting.toLowerCase().includes("dim") ? 92 : 88;

      // 5. Continuity score
      const continuity = 94 - index;

      // Overall weighted composite score
      const overall = Math.round(
        storyRelevance * 0.35 +
        composition * 0.25 +
        movement * 0.20 +
        lighting * 0.10 +
        continuity * 0.10
      );

      return {
        ...asset,
        score: {
          storyRelevance,
          composition,
          movement,
          lighting,
          continuity,
          overall,
        },
      };
    });

    scoredCandidates.sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0));
    return scoredCandidates[0];
  }

  private getFallbackAssets(query: string): MediaAsset[] {
    const q = query.toLowerCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const samplePool: MediaAsset[] = [
      {
        provider: "Pexels (Sample)",
        assetId: "sample_ocean_surface",
        title: "Vast Ocean Surface Waves",
        url: `${appUrl}/samples/videos/ocean_surface.mp4`,
        downloadUrl: `${appUrl}/samples/videos/ocean_surface.mp4`,
        previewUrl: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
        duration: 15,
        width: 1920,
        height: 1080,
        license: "VESTIGE Curated Sample",
        author: "VESTIGE Studio",
      },
      {
        provider: "Pexels (Sample)",
        assetId: "sample_underwater_sunlight",
        title: "Sunlight Rays Filtering Through Underwater",
        url: `${appUrl}/samples/videos/underwater_sunlight.mp4`,
        downloadUrl: `${appUrl}/samples/videos/underwater_sunlight.mp4`,
        previewUrl: "https://images.pexels.com/photos/3046629/pexels-photo-3046629.jpeg",
        duration: 15,
        width: 1920,
        height: 1080,
        license: "VESTIGE Curated Sample",
        author: "VESTIGE Studio",
      },
      {
        provider: "Pexels (Sample)",
        assetId: "sample_deep_blue_water",
        title: "Deep Blue Water Abyss",
        url: `${appUrl}/samples/videos/deep_blue.mp4`,
        downloadUrl: `${appUrl}/samples/videos/deep_blue.mp4`,
        previewUrl: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
        duration: 15,
        width: 1920,
        height: 1080,
        license: "VESTIGE Curated Sample",
        author: "VESTIGE Studio",
      },
      {
        provider: "Pexels (Sample)",
        assetId: "sample_deep_sea_life",
        title: "Deep Sea Organism in Dark Waters",
        url: `${appUrl}/samples/videos/deep_sea_life.mp4`,
        downloadUrl: `${appUrl}/samples/videos/deep_sea_life.mp4`,
        previewUrl: "https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg",
        duration: 15,
        width: 1920,
        height: 1080,
        license: "VESTIGE Curated Sample",
        author: "VESTIGE Studio",
      },
      {
        provider: "Pexels (Sample)",
        assetId: "sample_rov_abyss",
        title: "Submersible ROV Exploring Abyssal Seafloor",
        url: `${appUrl}/samples/videos/rov_abyss.mp4`,
        downloadUrl: `${appUrl}/samples/videos/rov_abyss.mp4`,
        previewUrl: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg",
        duration: 15,
        width: 1920,
        height: 1080,
        license: "VESTIGE Curated Sample",
        author: "VESTIGE Studio",
      }
    ];

    if (q.includes("sunlight") || q.includes("surface") || q.includes("ray")) {
      return [samplePool[1], samplePool[0], samplePool[2]];
    }
    if (q.includes("life") || q.includes("organism") || q.includes("jellyfish") || q.includes("creature")) {
      return [samplePool[3], samplePool[2], samplePool[4]];
    }
    if (q.includes("rov") || q.includes("submersible") || q.includes("abyss") || q.includes("floor")) {
      return [samplePool[4], samplePool[3], samplePool[2]];
    }
    if (q.includes("deep") || q.includes("darkness")) {
      return [samplePool[2], samplePool[3], samplePool[1]];
    }

    return samplePool;
  }
}
