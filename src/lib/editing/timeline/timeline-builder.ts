import { DirectorPlan } from "../../schemas/director-plan";
import { MediaAsset, SoundAsset } from "../../providers/types";
import { CinematicTimeline, VideoClipItem, AudioClipItem } from "../types";
import { getColorPreset } from "../color/presets";
import { EXPORT_PRESETS } from "../presets/export-presets";

export function generateTimelineFromDirectorPlan(
  plan: DirectorPlan,
  selectedAssets: { sceneId: string; video: MediaAsset; sound?: SoundAsset }[],
  exportPresetId: string = "SHORT_HIGH"
): CinematicTimeline {
  const preset = EXPORT_PRESETS[exportPresetId] || EXPORT_PRESETS.SHORT_HIGH;
  let currentTimelineTime = 0;

  const videoClips: VideoClipItem[] = [];
  const audioClipsA1: AudioClipItem[] = []; // Environment audio
  const audioClipsA2: AudioClipItem[] = []; // Secondary audio

  plan.scenes.forEach((scene) => {
    const assetMatch = selectedAssets.find((a) => a.sceneId === scene.sceneId);
    const videoAsset = assetMatch?.video;
    const soundAsset = assetMatch?.sound;

    const clipDuration = scene.duration;

    // 1. Construct Video Clip
    if (videoAsset) {
      const colorPreset = getColorPreset(scene.colorPreset);
      const videoClip: VideoClipItem = {
        id: `vclip_${scene.sceneId}`,
        sceneId: scene.sceneId,
        sourceUrl: videoAsset.downloadUrl || videoAsset.url,
        startInSource: 0,
        timelineStart: currentTimelineTime,
        duration: clipDuration,
        transform: {
          positionX: 0,
          positionY: 0,
        },
        color: colorPreset.config,
        colorPresetName: scene.colorPreset,
        transitionIn: {
          type: scene.cutStrategy === "fade_to_black" ? "fade_to_black" : scene.cutStrategy === "crossfade" ? "crossfade" : "none",
          duration: scene.transitionDuration || 0.5,
        },
        transitionOut: {
          type: "none",
          duration: 0,
        },
      };
      videoClips.push(videoClip);
    }

    // 2. Construct Audio Clips (with J-cut and L-cut offsets!)
    if (soundAsset) {
      const jOffset = scene.jCutOffset || 0; // Negative number e.g. -1.0s means start earlier
      const lOffset = scene.lCutOffset || 0; // Positive number e.g. +1.0s means end later

      const audioStart = Math.max(0, currentTimelineTime + jOffset);
      const audioDuration = clipDuration + Math.abs(jOffset) + lOffset;

      const audioClip: AudioClipItem = {
        id: `aclip_env_${scene.sceneId}`,
        sceneId: scene.sceneId,
        sourceUrl: soundAsset.downloadUrl,
        track: "A1_environment",
        timelineStart: audioStart,
        duration: audioDuration,
        fadeInDuration: Math.abs(jOffset) > 0 ? 0.8 : 0.3,
        fadeOutDuration: lOffset > 0 ? 1.0 : 0.3,
        volume: scene.soundLevel ?? 0.8,
      };

      if (scene.soundCategory === "secondary_effects") {
        audioClipsA2.push({ ...audioClip, track: "A2_secondary" });
      } else {
        audioClipsA1.push(audioClip);
      }
    }

    currentTimelineTime += clipDuration;
  });

  return {
    id: `timeline_${Date.now()}`,
    title: plan.title,
    targetWidth: preset.width,
    targetHeight: preset.height,
    fps: preset.fps,
    totalDuration: currentTimelineTime,
    videoTrack: {
      id: "track_v1",
      name: "V1 — Primary Footage",
      clips: videoClips,
    },
    audioTracks: [
      {
        id: "track_a1",
        name: "A1 — Environment Ambience",
        type: "A1_environment",
        clips: audioClipsA1,
        muted: false,
        solo: false,
        gain: 1.0,
      },
      {
        id: "track_a2",
        name: "A2 — Secondary Acoustic Effects",
        type: "A2_secondary",
        clips: audioClipsA2,
        muted: false,
        solo: false,
        gain: 0.9,
      },
      {
        id: "track_a3",
        name: "A3 — Voiceover (Future)",
        type: "A3_voiceover",
        clips: [],
        muted: false,
        solo: false,
        gain: 1.0,
      },
      {
        id: "track_a4",
        name: "A4 — Music Score (Future)",
        type: "A4_music",
        clips: [],
        muted: false,
        solo: false,
        gain: 0.8,
      },
    ],
  };
}
