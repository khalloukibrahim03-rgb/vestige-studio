import { DirectorPlan } from "@/lib/schemas/director-plan";
import { MediaAsset, SoundAsset } from "@/lib/providers/types";
import { CinematicTimeline } from "@/lib/editing/types";

export interface ProjectData {
  id: string;
  title: string;
  prompt: string;
  targetAspect: "9:16" | "16:9";
  status: "draft" | "directing" | "sourcing" | "ready" | "rendering" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  directorPlan?: DirectorPlan;
  selectedAssets?: { sceneId: string; video: MediaAsset; sound?: SoundAsset }[];
  timeline?: CinematicTimeline;
  renderedVideoUrl?: string;
  renderProgress?: {
    percent: number;
    stage: string;
    message: string;
  };
}

// In-memory project repository for fast local operations (easily swappable to Supabase/Postgres)
class ProjectStore {
  private projects: Map<string, ProjectData> = new Map();

  get(id: string): ProjectData | undefined {
    return this.projects.get(id);
  }

  set(id: string, project: ProjectData): void {
    this.projects.set(id, project);
  }

  list(): ProjectData[] {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

export const projectStore = new ProjectStore();
