import { z } from "zod";

export const ShotTypeSchema = z.enum([
  "extreme_wide",
  "wide",
  "medium",
  "close_up",
  "macro_detail",
  "aerial",
  "pov",
  "environmental",
  "scientific"
]);

export const CutStrategySchema = z.enum([
  "hard_cut",
  "match_cut",
  "motivated_cut",
  "action_cut",
  "visual_continuity",
  "fade_to_black",
  "crossfade",
  "dip_to_black"
]);

export const ShotCandidateScoreSchema = z.object({
  storyRelevance: z.number().min(0).max(100),
  composition: z.number().min(0).max(100),
  movement: z.number().min(0).max(100),
  lighting: z.number().min(0).max(100),
  continuity: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});

export const DirectorSceneSchema = z.object({
  sceneId: z.string(),
  duration: z.number().positive(),
  purpose: z.string(),
  emotion: z.string(),
  visualGoal: z.string(),
  shotType: ShotTypeSchema,
  cameraAngle: z.string(),
  cameraMotion: z.string(),
  composition: z.string(),
  lighting: z.string(),
  colorPreset: z.enum([
    "Natural Documentary",
    "Deep Ocean",
    "Cold Scientific",
    "Night",
    "Warm Memory",
    "Neutral"
  ]),
  selectedAssetQuery: z.string(),
  selectionReason: z.string(),
  cutStrategy: CutStrategySchema,
  transitionDuration: z.number().default(0.5),
  soundQuery: z.string().optional(),
  soundCategory: z.enum(["environment", "secondary_effects", "silence"]).default("environment"),
  soundDuration: z.number().optional(),
  soundLevel: z.number().min(0).max(1).default(0.8),
  jCutOffset: z.number().default(0), // Audio starts before visual transition
  lCutOffset: z.number().default(0), // Audio continues after visual transition
  editorialNotes: z.object({
    whyThisShot: z.string(),
    whyThisDuration: z.string(),
    whyThisCut: z.string(),
    whyThisTransition: z.string(),
    whyThisSound: z.string(),
    whyThisColor: z.string(),
  })
});

export const DirectorPlanSchema = z.object({
  title: z.string(),
  concept: z.string(),
  targetAspect: z.enum(["9:16", "16:9"]).default("9:16"),
  estimatedDuration: z.number(),
  storyArc: z.string(),
  visualLanguage: z.string(),
  colorLanguage: z.string(),
  editingStyle: z.string(),
  pacing: z.string(),
  soundLanguage: z.string(),
  scenes: z.array(DirectorSceneSchema),
});

export type ShotType = z.infer<typeof ShotTypeSchema>;
export type CutStrategy = z.infer<typeof CutStrategySchema>;
export type ShotCandidateScore = z.infer<typeof ShotCandidateScoreSchema>;
export type DirectorScene = z.infer<typeof DirectorSceneSchema>;
export type DirectorPlan = z.infer<typeof DirectorPlanSchema>;
