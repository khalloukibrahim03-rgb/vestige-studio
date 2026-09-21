import { AudioClipItem } from "../types";

export function calculateAudioFilterParams(clip: AudioClipItem) {
  const delayMs = Math.round(Math.max(0, clip.timelineStart) * 1000);
  const volume = clip.volume ?? 0.8;

  return {
    trimFilter: `atrim=0:${clip.duration}`,
    ptsFilter: `asetpts=PTS-STARTPTS`,
    volumeFilter: `volume=${volume}`,
    delayFilter: `adelay=${delayMs}|${delayMs}`,
  };
}
