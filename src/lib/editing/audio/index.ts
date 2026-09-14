import { AudioClipItem, TimelineTrackAudio } from "../types";

export interface AudioMixConfig {
  masterGain: number; // 0.0 to 1.5
  tracks: TimelineTrackAudio[];
}

/**
 * Builds FFmpeg audio processing filter string for an audio clip with volume and J/L cut timing offsets.
 */
export function buildAudioClipFilter(clip: AudioClipItem, inputIndex: number): string {
  const delayMs = Math.round(Math.max(0, clip.timelineStart) * 1000);
  const volume = clip.volume ?? 0.8;
  return `[${inputIndex}:a]atrim=0:${clip.duration},asetpts=PTS-STARTPTS,volume=${volume},adelay=${delayMs}|${delayMs}`;
}

export function createAudioTrack(
  id: string,
  name: string,
  type: TimelineTrackAudio["type"],
  gain: number = 1.0
): TimelineTrackAudio {
  return {
    id,
    name,
    type,
    clips: [],
    muted: false,
    solo: false,
    gain,
  };
}
