import { DirectorPlan, DirectorScene } from "../schemas/director-plan";

export interface MediaAsset {
  provider: string;
  assetId: string;
  title: string;
  url: string;
  downloadUrl: string;
  previewUrl: string;
  duration: number;
  width: number;
  height: number;
  license: string;
  author?: string;
  score?: {
    storyRelevance: number;
    composition: number;
    movement: number;
    lighting: number;
    continuity: number;
    overall: number;
  };
}

export interface SoundAsset {
  provider: string;
  assetId: string;
  title: string;
  downloadUrl: string;
  duration: number;
  license: string;
  author?: string;
  category: "environment" | "secondary_effects" | "voiceover" | "music";
}

export interface MediaProvider {
  readonly name: string;
  searchVideos(query: string, options?: { perPage?: number; minDuration?: number }): Promise<MediaAsset[]>;
  evaluateAndSelectBestShot(candidates: MediaAsset[], scene: DirectorScene): Promise<MediaAsset>;
}

export interface SoundProvider {
  readonly name: string;
  searchSounds(query: string, options?: { perPage?: number; minDuration?: number }): Promise<SoundAsset[]>;
}

export interface AIDirectorProvider {
  readonly name: string;
  generateDirectorPlan(prompt: string, targetAspect?: "9:16" | "16:9"): Promise<DirectorPlan>;
}
