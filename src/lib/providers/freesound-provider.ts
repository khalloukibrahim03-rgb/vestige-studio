import { SoundProvider, SoundAsset } from "./types";

export class FreesoundProvider implements SoundProvider {
  readonly name = "Freesound";
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FREESOUND_API_KEY;
  }

  async searchSounds(query: string, options?: { perPage?: number; minDuration?: number }): Promise<SoundAsset[]> {
    if (!this.apiKey) {
      console.warn("FREESOUND_API_KEY is not set. Falling back to sample audio assets.");
      return this.getFallbackSounds(query);
    }

    const perPage = options?.perPage || 3;
    try {
      const res = await fetch(`https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&fields=id,name,previews,duration,license,username&page_size=${perPage}&token=${this.apiKey}`);

      if (!res.ok) {
        console.error(`Freesound API error ${res.status}: ${res.statusText}`);
        return this.getFallbackSounds(query);
      }

      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        return this.getFallbackSounds(query);
      }

      interface FreesoundResult {
        id: number;
        name: string;
        previews?: Record<string, string>;
        duration?: number;
        license?: string;
        username?: string;
      }

      return data.results.map((s: FreesoundResult) => ({
        provider: this.name,
        assetId: String(s.id),
        title: s.name,
        downloadUrl: s.previews?.["preview-hq-mp3"] || s.previews?.["preview-lq-mp3"] || "",
        duration: s.duration || 10,
        license: s.license || "Creative Commons",
        author: s.username,
        category: "environment",
      }));
    } catch (err) {
      console.error("Failed to query Freesound API:", err);
      return this.getFallbackSounds(query);
    }
  }

  private getFallbackSounds(query: string): SoundAsset[] {
    const q = query.toLowerCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const samplePool: SoundAsset[] = [
      {
        provider: "Freesound (Sample)",
        assetId: "sample_ocean_waves_ambient",
        title: "Deep Ocean Waves & Wind Ambience",
        downloadUrl: `${appUrl}/samples/sounds/ocean_ambient.mp3`,
        duration: 30,
        license: "Public Domain",
        author: "VESTIGE Audio Library",
        category: "environment",
      },
      {
        provider: "Freesound (Sample)",
        assetId: "sample_underwater_hydrophone",
        title: "Underwater Muffled Hydrophone Drone",
        downloadUrl: `${appUrl}/samples/sounds/underwater_drone.mp3`,
        duration: 30,
        license: "Public Domain",
        author: "VESTIGE Audio Library",
        category: "environment",
      },
      {
        provider: "Freesound (Sample)",
        assetId: "sample_abyssal_rumble",
        title: "Deep Sea Pressure Low Frequency Rumble",
        downloadUrl: `${appUrl}/samples/sounds/abyssal_rumble.mp3`,
        duration: 30,
        license: "Public Domain",
        author: "VESTIGE Audio Library",
        category: "environment",
      },
      {
        provider: "Freesound (Sample)",
        assetId: "sample_sonar_ping",
        title: "Submersible Sonar & Mechanical Humming",
        downloadUrl: `${appUrl}/samples/sounds/sonar_ping.mp3`,
        duration: 15,
        license: "Public Domain",
        author: "VESTIGE Audio Library",
        category: "secondary_effects",
      }
    ];

    if (q.includes("hydrophone") || q.includes("underwater") || q.includes("submerged")) {
      return [samplePool[1], samplePool[2]];
    }
    if (q.includes("rumble") || q.includes("abyss") || q.includes("darkness") || q.includes("pressure")) {
      return [samplePool[2], samplePool[1]];
    }
    if (q.includes("sonar") || q.includes("rov") || q.includes("ping")) {
      return [samplePool[3], samplePool[2]];
    }

    return samplePool;
  }
}
