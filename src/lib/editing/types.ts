export interface TransformConfig {
  cropX?: number; // 0 to 1
  cropY?: number; // 0 to 1
  cropWidth?: number; // 0 to 1
  cropHeight?: number; // 0 to 1
  scale?: number; // e.g. 1.0 to 1.2
  positionX?: number; // center offset -1 to 1
  positionY?: number; // center offset -1 to 1
}

export interface ColorConfig {
  exposure?: number; // -1 to 1
  contrast?: number; // 0.5 to 1.5
  saturation?: number; // 0 to 2
  temperature?: number; // -1 (cool blue) to +1 (warm orange)
  tint?: number; // -1 to 1
  highlights?: number; // -1 to 1
  shadows?: number; // -1 to 1
  vignette?: number; // 0 to 1
}

export type TransitionType = "none" | "crossfade" | "fade_to_black" | "fade_from_black" | "dip_to_black" | "visual_continuity";

export interface TransitionConfig {
  type: TransitionType;
  duration: number; // in seconds
}

export interface VideoClipItem {
  id: string;
  sceneId: string;
  sourceUrl: string;
  localFilePath?: string;
  startInSource: number;
  timelineStart: number;
  duration: number;
  transform: TransformConfig;
  color: ColorConfig;
  colorPresetName: string;
  transitionIn: TransitionConfig;
  transitionOut: TransitionConfig;
  motion?: {
    type: "none" | "push_in" | "pull_out" | "pan_left" | "pan_right";
    speed: number;
  };
}

export interface AudioClipItem {
  id: string;
  sceneId?: string;
  sourceUrl: string;
  localFilePath?: string;
  track: "A1_environment" | "A2_secondary" | "A3_voiceover" | "A4_music";
  timelineStart: number; // includes J-cut negative offset
  duration: number; // includes L-cut trailing extension
  fadeInDuration: number;
  fadeOutDuration: number;
  volume: number; // 0 to 1
  ducking?: boolean;
}

export interface TimelineTrackVideo {
  id: string;
  name: string;
  clips: VideoClipItem[];
}

export interface TimelineTrackAudio {
  id: string;
  name: string;
  type: "A1_environment" | "A2_secondary" | "A3_voiceover" | "A4_music";
  clips: AudioClipItem[];
  muted: boolean;
  solo: boolean;
  gain: number;
}

export interface CinematicTimeline {
  id: string;
  title: string;
  targetWidth: number;
  targetHeight: number;
  fps: number;
  totalDuration: number;
  videoTrack: TimelineTrackVideo;
  audioTracks: TimelineTrackAudio[];
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  fps: number;
  videoBitrate: string;
  audioBitrate: string;
  codecVideo: string;
  codecAudio: string;
}
